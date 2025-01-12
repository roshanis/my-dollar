import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { CSVProcessor } from '@/services/csv_processor';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Read file content
    const csvContent = await file.text();
    
    // Process CSV
    const processor = new CSVProcessor();
    const transactions = processor.processCSV(csvContent);

    // Insert into database
    const db = await getDb();
    
    for (const transaction of transactions) {
      await db.run(`
        INSERT INTO transactions (
          date,
          merchant,
          amount,
          category,
          bank_name
        ) VALUES (?, ?, ?, ?, ?)
      `, [
        transaction.date,
        transaction.merchant,
        transaction.amount,
        transaction.category || null,
        transaction.bank || null
      ]);
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${transactions.length} transactions`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process upload' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
}; 