import { getAuthUser, authError, serverError, signToken, badRequest } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function PUT(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) return authError();

    await connectDB();
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return badRequest('Current password and new password are required');
    }

    const user = await User.findById(authUser._id).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
      return Response.json({ success: false, message: 'Current password is incorrect' }, { status: 401 });
    }

    user.password = newPassword;
    await user.save();

    const token = signToken({ id: user._id, role: user.role });
    return Response.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    return serverError(error);
  }
}
