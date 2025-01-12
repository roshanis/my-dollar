from fastapi import FastAPI, UploadFile, File
from services.csv_processor import CSVProcessor
from services.db import Database
import tempfile
import os

app = FastAPI()
csv_processor = CSVProcessor()
db = Database()

@app.post("/api/transactions/upload")
async def upload_transactions(file: UploadFile = File(...)):
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            contents = await file.read()
            temp_file.write(contents)
            temp_file_path = temp_file.name

        # Process CSV
        transactions = csv_processor.process_csv(temp_file_path)
        
        # Store in database
        for transaction in transactions:
            await db.insert_transaction(transaction)
        
        # Clean up temp file
        os.unlink(temp_file_path)
        
        return {
            "status": "success",
            "message": f"Processed {len(transactions)} transactions",
            "transactions": transactions
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        } 