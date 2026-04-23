'use client';

import React from 'react';
import { 
  SaveOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  SendOutlined
} from '@ant-design/icons';
import { Button, Space, Popconfirm, Tooltip } from 'antd';

interface SubmitBarProps {
  onSave: () => void;
  onReset: () => void;
  onReview: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const SubmitBar: React.FC<SubmitBarProps> = ({ 
  onSave, onReset, onReview, onSubmit, isSubmitting 
}) => {
  return (
    <div className="sticky-bar">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
        {/* Nhóm tiện ích bên trái */}
        <Space size="middle" wrap>
          <Tooltip title="Lưu bản nháp vào trình duyệt">
            <Button icon={<SaveOutlined />} onClick={onSave} className="action-btn">Lưu nháp</Button>
          </Tooltip>

          <Popconfirm
            title="Xóa toàn bộ dữ liệu đang nhập?"
            onConfirm={onReset}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa sạch dữ liệu hiện tại">
              <Button icon={<DeleteOutlined />} danger type="text" className="action-btn-danger" />
            </Tooltip>
          </Popconfirm>
        </Space>

        {/* Nhóm hành động chính bên phải */}
        <Space size="large" wrap>
          <Button 
            icon={<EyeOutlined />} 
            onClick={onReview} 
            size="large" 
            style={{ borderRadius: '14px', border: '1px solid #d9d9d9', fontWeight: 500, height: '48px' }}
          >
            Xem lại
          </Button>
          <Button 
            type="primary" 
            icon={<SendOutlined />} 
            onClick={onSubmit} 
            loading={isSubmitting}
            size="large"
            style={{ height: '48px', padding: '0 32px' }}
            className="submit-btn-premium"
          >
            Gửi phiếu khảo sát
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default SubmitBar;
