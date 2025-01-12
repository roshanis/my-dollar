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
    <div className="bg-[#2E7D32] text-white shadow-lg">
      <div className="container mx-auto">
        <div className="flex justify-between items-center py-3 px-4">
          <div 
            className="text-2xl font-bold text-white cursor-pointer flex items-center gap-2" 
            onClick={() => router.push('/')}
          >
            <DollarLogo className="w-8 h-8" />
            {APP_NAME}
          </div>
          <Menu
            mode="horizontal"
            selectedKeys={[pathname]}
            onClick={({ key }) => router.push(key)}
            className="border-none bg-transparent"
            style={{ 
              color: 'white',
              backgroundColor: 'transparent',
            }}
            items={[
              {
                key: '/',
                icon: <HomeOutlined />,
                label: 'Overview',
              },
              {
                key: '/transactions',
                icon: <DollarOutlined />,
                label: 'Transactions',
              },
              {
                key: '/budgets',
                icon: <PieChartOutlined />,
                label: 'Budgets',
              },
              {
                key: '/settings',
                icon: <SettingOutlined />,
                label: 'Settings',
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Navigation; 