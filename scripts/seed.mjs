// Seed script to create demo users
// Run with: node scripts/seed.mjs
// IMPORTANT: Make sure to set MONGODB_URI env var first

const MONGODB_URI = process.argv[2] || process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Please provide MONGODB_URI as argument: node scripts/seed.mjs "mongodb+srv://..."');
  process.exit(1);
}

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

await mongoose.connect(MONGODB_URI);
console.log('✅ Connected to MongoDB');

// Define schema inline (avoid model import issues with mjs)
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, select: false },
  phone: String,
  role: { type: String, enum: ['landlord', 'tenant', 'admin'], default: 'tenant' },
  avatar: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

const demoUsers = [
  { name: 'Rajesh Kumar', email: 'rajesh@landlord.com', password: 'landlord123', phone: '9876543210', role: 'landlord' },
  { name: 'Amit Sharma', email: 'amit@tenant.com', password: 'tenant123', phone: '9123456789', role: 'tenant' },
];

for (const u of demoUsers) {
  const exists = await User.findOne({ email: u.email });
  if (exists) {
    console.log(`⚠️  User already exists: ${u.email} — skipping`);
    continue;
  }
  const hashed = await bcrypt.hash(u.password, 10);
  await User.create({ ...u, password: hashed });
  console.log(`✅ Created ${u.role}: ${u.email} / ${u.password}`);
}

console.log('\n🎉 Seeding complete!');
await mongoose.disconnect();
