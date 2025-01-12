'use client';
import React from 'react';
import { Card, Row, Col, Progress, Button, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function Budgets() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Budgets</h1>
        <Button type="primary" icon={<PlusOutlined />} className="bg-[#0ac775]">
          Create Budget
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Monthly Budgets" extra={
            <Select defaultValue="march" style={{ width: 120 }}>
              <Select.Option value="march">March 2024</Select.Option>
              <Select.Option value="april">April 2024</Select.Option>
            </Select>
          }>
            <div className="space-y-6">
              <BudgetItem
                category="Groceries"
                spent={350}
                budget={500}
                color="#0ac775"
              />
              <BudgetItem
                category="Entertainment"
                spent={180}
                budget={200}
                color="#ff6b6b"
              />
              <BudgetItem
                category="Transportation"
                spent={120}
                budget={300}
                color="#4a90e2"
              />
              <BudgetItem
                category="Shopping"
                spent={250}
                budget={400}
                color="#f7b731"
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Budget Summary">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-[#0ac775]">$900</div>
              <div className="text-gray-500">Left to spend</div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Budget</span>
                <span className="font-bold">$1,400</span>
              </div>
              <div className="flex justify-between">
                <span>Spent</span>
                <span className="font-bold text-red-500">$500</span>
              </div>
              <div className="flex justify-between">
                <span>Income</span>
                <span className="font-bold text-green-500">$2,500</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

interface BudgetItemProps {
  category: string;
  spent: number;
  budget: number;
  color: string;
}

const BudgetItem: React.FC<BudgetItemProps> = ({ category, spent, budget, color }) => {
  const percentage = (spent / budget) * 100;
  
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-semibold">{category}</span>
        <span>${spent} of ${budget}</span>
      </div>
      <Progress 
        percent={percentage} 
        strokeColor={color}
        status={percentage > 100 ? 'exception' : 'normal'}
      />
    </div>
  );
}; 