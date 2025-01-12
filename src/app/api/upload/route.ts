import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { parse } from 'csv-parse/sync';

export async function POST(request: Request) {
  let db = null;
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    db = await getDb();
    const text = await file.text();
    
    // Parse CSV with proper handling of quotes and newlines
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_quotes: true,
      relax_column_count: true
    });

    console.log('Parsed records:', records.length);

    let stats = {
      total: records.length,
      added: 0,
      duplicates: 0,
      errors: 0
    };

    await db.run('BEGIN TRANSACTION');

    for (const record of records) {
      try {
        // Clean amount - remove any currency symbols and convert to number
        const rawAmount = record.Amount?.replace(/[^0-9.-]/g, '') || '0';
        const amount = parseFloat(rawAmount);

        if (isNaN(amount)) {
          console.log('Invalid amount:', record.Amount);
          stats.errors++;
          continue;
        }

        await db.run(`
          INSERT INTO transactions (
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
            bank
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          record.Date || '',
          record.Merchant || '',
          amount,
          record['Extended Details'] || '',
          record.Address || '',
          record['City/State'] || '',
          record['Zip Code'] || '',
          record.Country || '',
          record.Reference?.replace(/'/g, '') || '', // Remove single quotes
          record.Category || '',
          record.Bank || ''
        ]);
        
        stats.added++;
      } catch (error: any) {
        console.error('Error processing record:', record, error);
        if (error.code === 'SQLITE_CONSTRAINT') {
          stats.duplicates++;
        } else {
          stats.errors++;
        }
      }
    }

    await db.run('COMMIT');

    return NextResponse.json({ 
      success: true,
      stats,
      message: `Processed ${stats.total} transactions: ${stats.added} added, ${stats.duplicates} duplicates, ${stats.errors} errors`
    });

  } catch (error) {
    console.error('Upload error:', error);
    if (db) {
      try {
        await db.run('ROLLBACK');
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError);
      }
    }
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}

// Add route configuration
export const config = {
  api: {
    bodyParser: false,
  },
}; 