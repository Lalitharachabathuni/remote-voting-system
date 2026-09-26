const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false
}));

// CORS Configuration - Permissive for seamless cross-origin communication between frontend and backend
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-voting-credential']
}));

// Parsers & Logging
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Apply rate limiter to API routes
app.use('/api', apiLimiter);

// Root Welcome & System Health Status Endpoint
const rootHandler = (req, res) => {
  res.json({
    system: 'VoteRemote — Digital Remote Voting Platform Backend API',
    status: 'OPERATIONAL',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    frontendUrl: 'http://localhost:5173',
    documentation: 'http://localhost:5000/api/v1',
    endpoints: {
      auth: '/api/v1/auth',
      elections: '/api/v1/elections',
      voting: '/api/v1/voting',
      remoteVoting: '/api/v1/remote-voting',
      admin: '/api/v1/admin',
      audit: '/api/v1/audit',
      analytics: '/api/v1/analytics',
      health: '/health'
    },
    security: {
      ballotCipher: 'AES-256-GCM',
      tokenDecoupling: 'Single-Use High-Entropy Anonymous Credentials',
      auditTrail: 'SHA-256 Immutable Linked Block Ledger'
    }
  });
};

app.get('/', rootHandler);
app.get('/api', rootHandler);
app.get('/api/v1', rootHandler);

// Root health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'VoteRemote — Digital Remote Voting Platform',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes with aliases so all URL patterns work smoothly
app.use('/api/v1', routes);
app.use('/api', routes);
app.use('/', routes);

// 404 Handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found. Please refer to /api/v1 for available routes.`
  });
});

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
