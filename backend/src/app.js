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

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in prototype for easy multi-device testing
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-voting-credential']
}));

// Parsers & Logging
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Apply rate limiter to /api
app.use('/api', apiLimiter);

// Root health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'VoteRemote - Digital Remote Voting Platform (Academic Prototype)',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/v1/auth',
      elections: '/api/v1/elections',
      remoteVoting: '/api/v1/remote-voting',
      voting: '/api/v1/voting',
      admin: '/api/v1/admin',
      audit: '/api/v1/audit',
      analytics: '/api/v1/analytics'
    }
  });
});

// Mount API v1 Routes
app.use('/api/v1', routes);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route '${req.originalUrl}' not found.`
  });
});

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
