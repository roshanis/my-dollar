'use client';
import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Tag, notification } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

interface DuplicatesModalProps {
  visible: boolean;
  onClose: () => void;
}

const DuplicatesModal: React.FC<DuplicatesModalProps> = ({ visible, onClose }) => {
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDuplicates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/transactions/duplicates');
      if (!response.ok) throw new Error('Failed to fetch duplicates');
      const data = await response.json();
      setDuplicates(data);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to load duplicate transactions',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchDuplicates();
    }
  }, [visible]);

  const handleDuplicate = async (id: number, action: 'force' | 'merge') => {
    try {
      const response = await fetch('/api/transactions/duplicates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });

      if (!response.ok) throw new Error('Failed to process duplicate');

      notification.success({
        message: 'Success',
        description: `Transaction ${action === 'force' ? 'forced' : 'merged'} successfully`,
      });

      fetchDuplicates();
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to process duplicate transaction',
      });
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'duplicate_date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Merchant',
      dataIndex: 'merchant',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'resolution',
      render: (resolution: string) => (
        <Tag color={
          resolution === 'skipped' ? 'orange' :
          resolution === 'forced' ? 'green' :
          resolution === 'merged' ? 'blue' : 'default'
        }>
          {resolution || 'pending'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      render: (_: any, record: any) => (
        record.resolution === 'skipped' && (
          <div className="space-x-2">
            <Button size="small" onClick={() => handleDuplicate(record.id, 'force')}>
              Force Add
            </Button>
            <Button size="small" onClick={() => handleDuplicate(record.id, 'merge')}>
              Merge
            </Button>
          </div>
        )
      ),
    },
  ];

  return (
    <Modal
      title="Duplicate Transactions"
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="refresh" icon={<SyncOutlined />} onClick={fetchDuplicates}>
          Refresh
        </Button>,
        <Button key="close" type="primary" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <Table
        columns={columns}
        dataSource={duplicates}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </Modal>
  );
};

export default DuplicatesModal; 