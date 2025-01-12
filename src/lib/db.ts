import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db: any = null;

async function getDb() {
  if (!db) {
    db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });
    
    // Create tables if they don't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        merchant TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT UNIQUE NOT NULL,
        budget_limit DECIMAL(10,2) NOT NULL,
        color TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS user_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        currency TEXT DEFAULT 'USD',
        email_notifications BOOLEAN DEFAULT 1,
        budget_alerts BOOLEAN DEFAULT 1,
        large_transaction_alerts BOOLEAN DEFAULT 0
      );

      -- Insert default settings if not exists
      INSERT OR IGNORE INTO user_settings (id, name, email) 
      VALUES (1, 'Default User', 'user@example.com');

      -- Insert default budgets if not exists
      INSERT OR IGNORE INTO budgets (category, budget_limit, color) VALUES 
        ('Groceries', 500, '#0ac775'),
        ('Entertainment', 200, '#ff6b6b'),
        ('Transportation', 300, '#4a90e2'),
        ('Shopping', 400, '#f7b731');
    `);
  }
  return db;
}

export { getDb }; 