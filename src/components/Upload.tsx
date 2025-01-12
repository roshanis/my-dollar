'use client';
import React, { useState } from 'react';
import { Upload, Button, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const CSVUpload: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    
    try {
      setLoading(true);
      console.log('Starting upload for file:', file.name);
      
      const formData = new FormData();
      formData.append('file', file);

      console.log('Sending request to server...');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      // Log the raw response
      console.log('Server response status:', response.status);
      const result = await response.json();
      console.log('Server response:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      onSuccess(result);
      window.dispatchEvent(new Event('transactionUploaded'));
      
      notification.success({
        message: 'Upload Successful',
        description: result.message || 'File uploaded successfully',
        duration: 5,
      });
    } catch (error) {
      console.error('Upload error:', error);
      onError(error);
      
      notification.error({
        message: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload file',
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Upload.Dragger
      customRequest={handleUpload}
      accept=".csv"
      showUploadList={false}
      disabled={loading}
      multiple={false}
    >
      <p className="ant-upload-drag-icon">
        <UploadOutlined />
      </p>
      <p className="ant-upload-text">Click or drag CSV file to upload</p>
      <p className="ant-upload-hint">
        File must be a CSV with columns: date, merchant, amount, category
      </p>
      {loading && <p>Uploading...</p>}
    </Upload.Dragger>
  );
};

export default CSVUpload; 