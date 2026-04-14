import connectDB from '@/lib/db';
import Payment from '@/lib/models/Payment';
import Rental from '@/lib/models/Rental';
import Notification from '@/lib/models/Notification';
import { getAuthUser, authError, serverError, notFoundError, forbiddenError, badRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) return authError();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const rentalId = searchParams.get('rentalId');

    let query = {};
    if (user.role === 'tenant') query.tenant = user._id;
    else if (user.role === 'landlord') query.landlord = user._id;
    if (status) query.status = status;
    if (rentalId) query.rental = rentalId;

    const payments = await Payment.find(query)
      .populate({ path: 'rental', populate: [{ path: 'room', select: 'roomNumber' }, { path: 'property', select: 'title' }] })
      .populate('tenant', 'name email')
      .sort({ dueDate: -1 });

    return Response.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) return authError();
    if (!['landlord', 'admin'].includes(user.role)) return forbiddenError();
    await connectDB();

    const { rentalId, amount, paymentType, dueDate, month, year, notes } = await request.json();
    const rental = await Rental.findById(rentalId);
    if (!rental) return notFoundError('Rental not found');
    if (rental.landlord.toString() !== user._id.toString()) return forbiddenError();

    const payment = await Payment.create({
      rental: rentalId, tenant: rental.tenant, landlord: rental.landlord,
      amount, paymentType, dueDate, month, year, notes
    });

    await Notification.create({
      user: rental.tenant, title: 'Payment Due',
      message: `Rent payment of ₹${amount} is due on ${new Date(dueDate).toLocaleDateString()}`,
      type: 'payment', relatedId: payment._id
    });

    return Response.json({ success: true, data: payment }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
