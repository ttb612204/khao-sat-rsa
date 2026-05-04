'use client';

import React from 'react';
import { Button, Space } from 'antd';
import { SaveOutlined, SendOutlined, FileSearchOutlined } from '@ant-design/icons';

interface SubmitBarProps {
  onReview: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isDirty?: boolean;
}

const SubmitBar: React.FC<SubmitBarProps> = ({ onReview, onSubmit, isSubmitting, isDirty }) => {
  return (
    <div className="submit-bar">
      <Space size="large">
        <Button 
          icon={<FileSearchOutlined />} 
          size="large" 
          onClick={onReview}
          className="btn-review"
        >
          XEM LẠI PHIẾU
        </Button>
        <Button 
          type="primary" 
          icon={<SendOutlined />} 
          size="large" 
          onClick={onSubmit}
          loading={isSubmitting}
          className="btn-submit"
        >
          GỬI PHIẾU KHẢO SÁT
        </Button>
      </Space>

      <style jsx>{`
        .submit-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          padding: 20px;
          display: flex;
          justify-content: center;
          box-shadow: 0 -10px 20px rgba(0,0,0,0.05);
          z-index: 1000;
          border-top: 1px solid rgba(255,255,255,0.5);
        }

        :global(.btn-review) {
          border-radius: 12px !important;
          height: 52px !important;
          padding: 0 32px !important;
          font-weight: 600 !important;
          border: 2px solid #d32f2f !important;
          color: #d32f2f !important;
        }

        :global(.btn-submit) {
          border-radius: 12px !important;
          height: 52px !important;
          padding: 0 40px !important;
          font-weight: 700 !important;
          background: linear-gradient(135deg, #ff4d4f 0%, #d32f2f 100%) !important;
          border: none !important;
          box-shadow: 0 8px 16px rgba(211,47,47,0.2) !important;
        }
      `}</style>
    </div>
  );
};

export default SubmitBar;
