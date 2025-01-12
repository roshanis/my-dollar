import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    
    // Get budget data
    const budgets = await db.all(`
      SELECT 
        category,
        SUM(amount) as spent,
        budget_limit
      FROM transactions
      LEFT JOIN budgets ON transactions.category = budgets.category
      WHERE date >= date('now', 'start of month')
      GROUP BY category
    `);

    // Get total stats
    const totals = await db.get(`
      SELECT 
        SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as total_spent
      FROM transactions
      WHERE date >= date('now', 'start of month')
    `);

    return NextResponse.json({ budgets, totals });
  } catch (error) {
    console.error('Error fetching budget data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budget data' },
      { status: 500 }
    );
  }
} 