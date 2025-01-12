'use client';
import { Card, Row, Col, Progress, Button } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Top Summary Cards */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} md={6}>
          <Card className="bg-[#0ac775] text-white">
            <div className="text-lg font-semibold mb-2">Cash</div>
            <div className="text-2xl">$2,450.35</div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card className="bg-[#ff6b6b]">
            <div className="text-lg font-semibold mb-2 text-white">Credit</div>
            <div className="text-2xl text-white">-$523.45</div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <div className="text-lg font-semibold mb-2">Investments</div>
            <div className="text-2xl">$15,234.89</div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <div className="text-lg font-semibold mb-2">Net Worth</div>
            <div className="text-2xl">$17,161.79</div>
          </Card>
        </Col>
      </Row>

      {/* Budget Overview */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Monthly Budget Overview">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Groceries</span>
                    <span>$350/$500</span>
                  </div>
                  <Progress percent={70} status="active" strokeColor="#0ac775" />
                </div>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Entertainment</span>
                    <span>$120/$200</span>
                  </div>
                  <Progress percent={60} status="active" strokeColor="#0ac775" />
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Transportation</span>
                    <span>$180/$300</span>
                  </div>
                  <Progress percent={60} status="active" strokeColor="#0ac775" />
                </div>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Shopping</span>
                    <span>$250/$400</span>
                  </div>
                  <Progress percent={62.5} status="active" strokeColor="#0ac775" />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="Recent Transactions">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">Walmart</div>
                  <div className="text-gray-500 text-sm">Groceries</div>
                </div>
                <div className="text-red-500">-$85.43</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">Amazon</div>
                  <div className="text-gray-500 text-sm">Shopping</div>
                </div>
                <div className="text-red-500">-$34.99</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">Salary</div>
                  <div className="text-gray-500 text-sm">Income</div>
                </div>
                <div className="text-green-500">+$2,500.00</div>
              </div>
            </div>
            <Button type="link" className="w-full mt-4">View All Transactions</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
} 