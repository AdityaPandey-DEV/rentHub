import connectDB from '@/lib/db';
import Property from '@/lib/models/Property';
import Room from '@/lib/models/Room';
import { getAuthUser, authError, serverError, notFoundError, forbiddenError } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const property = await Property.findById(id)
      .populate('owner', 'name email phone')
      .populate('rooms');
    if (!property) return notFoundError('Property not found');
    return Response.json({ success: true, data: property });
  } catch (error) {
    return serverError(error);
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user) return authError();
    await connectDB();
    const { id } = await params;

    let property = await Property.findById(id);
    if (!property) return notFoundError('Property not found');
    if (property.owner.toString() !== user._id.toString() && user.role !== 'admin') return forbiddenError();

    const body = await request.json();
    property = await Property.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    return Response.json({ success: true, data: property });
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

    const property = await Property.findById(id);
    if (!property) return notFoundError('Property not found');
    if (property.owner.toString() !== user._id.toString() && user.role !== 'admin') return forbiddenError();

    await Room.deleteMany({ property: property._id });
    await property.deleteOne();
    return Response.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    return serverError(error);
  }
}
