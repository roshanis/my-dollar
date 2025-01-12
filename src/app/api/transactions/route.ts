import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const db = await getDb();
    
    let query = `
      SELECT 
        id,
        date,
        merchant,
        category,
        amount,
        CASE WHEN amount >= 0 THEN 'income' ELSE 'expense' END as type
      FROM transactions
      WHERE 1=1
    `;

    const params = [];

    if (search) {
      query += ` AND merchant LIKE ?`;
      params.push(`%${search}%`);
    }

    if (category) {
      query += ` AND category = ?`;
      params.push(category);
    }

    if (startDate && endDate) {
      query += ` AND date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    query += ` ORDER BY date DESC`;

    const transactions = await db.all(query, params);

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
} 