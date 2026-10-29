import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, testConnection } from './client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigrations() {
  console.log('--- BeeGo Database Migration Runner ---');
  
  const isConnected = await testConnection();
  if (!isConnected) {
    console.log('PostgreSQL server not detected. Skipped live migration (using development memory adapter).');
    return { success: true, mode: 'memory' };
  }

  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Applying schema migrations from schema.sql...');
    await query(sql);
    console.log('✓ All database tables, indexes, and constraints successfully applied!');
    return { success: true, mode: 'postgres' };
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

