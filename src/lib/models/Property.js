import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a property title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  propertyType: {
    type: String,
    enum: ['apartment', 'house', 'villa', 'pg', 'hostel'],
    required: [true, 'Please specify property type']
  },
  address: {
    street: { type: String, required: [true, 'Please provide street address'] },
    city: { type: String, required: [true, 'Please provide city'] },
    state: { type: String, required: [true, 'Please provide state'] },
    pincode: {
      type: String,
      required: [true, 'Please provide pincode'],
      match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode']
    },
    coordinates: { lat: Number, lng: Number }
  },
  amenities: [{
    type: String,
    enum: ['wifi', 'parking', 'laundry', 'security', 'gym', 'power_backup', 'water_supply', 'lift', 'garden', 'cctv', 'ac', 'furnished']
  }],
  images: [{ type: String }],
  totalRooms: { type: Number, default: 0 },
  availableRooms: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

propertySchema.virtual('rooms', {
  ref: 'Room',
  localField: '_id',
  foreignField: 'property',
  justOne: false
});

propertySchema.index({ 'address.city': 1, 'address.state': 1 });
propertySchema.index({ propertyType: 1 });

export default mongoose.models.Property || mongoose.model('Property', propertySchema);
