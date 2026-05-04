'use client';

import React from 'react';
import { Drawer, Button, Typography, Divider, Tag, Space } from 'antd';
import { QUESTIONS } from '@/constants/survey';
import { FileSearchOutlined, SendOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ReviewDrawerProps {
  open: boolean;
  onClose: () => void;
  data: any;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const ReviewDrawer: React.FC<ReviewDrawerProps> = ({ open, onClose, data, onSubmit, isSubmitting }) => {
  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#d32f2f' }}>
          <FileSearchOutlined /> XEM LẠI THÔNG TIN ĐÃ NHẬP
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={720}
      extra={
        <Space>
          <Button onClick={onClose}>Tiếp tục sửa</Button>
          <Button type="primary" icon={<SendOutlined />} onClick={onSubmit} loading={isSubmitting}>
            Gửi ngay
          </Button>
        </Space>
      }
    >
      <div className="review-content">
        {QUESTIONS.map((q) => {
          const value = data[q.id];
          if (q.id === 'q21') return null;

          return (
            <div key={q.id} className="review-item">
              <Text strong className="review-q">{q.number}. {q.label}</Text>
              <div className="review-ans">
                {Array.isArray(value) ? (
                  value.length > 0 ? (
                    value.map((v: string) => <Tag key={v} color="blue" style={{ marginBottom: 4 }}>{v}</Tag>)
                  ) : (
                    <Text type="secondary">Chưa chọn</Text>
                  )
                ) : value ? (
                  <Text style={{ whiteSpace: 'pre-wrap' }}>{value}</Text>
                ) : (
                  <Text type="secondary">Chưa nhập</Text>
                )}
              </div>
              <Divider style={{ margin: '12px 0' }} />
            </div>
          );
        })}

        <Title level={5} style={{ color: '#d32f2f', marginTop: 24 }}>Phần 4: Đầu mối kết nối</Title>
        <div className="contact-review">
          {data.q21?.map((item: any, idx: number) => (
            <div key={idx} style={{ marginBottom: 16, padding: 12, background: '#fafafa', borderRadius: 8 }}>
              <Text strong>{item.field}</Text>
              <br />
              <Text>Họ tên: {item.name || 'N/A'}</Text> | <Text>SĐT: {item.phone || 'N/A'}</Text>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .review-item {
          margin-bottom: 20px;
        }
        .review-q {
          display: block;
          margin-bottom: 8px;
          color: #555;
        }
        .review-ans {
          padding-left: 12px;
          border-left: 3px solid #eee;
        }
      `}</style>
    </Drawer>
  );
};

export default ReviewDrawer;
