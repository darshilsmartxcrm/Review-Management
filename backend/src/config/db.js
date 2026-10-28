const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      family: 4,
    });
    console.log(`✅ MongoDB Connected`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
  }
};

module.exports = connectDB;