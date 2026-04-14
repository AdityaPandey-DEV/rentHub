import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { signToken, serverError } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, password, phone, role } = await request.json();

    if (!name || !email || !password) {
      return Response.json({ success: false, message: 'Name, email and password are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ success: false, message: 'User already exists with this email' }, { status: 400 });
    }

    const user = await User.create({ name, email, password, phone, role: role || 'tenant' });
    const token = signToken({ id: user._id, role: user.role });

    return Response.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, avatar: user.avatar }
    }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
