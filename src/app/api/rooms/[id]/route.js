import connectDB from '@/lib/db';
import Room from '@/lib/models/Room';
import Property from '@/lib/models/Property';
import { getAuthUser, authError, serverError, notFoundError, forbiddenError } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const room = await Room.findById(id)
      .populate({ path: 'property', populate: { path: 'owner', select: 'name email phone avatar' } })
      .populate('currentTenant', 'name email phone');
    if (!room) return notFoundError('Room not found');
    return Response.json({ success: true, data: room });
  } catch (error) {
    return serverError(error);
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user) return authError();
    await connectDB();
    const { id } = await params;

    let room = await Room.findById(id).populate('property');
    if (!room) return notFoundError('Room not found');
    if (room.property.owner.toString() !== user._id.toString() && user.role !== 'admin') return forbiddenError();

    const previousStatus = room.status;
    const body = await request.json();
    room = await Room.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (previousStatus !== room.status) {
      const property = await Property.findById(room.property);
      if (previousStatus === 'vacant' && room.status !== 'vacant') property.availableRooms -= 1;
      else if (previousStatus !== 'vacant' && room.status === 'vacant') property.availableRooms += 1;
      await property.save();
    }

    return Response.json({ success: true, data: room });
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user) return authError();
    await connectDB();
    const { id } = await params;

    const room = await Room.findById(id).populate('property');
    if (!room) return notFoundError('Room not found');
    if (room.property.owner.toString() !== user._id.toString() && user.role !== 'admin') return forbiddenError();

    const property = await Property.findById(room.property._id);
    property.totalRooms -= 1;
    if (room.status === 'vacant') property.availableRooms -= 1;
    await property.save();
    await room.deleteOne();

    return Response.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    return serverError(error);
  }
}
