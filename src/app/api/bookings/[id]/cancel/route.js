import connectDB from '@/lib/db';
import Booking from '@/lib/models/Booking';
import { getAuthUser, authError, serverError, notFoundError, forbiddenError, badRequest } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user) return authError();
    await connectDB();
    const { id } = await params;

    const booking = await Booking.findById(id);
    if (!booking) return notFoundError('Booking not found');
    if (booking.tenant.toString() !== user._id.toString()) return forbiddenError();
    if (booking.status !== 'pending') return badRequest('Can only cancel pending bookings');

    booking.status = 'cancelled';
    await booking.save();
    return Response.json({ success: true, data: booking });
  } catch (error) {
    return serverError(error);
  }
}
