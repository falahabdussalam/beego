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

// Security Guard: Block access to backend code, database, tests, config, and system files
app.use((req, res, next) => {
  const blockedPrefixes = ['/server', '/data', '/test', '/node_modules', '/package.json', '/package-lock.json', '/server.js', '/readme.md'];
  const lowercasePath = req.path.toLowerCase();
  const isBlocked = blockedPrefixes.some(p => lowercasePath === p || lowercasePath.startsWith(p + '/')) ||
    lowercasePath.endsWith('.db') ||
    lowercasePath.endsWith('.db-wal') ||
    lowercasePath.endsWith('.db-shm') ||
    lowercasePath.endsWith('.sqlite') ||
    lowercasePath.endsWith('.log') ||
    lowercasePath.includes('..');

  if (isBlocked) {
    return notFoundHandler(req, res);
  }
  next();
});

// Serve Frontend Static Files
const staticRoot = path.join(__dirname, '..');
app.use(express.static(staticRoot, {
  etag: true,
  maxAge: '1h',
  index: 'index.html',
  dotfiles: 'ignore'
}));

// Fallback to index.html for root or handle 404
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
