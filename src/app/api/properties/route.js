import connectDB from '@/lib/db';
import Property from '@/lib/models/Property';
import { getAuthUser, authError, serverError, forbiddenError } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const propertyType = searchParams.get('propertyType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query = { isActive: true };
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (state) query['address.state'] = new RegExp(state, 'i');
    if (propertyType) query.propertyType = propertyType;

    const skip = (page - 1) * limit;
    const properties = await Property.find(query)
      .populate('owner', 'name email phone')
      .skip(skip).limit(limit).sort('-createdAt');

    const total = await Property.countDocuments(query);

    return Response.json({
      success: true, count: properties.length, total,
      pages: Math.ceil(total / limit), currentPage: page, data: properties
    });
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
    const body = await request.json();
    body.owner = user._id;
    const property = await Property.create(body);

    return Response.json({ success: true, data: property }, { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
