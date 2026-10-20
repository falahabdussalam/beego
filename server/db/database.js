const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const config = require('../config');

// Ensure database directory exists
const dbDir = path.dirname(config.dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db;
try {
  db = new Database(config.dbPath);
  // High performance options
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.pragma('synchronous = NORMAL');
} catch (error) {
  console.error('[DB Error] Failed to open SQLite database:', error.message);
  throw error;
}

/**
 * Initialize all database tables and indexes
 */
function initDatabase() {
  const schema = `
    -- Merchants Table
    CREATE TABLE IF NOT EXISTS merchants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      cuisine TEXT,
      rating REAL DEFAULT 5.0,
      reviews_count TEXT,
      delivery_time TEXT,
      delivery_fee REAL DEFAULT 0.0,
      min_order REAL DEFAULT 0.0,
      featured_badge TEXT,
      image TEXT,
      banner_image TEXT,
      location TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_merchants_category ON merchants(category);
    CREATE INDEX IF NOT EXISTS idx_merchants_active ON merchants(is_active);

    -- Menu Items Table
    CREATE TABLE IF NOT EXISTS menu_items (
      id TEXT PRIMARY KEY,
      merchant_id TEXT NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      image TEXT,
      category TEXT,
      is_available INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_menu_items_merchant ON menu_items(merchant_id);

    -- Users Table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      avatar_url TEXT,
      membership TEXT DEFAULT 'Royale Member Active',
      wallet_balance REAL DEFAULT 0.0,
      spice_level TEXT DEFAULT 'medium',
      eco_pack INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Addresses Table
    CREATE TABLE IF NOT EXISTS addresses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      subtitle TEXT,
      address_line TEXT NOT NULL,
      landmark TEXT,
      lat REAL,
      lng REAL,
      preset TEXT DEFAULT 'Home',
      is_default INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);

    -- Orders Table
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      user_id TEXT REFERENCES users(id),
      merchant_id TEXT REFERENCES merchants(id),
      merchant_name TEXT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT,
      delivery_address TEXT NOT NULL,
      lat REAL,
      lng REAL,
      items_json TEXT NOT NULL,
      subtotal REAL NOT NULL,
      delivery_fee REAL DEFAULT 0.0,
      service_fee REAL DEFAULT 15.0,
      tip REAL DEFAULT 0.0,
      discount REAL DEFAULT 0.0,
      total REAL NOT NULL,
      status TEXT DEFAULT 'CONFIRMED',
      payment_method TEXT DEFAULT 'UPI',
      promo_code TEXT,
      notes TEXT,
      rider_name TEXT DEFAULT 'Mohammed Suhail',
      rider_phone TEXT DEFAULT '+91 98452 33412',
      rider_vehicle TEXT DEFAULT 'TVS iQube Electric',
      rider_lat REAL DEFAULT 12.2015,
      rider_lng REAL DEFAULT 75.8034,
      eta_minutes INTEGER DEFAULT 20,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

    -- Wallet Transactions Table
    CREATE TABLE IF NOT EXISTS wallet_transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      amount REAL NOT NULL,
      type TEXT NOT NULL, -- 'CREDIT' or 'DEBIT'
      description TEXT NOT NULL,
      balance_after REAL NOT NULL,
      reference_id TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_wallet_user ON wallet_transactions(user_id);

    -- Promo Codes Table
    CREATE TABLE IF NOT EXISTS promos (
      code TEXT PRIMARY KEY,
      type TEXT NOT NULL, -- 'PERCENTAGE', 'FREE_DELIVERY', 'FLAT'
      value REAL NOT NULL,
      min_order REAL DEFAULT 0.0,
      max_discount REAL DEFAULT 9999.0,
      description TEXT,
      is_active INTEGER DEFAULT 1
    );

    -- Live Telemetry Log (for history and replay)
    CREATE TABLE IF NOT EXISTS telemetry_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_id TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      speed REAL,
      heading REAL,
      battery REAL,
      status_text TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_telemetry_ref ON telemetry_logs(reference_id);

    -- Admin Users Table
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      role TEXT DEFAULT 'Platform & Store Admin',
      last_login TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_admin_email ON admin_users(email);
  `;

  db.exec(schema);

  // Migration: ensure location column exists on users table
  try {
    const tableInfo = db.pragma('table_info(users)');
    const hasLocation = tableInfo.some(col => col.name === 'location');
    if (!hasLocation) {
      db.exec("ALTER TABLE users ADD COLUMN location TEXT DEFAULT 'Virajpet Town, Kodagu 571218'");
    }
  } catch (e) {
    // ignore if already exists
  }
}

module.exports = {
  db,
  initDatabase
};
