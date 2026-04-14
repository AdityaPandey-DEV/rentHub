import connectDB from '@/lib/db';
import Booking from '@/lib/models/Booking';
import Room from '@/lib/models/Room';
import Notification from '@/lib/models/Notification';
import { getAuthUser, authError, serverError, notFoundError, forbiddenError, badRequest } from '@/lib/auth';

export async function POST(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) return authError();
    await connectDB();

    const { roomId, moveInDate, message } = await request.json();
    const room = await Room.findById(roomId).populate('property');
    if (!room) return notFoundError('Room not found');
    if (room.status !== 'vacant') return badRequest('Room is not available for booking');

    const existingBooking = await Booking.findOne({ room: roomId, tenant: user._id, status: 'pending' });
    if (existingBooking) return badRequest('You already have a pending booking for this room');

    const booking = await Booking.create({
      room: roomId, property: room.property._id, tenant: user._id,
      landlord: room.property.owner, moveInDate, message
    });

    await Notification.create({
      user: room.property.owner, title: 'New Booking Request',
      message: `New booking request for ${room.roomNumber} at ${room.property.title}`,
      type: 'booking', relatedId: booking._id
    });

    return Response.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
