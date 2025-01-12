'use client';
import React from 'react';
import { Menu } from 'antd';
import { 
  HomeOutlined, 
  DollarOutlined,
  PieChartOutlined,
  SettingOutlined 
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { DollarLogo } from './icons/DollarLogo';
import { BRAND_COLORS, APP_NAME } from '@/constants/theme';

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div>
      {/* Top Menu */}
      <div className="bg-[#2E7D32] text-white">
        <div className="container mx-auto">
          <Menu
            mode="horizontal"
            selectedKeys={[pathname]}
            onClick={({ key }) => router.push(key)}
            className="border-none justify-center"
            style={{ 
              backgroundColor: 'transparent',
            }}
            items={[
              {
                key: '/',
                icon: <HomeOutlined />,
                label: 'Overview',
                className: 'text-white hover:text-white',
                style: { color: 'white' }
              },
              {
                key: '/transactions',
                icon: <DollarOutlined />,
                label: 'Transactions',
                className: 'text-white hover:text-white',
                style: { color: 'white' }
              },
              {
                key: '/budgets',
                icon: <PieChartOutlined />,
                label: 'Budgets',
                className: 'text-white hover:text-white',
                style: { color: 'white' }
              },
              {
                key: '/settings',
                icon: <SettingOutlined />,
                label: 'Settings',
                className: 'text-white hover:text-white',
                style: { color: 'white' }
              }
            ]}
          />
        </div>
      </div>

      {/* Logo Bar */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto">
          <div className="flex justify-between items-center py-4 px-4">
            <div 
              className="text-2xl font-bold text-[#2E7D32] cursor-pointer flex items-center gap-2" 
              onClick={() => router.push('/')}
            >
              <DollarLogo className="w-8 h-8" />
              {APP_NAME}
            </div>
            <div className="text-sm text-gray-600">
              Welcome to MyDollar
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation; 