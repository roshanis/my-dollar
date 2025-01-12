'use client';
import React, { useEffect, useState } from 'react';
import { Row, Col, Statistic, Card, Spin } from 'antd';
import MonthlyChart from '@/components/dashboard/MonthlyChart';
import VendorChart from '@/components/dashboard/VendorChart';

interface DashboardData {
  monthlySpending: { month: string; total: number; }[];
  topVendors: { name: string; value: number; }[];
  totalSpent: number;
  averageTransaction: number;
  transactionCount: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center">
        Transaction Dashboard
      </h1>

      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} md={8}>
          <Card className="text-center">
            <Statistic
              title="Total Spent"
              value={data.totalSpent}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="text-center">
            <Statistic
              title="Average Transaction"
              value={data.averageTransaction}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="text-center">
            <Statistic
              title="Transaction Count"
              value={data.transactionCount}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <MonthlyChart data={data.monthlySpending} />
        </Col>
        <Col xs={24} lg={12}>
          <VendorChart data={data.topVendors} />
        </Col>
      </Row>
    </div>
  );
} 