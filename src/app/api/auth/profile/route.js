import { getAuthUser, authError, serverError } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function PUT(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) return authError();

    await connectDB();
    const body = await request.json();
    const fieldsToUpdate = {};
    if (body.name) fieldsToUpdate.name = body.name;
    if (body.phone) fieldsToUpdate.phone = body.phone;
    if (body.address) fieldsToUpdate.address = body.address;

    const updatedUser = await User.findByIdAndUpdate(user._id, fieldsToUpdate, { new: true, runValidators: true });
    return Response.json({ success: true, data: updatedUser });
  } catch (error) {
    return serverError(error);
  }
}
