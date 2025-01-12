'use client';
import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Switch, Select, Divider, notification, Spin, InputNumber } from 'antd';
import { SaveOutlined, LoadingOutlined } from '@ant-design/icons';
import type { NotificationPlacement } from 'antd/es/notification/interface';

interface SettingsForm {
  name: string;
  email: string;
  currency: string;
  emailNotifications: boolean;
  budgetAlerts: boolean;
  largeTransactionAlerts: boolean;
  largeTransactionAmount: number;
  darkMode: boolean;
  language: string;
  timezone: string;
}

const SettingsPage: React.FC = () => {
  const [form] = Form.useForm<SettingsForm>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) throw new Error('Failed to load settings');
        const data = await response.json();
        form.setFieldsValue(data);
      } catch (error) {
        notification.error({
          message: 'Error',
          description: 'Failed to load settings',
          placement: 'topRight' as NotificationPlacement,
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [form]);

  const onFinish = async (values: SettingsForm) => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) throw new Error('Failed to update settings');
      
      notification.success({
        message: 'Success',
        description: 'Settings updated successfully',
        placement: 'topRight',
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to update settings',
        placement: 'topRight',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to export data',
        placement: 'topRight',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Form 
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          currency: 'usd',
          emailNotifications: true,
          budgetAlerts: true,
          largeTransactionAlerts: false,
          largeTransactionAmount: 1000,
          language: 'en',
          timezone: 'UTC',
          darkMode: false,
        }}
      >
        <Card title="Profile Settings" className="mb-6">
          <Form.Item 
            label="Name" 
            name="name"
            rules={[
              { required: true, message: 'Please input your name!' },
              { min: 2, message: 'Name must be at least 2 characters!' },
              { max: 50, message: 'Name cannot be longer than 50 characters!' }
            ]}
          >
            <Input placeholder="Your name" />
          </Form.Item>
          
          <Form.Item 
            label="Email" 
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
              { max: 100, message: 'Email cannot be longer than 100 characters!' }
            ]}
          >
            <Input type="email" placeholder="your@email.com" />
          </Form.Item>
          
          <Form.Item 
            label="Currency" 
            name="currency"
            rules={[{ required: true, message: 'Please select a currency!' }]}
          >
            <Select>
              <Select.Option value="usd">USD ($)</Select.Option>
              <Select.Option value="eur">EUR (€)</Select.Option>
              <Select.Option value="gbp">GBP (£)</Select.Option>
              <Select.Option value="jpy">JPY (¥)</Select.Option>
              <Select.Option value="cad">CAD ($)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="Language" 
            name="language"
          >
            <Select>
              <Select.Option value="en">English</Select.Option>
              <Select.Option value="es">Spanish</Select.Option>
              <Select.Option value="fr">French</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="Timezone" 
            name="timezone"
          >
            <Select>
              <Select.Option value="UTC">UTC</Select.Option>
              <Select.Option value="EST">Eastern Time</Select.Option>
              <Select.Option value="PST">Pacific Time</Select.Option>
            </Select>
          </Form.Item>
        </Card>

        <Card title="Notifications" className="mb-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">Email Notifications</div>
                <div className="text-gray-500">Receive updates about your transactions</div>
              </div>
              <Form.Item name="emailNotifications" valuePropName="checked" noStyle>
                <Switch />
              </Form.Item>
            </div>
            
            <Divider />
            
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">Budget Alerts</div>
                <div className="text-gray-500">Get notified when you're close to budget limits</div>
              </div>
              <Form.Item name="budgetAlerts" valuePropName="checked" noStyle>
                <Switch />
              </Form.Item>
            </div>
            
            <Divider />
            
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">Large Transaction Alerts</div>
                <div className="text-gray-500">Notify for transactions over specified amount</div>
              </div>
              <div className="flex items-center gap-4">
                <Form.Item name="largeTransactionAmount" noStyle>
                  <InputNumber 
                    prefix="$"
                    min={0}
                    step={100}
                    style={{ width: 120 }}
                  />
                </Form.Item>
                <Form.Item name="largeTransactionAlerts" valuePropName="checked" noStyle>
                  <Switch />
                </Form.Item>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Appearance" className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">Dark Mode</div>
              <div className="text-gray-500">Enable dark mode for the interface</div>
            </div>
            <Form.Item name="darkMode" valuePropName="checked" noStyle>
              <Switch />
            </Form.Item>
          </div>
        </Card>

        <Card title="Data Management" className="mb-6">
          <div className="space-y-4">
            <Button block onClick={handleExportData}>
              Export All Data (CSV)
            </Button>
            <Button block danger>
              Delete Account
            </Button>
          </div>
        </Card>

        <Button 
          type="primary" 
          htmlType="submit" 
          className="bg-[#0ac775]"
          icon={<SaveOutlined />}
          loading={saving}
          block
        >
          Save All Changes
        </Button>
      </Form>
    </div>
  );
};

export default SettingsPage; 