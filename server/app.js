const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const requestLogger = require('./middleware/requestLogger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const apiRoutes = require('./routes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Security and utility headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Powered-By', 'BEEGO Virajpet Core');
  next();
});

// CORS
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// REST API
app.use('/api', apiRoutes);

// Admin Dashboard
app.use('/admin', adminRoutes);
app.get('/docs', (req, res) => res.redirect('/api'));

// Serve Frontend Static Files
const staticRoot = path.join(__dirname, '..');
app.use(express.static(staticRoot, {
  etag: true,
  maxAge: '1h',
  index: 'index.html'
}));

// Fallback to index.html for root or handle 404
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
