const mongoose = require('mongoose');

let lastDbError = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    let uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (uri && typeof uri === 'string') {
      uri = uri.replace(/^["']|["']$/g, '').trim();
    }

    // Fallback if MONGO_URI is missing or not set in Render environment
    if (!uri) {
      uri = 'mongodb://drlinksUser:drlinksUser%40123987%40DRLINKS@72.61.141.42:27009/review_management?authSource=admin';
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000, // 15 seconds to allow cloud container latency
      family: 4, // Force IPv4
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    lastDbError = null;
  } catch (error) {
    lastDbError = error.message;
    console.error(`Error connecting to MongoDB: ${error.message}`);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Retrying connection...');
  setTimeout(connectDB, 3000);
});

module.exports = connectDB;
module.exports.getLastError = () => lastDbError;
