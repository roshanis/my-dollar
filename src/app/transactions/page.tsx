'use client';
import React, { useState } from 'react';
import { Table, Card, Input, Select, DatePicker, Tag, Button } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;

interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
}

export default function Transactions() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const columns: ColumnsType<Transaction> = [
    {
      title: 'Date',
      dataIndex: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Merchant',
      dataIndex: 'merchant',
      filterable: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render: (category: string) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (amount: number, record: Transaction) => (
        <span className={record.type === 'income' ? 'text-green-500' : 'text-red-500'}>
          {record.type === 'income' ? '+' : '-'}${Math.abs(amount).toFixed(2)}
        </span>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <Card title="Transactions" className="mb-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <Input
            placeholder="Search transactions"
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            placeholder="Category"
            style={{ width: 150 }}
            onChange={setSelectedCategory}
            allowClear
            options={[
              { value: 'groceries', label: 'Groceries' },
              { value: 'entertainment', label: 'Entertainment' },
              { value: 'transportation', label: 'Transportation' },
              { value: 'shopping', label: 'Shopping' },
            ]}
          />
          <RangePicker style={{ width: 300 }} />
          <Button 
            icon={<DownloadOutlined />}
            className="ml-auto"
          >
            Export
          </Button>
        </div>

        <Table
          columns={columns}
          // Replace with actual data fetching
          dataSource={[]}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
        />
      </Card>
    </div>
  );
} 