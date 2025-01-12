import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    console.log('Fetching transactions...');
    const db = await getDb();

    // Verify database connection
    const testResult = await db.get('SELECT 1 as test');
    console.log('Database connection test:', testResult);
    
    // Get all transactions
    const transactions = await db.all(`
      SELECT 
        id,
        date,
        merchant,
        amount,
        details,
        address,
        city_state,
        zip_code,
        country,
        reference,
        category,
        bank,
        created_at
      FROM transactions 
      ORDER BY date DESC, id DESC
    `);
    
    console.log(`Found ${transactions?.length || 0} transactions`);

    // Log a sample transaction for debugging
    if (transactions?.length > 0) {
      console.log('Sample transaction:', transactions[0]);
    }

    return NextResponse.json(transactions || []);

  } catch (error) {
    console.error('Error fetching transactions:', error);
    
    // Try to reconnect to database
    try {
      const db = await getDb();
      await db.get('SELECT 1 as test');
      console.log('Database reconnection successful');
    } catch (reconnectError) {
      console.error('Database reconnection failed:', reconnectError);
    }

    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// Add cache control headers
export const revalidate = 0;

// Configure response headers
export async function headers() {
  return {
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache',
  };
} 