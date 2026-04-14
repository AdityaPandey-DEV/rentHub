import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { signToken, serverError } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return Response.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return Response.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ id: user._id, role: user.role });

    return Response.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, avatar: user.avatar }
    });
  } catch (error) {
    return serverError(error);
  }
}
