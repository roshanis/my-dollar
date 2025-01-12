import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const settings = await db.get(`SELECT * FROM user_settings LIMIT 1`);
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const db = await getDb();
    
    await db.run(`
      UPDATE user_settings 
      SET 
        name = ?,
        email = ?,
        currency = ?,
        email_notifications = ?,
        budget_alerts = ?,
        large_transaction_alerts = ?
      WHERE id = 1
    `, [
      data.name,
      data.email,
      data.currency,
      data.emailNotifications,
      data.budgetAlerts,
      data.largeTransactionAlerts
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
} 