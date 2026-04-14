import jwt from 'jsonwebtoken';
import User from '@/lib/models/User';
import connectDB from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function getAuthUser(request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  
  if (!decoded) return null;

  await connectDB();
  const user = await User.findById(decoded.id);
  return user;
}

export function authError(message = 'Not authorized') {
  return Response.json({ success: false, message }, { status: 401 });
}

export function forbiddenError(message = 'Forbidden') {
  return Response.json({ success: false, message }, { status: 403 });
}

export function notFoundError(message = 'Not found') {
  return Response.json({ success: false, message }, { status: 404 });
}

export function badRequest(message = 'Bad request') {
  return Response.json({ success: false, message }, { status: 400 });
}

export function serverError(error) {
  console.error(error);
  return Response.json({ success: false, message: 'Server Error' }, { status: 500 });
}
