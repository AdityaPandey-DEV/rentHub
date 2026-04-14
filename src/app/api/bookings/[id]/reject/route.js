import connectDB from '@/lib/db';
import Booking from '@/lib/models/Booking';
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

    const body = await request.json();
    booking.status = 'rejected';
    booking.rejectionReason = body.reason || 'Request rejected by landlord';
    await booking.save();

    await Notification.create({
      user: booking.tenant, title: 'Booking Rejected',
      message: `Your booking for ${booking.room.roomNumber} at ${booking.property.title} has been rejected`,
      type: 'booking', relatedId: booking._id
    });

    return Response.json({ success: true, data: booking });
  } catch (error) {
    return serverError(error);
  }
}
