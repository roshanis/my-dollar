import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import os from 'os';

let db: any = null;

async function getDb() {
  if (!db) {
    try {
      // Use temp directory for database
      const dbPath = path.join(os.tmpdir(), 'finance-app.sqlite');
      console.log('Database path:', dbPath);

      // Create new database connection
      db = await open({
        filename: dbPath,
        driver: sqlite3.Database
      });
      
      // Test the connection
      const result = await db.get('SELECT 1 as test');
      console.log('Database connection test:', result);

      // Create schema if not exists
      await db.exec(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL,
          merchant TEXT NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          details TEXT,
          address TEXT,
          city_state TEXT,
          zip_code TEXT,
          country TEXT,
          reference TEXT,
          category TEXT,
          bank TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
        CREATE INDEX IF NOT EXISTS idx_transactions_merchant ON transactions(merchant);
      `);

      // Verify table exists and has data
      const count = await db.get('SELECT COUNT(*) as count FROM transactions');
      console.log('Transaction count:', count);

    } catch (error) {
      console.error('Database initialization error:', error);
      db = null;
      throw error;
    }
  }

  return db;
}

export { getDb }; 