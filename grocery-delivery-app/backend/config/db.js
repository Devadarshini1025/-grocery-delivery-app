const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('cluster0.xxxxx.mongodb.net') || process.env.MONGO_URI.includes('<username>')) {
      console.warn('⚠️  Warning: MONGO_URI in backend/.env is still set to placeholder text.');
      console.warn('👉 Please update backend/.env with your real MongoDB Atlas connection string.');
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.warn('⚠️  Server is running, but database requests will fail until a valid MongoDB connection is established.');
  }
};

module.exports = connectDB;

