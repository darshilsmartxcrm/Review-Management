require('dotenv').config();

const http = require('http');
const mongoose = require('mongoose');

const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

let server;

// Start server only after MongoDB connects
const startServer = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');

    // Wait until MongoDB connection is established
    await connectDB();

    // Verify MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB connection is not established');
    }

    console.log('✅ MongoDB connected successfully');

    // Create HTTP server
    server = http.createServer(app);

    // Start listening only after DB connection
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`
=====================================================
🚀 Server is running on port ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📡 Base URL:    http://localhost:${PORT}
🩺 Health Check: http://localhost:${PORT}/api/health
📚 API Docs:    http://localhost:${PORT}/
🗄️ MongoDB:     Connected
=====================================================
`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);

  shutdown();
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);

  shutdown();
});

// Graceful shutdown
const shutdown = async () => {
  console.log('🛑 Shutting down server gracefully...');

  try {
    if (server && server.listening) {
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      console.log('✅ HTTP server closed.');
    }

    await mongoose.connection.close();

    console.log('✅ MongoDB connection closed.');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error during shutdown:', error);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start application
startServer();