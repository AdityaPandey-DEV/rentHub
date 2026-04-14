import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  roomNumber: {
    type: String,
    required: [true, 'Please provide room number'],
    trim: true
  },
  roomType: {
    type: String,
    enum: ['single', 'double', 'triple', 'dormitory'],
    required: [true, 'Please specify room type']
  },
  rent: {
    type: Number,
    required: [true, 'Please provide monthly rent'],
    min: [0, 'Rent cannot be negative']
  },
  deposit: {
    type: Number,
    required: [true, 'Please provide security deposit'],
    min: [0, 'Deposit cannot be negative']
  },
  area: { type: Number, min: [0, 'Area cannot be negative'] },
  amenities: [{
    type: String,
    enum: ['attached_bathroom', 'balcony', 'ac', 'fan', 'wardrobe', 'bed', 'table', 'chair', 'tv', 'geyser', 'wifi']
  }],
  images: [{ type: String }],
  status: {
    type: String,
    enum: ['vacant', 'occupied', 'maintenance'],
    default: 'vacant'
  },
  currentTenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  availableFrom: { type: Date, default: Date.now },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

roomSchema.index({ property: 1, roomNumber: 1 }, { unique: true });
roomSchema.index({ status: 1, rent: 1, roomType: 1 });

export default mongoose.models.Room || mongoose.model('Room', roomSchema);
