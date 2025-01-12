import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const duplicates = await db.all(`
      SELECT 
        d.*,
        t.merchant as original_merchant,
        t.amount as original_amount,
        t.category as original_category
      FROM duplicate_transactions d
      JOIN transactions t ON d.original_id = t.id
      ORDER BY d.detected_at DESC
    `);
    
    return NextResponse.json(duplicates);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch duplicates' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, action } = await request.json();
    const db = await getDb();

    await db.run('BEGIN TRANSACTION');

    const duplicate = await db.get(
      'SELECT * FROM duplicate_transactions WHERE id = ?',
      [id]
    );

    if (action === 'force') {
      // Force insert as new transaction
      await db.run(`
        INSERT INTO transactions (
          date, merchant, amount, category, description,
          is_duplicate, original_transaction_id
        )
        VALUES (?, ?, ?, ?, ?, 1, ?)
      `, [
        duplicate.duplicate_date,
        duplicate.merchant,
        duplicate.amount,
        duplicate.category,
        duplicate.description,
        duplicate.original_id
      ]);

      await db.run(
        'UPDATE duplicate_transactions SET resolution = ? WHERE id = ?',
        ['forced', id]
      );
    } else if (action === 'merge') {
      // Update original transaction
      await db.run(`
        UPDATE transactions 
        SET 
          category = ?,
          description = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [duplicate.category, duplicate.description, duplicate.original_id]);

      await db.run(
        'UPDATE duplicate_transactions SET resolution = ? WHERE id = ?',
        ['merged', id]
      );
    }

    await db.run('COMMIT');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process duplicate' },
      { status: 500 }
    );
  }
} 