import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();

    // Get monthly spending
    const monthlySpending = await db.all(`
      SELECT 
        strftime('%Y-%m', date) as month,
        ROUND(SUM(amount), 2) as total
      FROM transactions
      GROUP BY strftime('%Y-%m', date)
      ORDER BY month DESC
      LIMIT 12
    `);

    // Get top vendors
    const topVendors = await db.all(`
      SELECT 
        merchant as name,
        ROUND(SUM(amount), 2) as value
      FROM transactions
      GROUP BY merchant
      ORDER BY value DESC
      LIMIT 5
    `);

    // Get statistics
    const stats = await db.get(`
      SELECT 
        ROUND(SUM(amount), 2) as totalSpent,
        ROUND(AVG(amount), 2) as averageTransaction,
        COUNT(*) as transactionCount
      FROM transactions
    `);

    return NextResponse.json({
      monthlySpending,
      topVendors,
      ...stats
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 