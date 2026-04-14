import connectDB from '@/lib/db';
import Booking from '@/lib/models/Booking';
import Room from '@/lib/models/Room';
import Property from '@/lib/models/Property';
import Rental from '@/lib/models/Rental';
import Notification from '@/lib/models/Notification';
import { getAuthUser, authError, serverError, notFoundError, forbiddenError, badRequest } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user) return authError();
    await connectDB();
    const { id } = await params;

    const booking = await Booking.findById(id).populate('room').populate('property');
    if (!booking) return notFoundError('Booking not found');
    if (booking.landlord.toString() !== user._id.toString()) return forbiddenError();
    if (booking.status !== 'pending') return badRequest('Booking has already been processed');

    booking.status = 'approved';
    await booking.save();

    await Room.findByIdAndUpdate(booking.room._id, { status: 'occupied', currentTenant: booking.tenant });
    await Property.findByIdAndUpdate(booking.property._id, { $inc: { availableRooms: -1 } });

    await Rental.create({
      room: booking.room._id, property: booking.property._id, tenant: booking.tenant,
      landlord: booking.landlord, booking: booking._id, startDate: booking.moveInDate,
      monthlyRent: booking.room.rent, deposit: booking.room.deposit
    });

    await Booking.updateMany(
      { room: booking.room._id, _id: { $ne: booking._id }, status: 'pending' },
      { status: 'rejected', rejectionReason: 'Room has been rented to another tenant' }
    );

    await Notification.create({
      user: booking.tenant, title: 'Booking Approved!',
      message: `Your booking for ${booking.room.roomNumber} at ${booking.property.title} has been approved`,
      type: 'booking', relatedId: booking._id
    });

    return Response.json({ success: true, data: booking });
  } catch (error) {
    return serverError(error);
  }
}
