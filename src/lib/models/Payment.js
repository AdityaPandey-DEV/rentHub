import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  rental: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental', required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: {
    type: Number,
    required: [true, 'Please provide payment amount'],
    min: [0, 'Amount cannot be negative']
  },
  paymentType: {
    type: String,
    enum: ['rent', 'deposit', 'advance', 'maintenance'],
    required: [true, 'Please specify payment type']
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'upi', 'card', 'bank_transfer', 'cheque'],
    default: 'cash'
  },
  transactionId: { type: String, trim: true },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDate: { type: Date },
  dueDate: { type: Date, required: [true, 'Please provide due date'] },
  month: { type: String, required: [true, 'Please specify the payment month'] },
  year: { type: Number, required: [true, 'Please specify the payment year'] },
  notes: { type: String, maxlength: [200, 'Notes cannot exceed 200 characters'] }
}, { timestamps: true });

paymentSchema.index({ tenant: 1, status: 1 });
paymentSchema.index({ landlord: 1, status: 1 });
paymentSchema.index({ rental: 1 });
paymentSchema.index({ dueDate: 1, status: 1 });

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
