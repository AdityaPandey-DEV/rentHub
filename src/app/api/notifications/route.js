import connectDB from '@/lib/db';
import Notification from '@/lib/models/Notification';
import { getAuthUser, authError, serverError, notFoundError, forbiddenError } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) return authError();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unreadOnly');

    const query = { user: user._id };
    if (unreadOnly === 'true') query.isRead = false;

    const skip = (page - 1) * limit;
    const notifications = await Notification.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ user: user._id, isRead: false });

    return Response.json({
      success: true, count: notifications.length, total, unreadCount,
      pages: Math.ceil(total / limit), data: notifications
    });
  } catch (error) {
    return serverError(error);
  }
}

export async function PUT(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) return authError();
    await connectDB();
    await Notification.updateMany({ user: user._id, isRead: false }, { isRead: true });
    return Response.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) return authError();
    await connectDB();
    await Notification.deleteMany({ user: user._id, isRead: true });
    return Response.json({ success: true, message: 'Read notifications cleared' });
  } catch (error) {
    return serverError(error);
  }
}
