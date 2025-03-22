import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connectionString = process.env.MONGODB_URI || '';
    
    if (!connectionString) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    const conn = await mongoose.connect(connectionString, {
      // Modern Mongoose doesn't need useNewUrlParser and useUnifiedTopology anymore
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`Connected to MongoDB Atlas: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error; // Throw instead of exiting to let the calling function handle it
  }
};