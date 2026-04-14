import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: {
    type: String,
    required: [true, 'Please provide notification title'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Please provide notification message'],
    maxlength: [300, 'Message cannot exceed 300 characters']
  },
  type: {
    type: String,
    enum: ['booking', 'payment', 'rental', 'system'],
    default: 'system'
  },
  relatedId: { type: mongoose.Schema.Types.ObjectId },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
