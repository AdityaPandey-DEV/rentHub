import connectDB from '@/lib/db';
import Notification from '@/lib/models/Notification';
import { getAuthUser, authError, serverError, notFoundError, forbiddenError } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user) return authError();
    await connectDB();
    const { id } = await params;

    const notification = await Notification.findById(id);
    if (!notification) return notFoundError('Notification not found');
    if (notification.user.toString() !== user._id.toString()) return forbiddenError();

    notification.isRead = true;
    await notification.save();
    return Response.json({ success: true, data: notification });
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user) return authError();
    await connectDB();
    const { id } = await params;

    const notification = await Notification.findById(id);
    if (!notification) return notFoundError('Notification not found');
    if (notification.user.toString() !== user._id.toString()) return forbiddenError();

    await notification.deleteOne();
    return Response.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    return serverError(error);
  }
}
