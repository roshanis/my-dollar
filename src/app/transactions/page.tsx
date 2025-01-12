'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Table, Card, Input, Select, DatePicker, Tag, Button, notification } from 'antd';
import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface Transaction {
  id: number;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  details: string;
  bank: string;
}

export default function Transactions() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Get unique categories from data
  const categories = React.useMemo(() => {
    const uniqueCategories = Array.from(new Set(data.map(t => t.category)))
      .filter(Boolean) // Remove null/undefined/empty categories
      .sort();
    
    console.log('Available categories:', uniqueCategories);
    return uniqueCategories.map(category => ({
      value: category,
      label: category
    }));
  }, [data]);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/transactions');
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const transactions = await response.json();
      console.log('Fetched transactions:', transactions.length);
      // Log a few transactions to check their structure
      console.log('Sample transactions:', transactions.slice(0, 3));
      setData(transactions);
      
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to load transactions',
        duration: 5,
      });
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Log when category filter changes
  useEffect(() => {
    console.log('Selected category:', selectedCategory);
  }, [selectedCategory]);

  const columns: ColumnsType<Transaction> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (date: string) => new Date(date).toLocaleDateString(),
      width: '12%',
    },
    {
      title: 'Merchant',
      dataIndex: 'merchant',
      key: 'merchant',
      width: '25%',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: '15%',
      render: (category: string) => {
        console.log('Rendering category:', category); // Debug log
        return (
          <Tag color={category?.toLowerCase().includes('income') ? 'green' : 'blue'}>
            {category || 'Uncategorized'}
          </Tag>
        );
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: '12%',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount: number) => (
        <span style={{ color: amount >= 0 ? '#52c41a' : '#f5222d' }}>
          ${Math.abs(amount).toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Bank',
      dataIndex: 'bank',
      key: 'bank',
      width: '15%',
    }
  ];

  // Filter data with debug logging
  const filteredData = React.useMemo(() => {
    console.log('Filtering data with category:', selectedCategory);
    return data.filter(item => {
      const matchesSearch = !searchText || 
        item.merchant.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesCategory = !selectedCategory || 
        (item.category && item.category.trim() === selectedCategory.trim());
      
      if (selectedCategory) {
        console.log(
          `Item category: "${item.category}", Selected: "${selectedCategory}", Matches: ${matchesCategory}`
        );
      }
      
      return matchesSearch && matchesCategory;
    });
  }, [data, searchText, selectedCategory]);

  const handleCategoryChange = (value: string) => {
    console.log('Category changed to:', value);
    setSelectedCategory(value);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Card 
        title="Transactions" 
        extra={
          <Button 
            icon={<SyncOutlined />} 
            onClick={fetchTransactions}
            loading={loading}
          >
            Refresh
          </Button>
        }
      >
        <div className="flex flex-wrap gap-4 mb-6">
          <Input
            placeholder="Search merchants"
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            value={searchText}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            placeholder="Filter by category"
            allowClear
            style={{ width: 200 }}
            value={selectedCategory}
            onChange={handleCategoryChange}
            options={categories}
            showSearch
            optionFilterProp="label"
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} transactions`,
          }}
          scroll={{ x: true }}
          locale={{
            emptyText: 'No transactions found',
          }}
        />
      </Card>
    </div>
  );
} 