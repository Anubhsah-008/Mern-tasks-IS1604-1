import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ status: 'ok', message: 'Signup API is running.' }));
app.use('/api/auth', authRoutes);

try {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern_signup_lab');
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
} catch (error) {
  console.error('MongoDB connection failed:', error.message);
  process.exit(1);
}
