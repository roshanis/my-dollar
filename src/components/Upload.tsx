import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const CSVUpload: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const beforeUpload = (file: File) => {
    const isCsv = file.type === 'text/csv' || file.name.endsWith('.csv');
    if (!isCsv) {
      message.error('Please upload a CSV file only!');
    }
    return isCsv;
  };

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }
      
      message.success(`${result.message}`);
      onSuccess(result);
      
      // Trigger page refresh to show new transactions
      window.location.reload();
      
    } catch (error) {
      console.error('Upload error:', error);
      message.error(error.message || 'Upload failed');
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container max-w-2xl mx-auto">
      <Dragger
        name="file"
        multiple={false}
        beforeUpload={beforeUpload}
        customRequest={handleUpload}
        showUploadList={true}
        disabled={loading}
        className="bg-white p-6 rounded-lg shadow-sm border-2 border-dashed"
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined className="text-4xl text-blue-500" />
        </p>
        <p className="ant-upload-text text-lg mt-4">
          Click or drag CSV file to upload
        </p>
        <p className="ant-upload-hint text-gray-500 mt-2">
          Supports CSV files from major banks and credit cards
        </p>
        {loading && <p className="text-blue-500 mt-2">Uploading...</p>}
      </Dragger>
    </div>
  );
};

export default CSVUpload; 