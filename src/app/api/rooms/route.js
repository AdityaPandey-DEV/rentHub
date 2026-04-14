import connectDB from '@/lib/db';
import Room from '@/lib/models/Room';
import Property from '@/lib/models/Property';
import { getAuthUser, authError, serverError, notFoundError, forbiddenError } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const minRent = searchParams.get('minRent');
    const maxRent = searchParams.get('maxRent');
    const roomType = searchParams.get('roomType');
    const amenities = searchParams.get('amenities');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const roomQuery = { status: 'vacant' };
    if (minRent) roomQuery.rent = { $gte: parseInt(minRent) };
    if (maxRent) roomQuery.rent = { ...roomQuery.rent, $lte: parseInt(maxRent) };
    if (roomType) roomQuery.roomType = roomType;
    if (amenities) roomQuery.amenities = { $all: amenities.split(',') };

    const skip = (page - 1) * limit;
    const totalDocs = await Room.countDocuments(roomQuery);

    let rooms = await Room.find(roomQuery)
      .populate({
        path: 'property',
        match: {
          isActive: true,
          ...(city && { 'address.city': new RegExp(city, 'i') }),
          ...(state && { 'address.state': new RegExp(state, 'i') })
        },
        populate: { path: 'owner', select: 'name email phone' }
      })
      .skip(skip).limit(limit).sort({ createdAt: -1 });

    const validRooms = rooms.filter(room => room.property !== null);

    return Response.json({
      success: true, count: validRooms.length, total: totalDocs,
      pages: Math.ceil(totalDocs / limit), currentPage: page, data: validRooms
    });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) return authError();
    if (!['landlord', 'admin'].includes(user.role)) return forbiddenError();

    await connectDB();
    const body = await request.json();
    const { propertyId } = body;
    const property = await Property.findById(propertyId);
    if (!property) return notFoundError('Property not found');
    if (property.owner.toString() !== user._id.toString()) return forbiddenError();

    body.property = propertyId;
    const room = await Room.create(body);

    property.totalRooms += 1;
    if (room.status === 'vacant') property.availableRooms += 1;
    await property.save();

    return Response.json({ success: true, data: room }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
