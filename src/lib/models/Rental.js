import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  startDate: { type: Date, required: [true, 'Please provide start date'] },
  endDate: { type: Date },
  monthlyRent: { type: Number, required: [true, 'Please provide monthly rent'] },
  deposit: { type: Number, required: [true, 'Please provide security deposit'] },
  depositReturned: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['active', 'completed', 'terminated'],
    default: 'active'
  },
  terminationReason: { type: String, maxlength: [500, 'Reason cannot exceed 500 characters'] }
}, { timestamps: true });

rentalSchema.index({ tenant: 1, status: 1 });
rentalSchema.index({ landlord: 1, status: 1 });
rentalSchema.index({ room: 1, status: 1 });

export default mongoose.models.Rental || mongoose.model('Rental', rentalSchema);
