require('dotenv').config();
const path = require('path');

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  dbPath: process.env.DB_PATH || path.join(__dirname, '../../data/beego.db'),
  jwtSecret: process.env.JWT_SECRET || 'beego-virajpet-secret-key-2026',
  app: {
    name: 'BEEGO Virajpet Edition',
    version: '1.0.0',
    description: 'On-demand 100% Halal Food & Estate Coffee Server',
    location: 'Virajpet (Kodagu, Karnataka)',
    currency: 'INR',
    currencySymbol: '₹'
  }
};

module.exports = config;
