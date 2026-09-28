import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Content from '../models/Content.js';

const seedAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('AdminPassword123!', salt);

      await User.create({
        name: 'System Admin',
        email: 'admin@fanhub.com',
        passwordHash,
        role: 'admin',
        isVerified: true,
      });
      console.log('Default admin seeded: admin@fanhub.com');
    }
  } catch (error) {
    console.error('Admin seed error:', error.message);
  }
};


let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const conn = await mongoose.connect(process.env.MONGO_URI);

  isConnected = conn.connections[0].readyState === 1;

  await seedAdminUser();

  console.log("MongoDB Connected");
};

export default connectDB;
