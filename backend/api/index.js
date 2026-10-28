const app = require('../src/app');
const connectDB = require('../src/config/db');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection error:', error);
  }
  return app(req, res);
};
