import connectDB from '@/lib/db';
import Rental from '@/lib/models/Rental';
import Room from '@/lib/models/Room';
import Property from '@/lib/models/Property';
import Notification from '@/lib/models/Notification';
import { getAuthUser, authError, serverError, notFoundError, forbiddenError, badRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) return authError();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    let query = {};
    if (user.role === 'tenant') query.tenant = user._id;
    else if (user.role === 'landlord') query.landlord = user._id;
    if (status) query.status = status;

    const rentals = await Rental.find(query)
      .populate({ path: 'room', select: 'roomNumber roomType rent images' })
      .populate({ path: 'property', select: 'title address images' })
      .populate('tenant', 'name email phone avatar')
      .populate('landlord', 'name email phone')
      .sort({ createdAt: -1 });

    return Response.json({ success: true, count: rentals.length, data: rentals });
  } catch (error) {
    return serverError(error);
  }
}
