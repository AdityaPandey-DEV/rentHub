import connectDB from '@/lib/db';
import Booking from '@/lib/models/Booking';
import { getAuthUser, authError, serverError } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) return authError();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const query = { tenant: user._id };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate({ path: 'room', select: 'roomNumber roomType rent images' })
      .populate({ path: 'property', select: 'title address images' })
      .populate('landlord', 'name email phone')
      .sort({ createdAt: -1 });

    return Response.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    return serverError(error);
  }
}
