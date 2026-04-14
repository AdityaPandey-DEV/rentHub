import connectDB from '@/lib/db';
import Payment from '@/lib/models/Payment';
import Notification from '@/lib/models/Notification';
import { getAuthUser, authError, serverError, notFoundError, forbiddenError, badRequest } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user) return authError();
    await connectDB();
    const { id } = await params;

    const payment = await Payment.findById(id).populate('rental');
    if (!payment) return notFoundError('Payment not found');
    if (payment.landlord.toString() !== user._id.toString()) return forbiddenError();
    if (payment.status === 'completed') return badRequest('Payment is already confirmed');

    const body = await request.json();
    payment.status = 'completed';
    payment.paymentDate = new Date();
    payment.paymentMethod = body.paymentMethod || 'cash';
    payment.transactionId = body.transactionId || `TXN${Date.now()}`;
    await payment.save();

    await Notification.create({
      user: payment.tenant, title: 'Payment Confirmed',
      message: `Your payment of ₹${payment.amount} for ${payment.month} ${payment.year} has been confirmed`,
      type: 'payment', relatedId: payment._id
    });

    return Response.json({ success: true, data: payment });
  } catch (error) {
    return serverError(error);
  }
}
