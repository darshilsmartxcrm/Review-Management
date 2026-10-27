const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Route imports
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const leadRoutes = require('./routes/leadRoutes');
const settingRoutes = require('./routes/settingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// CORS setup: allow requests from local Next.js frontend (ports 3000, 3001) and custom client origins
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev mode
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health Check Endpoint
app.get(['/health', '/api/health'], (req, res) => {
  const mongoStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown';
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      status: mongoStatus,
      name: mongoose.connection.name,
    },
    service: 'Review Growth Hub & SmartXCRM Backend API',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/reviews', reviewRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    service: '⭐ Review Growth Hub / SmartXCRM Backend API',
    version: '1.0.0',
    documentation: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (Bearer Token)',
        changePassword: 'PUT /api/auth/change-password (Bearer Token)',
      },
      clients: {
        list: 'GET /api/clients',
        getById: 'GET /api/clients/:id',
        create: 'POST /api/clients (Bearer Token)',
        update: 'PUT /api/clients/:id (Bearer Token)',
        delete: 'DELETE /api/clients/:id (Bearer Token)',
      },
      leads: {
        submit: 'POST /api/leads',
        list: 'GET /api/leads (Bearer Token)',
        delete: 'DELETE /api/leads/:id (Bearer Token)',
      },
      settings: {
        get: 'GET /api/settings',
        update: 'POST /api/settings (Bearer Token)',
      },
      reviews: {
        getUsed: 'GET /api/reviews?clientId=...',
        lockReview: 'POST /api/reviews',
      },
    },
  });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
