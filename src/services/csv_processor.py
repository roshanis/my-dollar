import pandas as pd
from typing import Dict, List
from datetime import datetime

class CSVProcessor:
    # Known CSV formats for different banks
    BANK_FORMATS = {
        'chase': ['Date', 'Description', 'Amount'],
        'bank_of_america': ['Posted Date', 'Payee', 'Amount'],
        'wells_fargo': ['Date', 'Merchant', 'Amount'],
    }

    def __init__(self):
        self.supported_banks = list(self.BANK_FORMATS.keys())

    def detect_bank_format(self, df: pd.DataFrame) -> str:
        """Detect which bank format the CSV matches"""
        columns = set(df.columns)
        
        for bank, expected_columns in self.BANK_FORMATS.items():
            if all(col in columns for col in expected_columns):
                return bank
                
        raise ValueError("Unsupported CSV format")

    def normalize_columns(self, df: pd.DataFrame, bank_format: str) -> pd.DataFrame:
        """Standardize column names based on bank format"""
        if bank_format == 'chase':
            return df.rename(columns={
                'Date': 'date',
                'Description': 'merchant',
                'Amount': 'amount'
            })
        elif bank_format == 'bank_of_america':
            return df.rename(columns={
                'Posted Date': 'date',
                'Payee': 'merchant',
                'Amount': 'amount'
            })
        # Add more bank formats as needed
        
        return df

    def process_csv(self, file_path: str) -> List[Dict]:
        """Process CSV file and return normalized transactions"""
        try:
            # Read CSV file
            df = pd.read_csv(file_path)
            
            # Detect bank format
            bank_format = self.detect_bank_format(df)
            
            # Normalize columns
            df = self.normalize_columns(df, bank_format)
            
            # Clean and standardize data
            df['date'] = pd.to_datetime(df['date']).dt.strftime('%Y-%m-%d')
            df['amount'] = df['amount'].astype(float)
            df['merchant'] = df['merchant'].str.strip().str.upper()
            
            # Convert to list of dictionaries
            transactions = df.to_dict('records')
            
            return transactions
            
        except Exception as e:
            raise Exception(f"Error processing CSV: {str(e)}") 