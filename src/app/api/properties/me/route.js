import connectDB from '@/lib/db';
import Property from '@/lib/models/Property';
import { getAuthUser, authError, serverError, forbiddenError } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) return authError();
    if (!['landlord', 'admin'].includes(user.role)) return forbiddenError();

    await connectDB();
    const properties = await Property.find({ owner: user._id }).populate('rooms').sort({ createdAt: -1 });
    return Response.json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    return serverError(error);
  }
}
