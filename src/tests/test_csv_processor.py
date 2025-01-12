import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.csv_processor import CSVProcessor

def test_csv_processing():
    # Initialize processor
    processor = CSVProcessor()
    
    # Path to your CSV file
    csv_path = "/users/roshanvenugopal/downloads/activity.csv"
    
    try:
        # Process the CSV
        transactions = processor.process_csv(csv_path)
        
        # Print results
        print(f"\nProcessed {len(transactions)} transactions")
        print("\nSample transactions:")
        for i, transaction in enumerate(transactions[:5]):
            print(f"\nTransaction {i + 1}:")
            for key, value in transaction.items():
                print(f"{key}: {value}")
            
    except Exception as e:
        print(f"Error processing CSV: {str(e)}")

if __name__ == "__main__":
    test_csv_processing() 