import { Pool } from 'pg';

let pool = null;
let isPostgresAvailable = null;

// Memory storage fallback for development when PostgreSQL connection is not active
const memoryStore = {
  users: [],
  addresses: [],
  stores: [],
  categories: [],
  products: [],
  orders: [],
  orderItems: [],
  statusHistory: [],
  coupons: [],
  deliveryPartners: [],
  auditLogs: [],
  settings: {},
};

export function getMemoryStore() {
  return memoryStore;
}

export function getPool() {
  if (!pool && process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 3000,
      ssl: process.env.DATABASE_URL.includes('supabase.co')
        ? { rejectUnauthorized: false }
        : false,
    });

    pool.on('error', (err) => {
      console.warn('Unexpected error on idle PostgreSQL client:', err.message);
    });
  }
  return pool;
}

export async function testConnection() {
  if (isPostgresAvailable !== null) {
    return isPostgresAvailable;
  }

  try {
    const currentPool = getPool();
    if (!currentPool) {
      isPostgresAvailable = false;
      return false;
    }
    const client = await currentPool.connect();
    const res = await client.query('SELECT NOW() as current_time');
    client.release();
    isPostgresAvailable = true;
    console.log('✓ Connected to PostgreSQL successfully at', res.rows[0].current_time);
    return true;
  } catch (err) {
    console.warn('PostgreSQL not accessible, operating with development in-memory store:', err.message);
    isPostgresAvailable = false;
    return false;
  }
}

/**
 * Execute a SQL query safely
 */
export async function query(text, params = []) {
  const hasPg = await testConnection();

  if (hasPg) {
    const currentPool = getPool();
    const start = Date.now();
    try {
      const res = await currentPool.query(text, params);
      const duration = Date.now() - start;
      return res;
    } catch (error) {
      console.error('Database query error:', { text, params, error: error.message });
      throw error;
    }
  }

  // Development Memory Store Execution Fallback
  return fallbackMemoryQuery(text, params);
}

/**
 * Execute atomic transaction with BEGIN and COMMIT/ROLLBACK
 */
export async function withTransaction(callback) {
  const hasPg = await testConnection();

  if (hasPg) {
    const currentPool = getPool();
    const client = await currentPool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  // Memory transaction mock
  return callback({
    query: (text, params) => fallbackMemoryQuery(text, params),
  });
}

function fallbackMemoryQuery(text, params) {
  const normalized = text.trim().toLowerCase();

  // Basic mock responses for common SELECT/INSERT statements during initial dev
  if (normalized.startsWith('select count(*) from users')) {
    return { rows: [{ count: memoryStore.users.length }] };
  }

  if (normalized.startsWith('select * from users where email =')) {
    const email = params[0];
    const user = memoryStore.users.find((u) => u.email === email);
    return { rows: user ? [user] : [] };
  }

  if (normalized.startsWith('select * from users where id =')) {
    const id = params[0];
    const user = memoryStore.users.find((u) => u.id === id);
    return { rows: user ? [user] : [] };
  }

  return { rows: [], rowCount: 0 };
}

