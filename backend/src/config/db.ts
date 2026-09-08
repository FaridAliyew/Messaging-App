import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || (process.env as Record<string, string | undefined>).MANGODB_URL || process.env.MONGODB_URL;

  if (!uri) {
    console.error('[database]: Error: MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[database]: MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error('[database]: MongoDB connection error:', error);
    process.exit(1);
  }
};
