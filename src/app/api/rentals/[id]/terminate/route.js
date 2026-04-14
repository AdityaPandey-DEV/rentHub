import connectDB from '@/lib/db';
import Rental from '@/lib/models/Rental';
import Room from '@/lib/models/Room';
import Property from '@/lib/models/Property';
import Notification from '@/lib/models/Notification';
import { getAuthUser, authError, serverError, notFoundError, forbiddenError, badRequest } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user) return authError();
    await connectDB();
    const { id } = await params;

    const rental = await Rental.findById(id).populate('room').populate('property');
    if (!rental) return notFoundError('Rental not found');
    if (rental.landlord.toString() !== user._id.toString() && user.role !== 'admin') return forbiddenError();
    if (rental.status !== 'active') return badRequest('Rental is not active');

    const body = await request.json();
    rental.status = 'terminated';
    rental.endDate = body.endDate || new Date();
    rental.terminationReason = body.reason;
    await rental.save();

    await Room.findByIdAndUpdate(rental.room._id, { status: 'vacant', currentTenant: null });
    await Property.findByIdAndUpdate(rental.property._id, { $inc: { availableRooms: 1 } });

    await Notification.create({
      user: rental.tenant, title: 'Rental Terminated',
      message: `Your rental for ${rental.room.roomNumber} at ${rental.property.title} has been terminated`,
      type: 'rental', relatedId: rental._id
    });

    return Response.json({ success: true, data: rental });
  } catch (error) {
    return serverError(error);
  }
}
