import React, { useState, useEffect } from 'react';
import { Table, Input, Select, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { RangePicker } = DatePicker;

interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  location?: string;
  reference?: string;
}

const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  const columns: ColumnsType<Transaction> = [
    {
      title: 'Date',
      dataIndex: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Merchant',
      dataIndex: 'merchant',
      sorter: (a, b) => a.merchant.localeCompare(b.merchant),
      filterable: true,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (amount: number) => `$${amount.toFixed(2)}`,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      filters: [
        // You can populate this dynamically based on your categories
        { text: 'Food & Dining', value: 'food' },
        { text: 'Shopping', value: 'shopping' },
        { text: 'Travel', value: 'travel' },
      ],
    },
    {
      title: 'Location',
      dataIndex: 'location',
    },
  ];

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates ? [dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')] : null);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchText 
      ? transaction.merchant.toLowerCase().includes(searchText.toLowerCase()) 
      : true;

    const matchesDateRange = dateRange
      ? new Date(transaction.date) >= new Date(dateRange[0]) &&
        new Date(transaction.date) <= new Date(dateRange[1])
      : true;

    return matchesSearch && matchesDateRange;
  });

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-4 flex-wrap">
        <Search
          placeholder="Search merchants"
          onSearch={handleSearch}
          style={{ width: 200 }}
        />
        <RangePicker onChange={handleDateRangeChange} />
      </div>

      <Table
        columns={columns}
        dataSource={filteredTransactions}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} transactions`,
        }}
        summary={(pageData) => {
          const total = pageData.reduce((sum, transaction) => sum + transaction.amount, 0);
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
              <Table.Summary.Cell index={1}></Table.Summary.Cell>
              <Table.Summary.Cell index={2}>${total.toFixed(2)}</Table.Summary.Cell>
              <Table.Summary.Cell index={3}></Table.Summary.Cell>
              <Table.Summary.Cell index={4}></Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    </div>
  );
};

export default TransactionList; 