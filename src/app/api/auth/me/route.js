import { getAuthUser, authError, serverError } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) return authError();
    return Response.json({ success: true, data: user });
  } catch (error) {
    return serverError(error);
  }
}
