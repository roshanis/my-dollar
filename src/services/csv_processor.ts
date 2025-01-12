import Papa from 'papaparse';

interface Transaction {
  date: string;
  merchant: string;
  amount: number;
  category?: string;
  bank?: string;
}

export class CSVProcessor {
  private BANK_FORMATS = {
    'american_express': [
      'Date', 'Description', 'Amount', 'Extended Details', 
      'Appears On Your', 'Address', 'City/State', 'Zip Code',
      'Country', 'Reference', 'Category', 'Bank'
    ]
  };

  processCSV(csvContent: string): Transaction[] {
    const results = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true
    });

    if (results.errors.length > 0) {
      throw new Error(`CSV parsing error: ${results.errors[0].message}`);
    }

    const data = results.data;
    const headers = Object.keys(data[0]);
    
    // Detect bank format
    const bankFormat = this.detectBankFormat(headers);
    
    return this.transformData(data, bankFormat);
  }

  private detectBankFormat(headers: string[]): string {
    // Simple detection based on headers matching
    if (headers.includes('Extended Details')) {
      return 'american_express';
    }
    
    throw new Error('Unsupported CSV format');
  }

  private transformData(data: any[], bankFormat: string): Transaction[] {
    switch (bankFormat) {
      case 'american_express':
        return data.map(row => ({
          date: row['Date'],
          merchant: row['Description'],
          amount: this.parseAmount(row['Amount']),
          category: row['Category'],
          bank: 'American Express'
        }));
      default:
        throw new Error(`Unsupported bank format: ${bankFormat}`);
    }
  }

  private parseAmount(amount: string): number {
    // Remove currency symbols and convert to number
    const cleanAmount = amount.replace(/[$,]/g, '');
    return parseFloat(cleanAmount);
  }
} 