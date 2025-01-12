import asyncpg
from typing import Dict

class Database:
    def __init__(self):
        self.pool = None

    async def connect(self):
        self.pool = await asyncpg.create_pool(
            user='your_user',
            password='your_password',
            database='your_db',
            host='localhost'
        )

    async def insert_transaction(self, transaction: Dict):
        async with self.pool.acquire() as conn:
            await conn.execute('''
                INSERT INTO transactions (date, merchant, amount, category)
                VALUES ($1, $2, $3, $4)
            ''', 
            transaction['date'],
            transaction['merchant'],
            transaction['amount'],
            transaction.get('category')
            ) 