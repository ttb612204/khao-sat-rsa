'use client';

import React from 'react';
import { Drawer, Descriptions, Divider, Typography, Table } from 'antd';
import { QUESTIONS, SECTIONS } from '@/constants/survey';
import { SurveyData } from '@/types/survey';

const { Title, Text } = Typography;

interface ReviewDrawerProps {
  visible: boolean;
  onClose: () => void;
  data: SurveyData;
}

const ReviewDrawer: React.FC<ReviewDrawerProps> = ({ visible, onClose, data }) => {
  const renderValue = (val: any) => {
    if (Array.isArray(val)) return val.join(', ') || '(Trống)';
    return val || '(Trống)';
  };

  return (
    <Drawer
      title="Xem lại thông tin khảo sát"
      placement="right"
      onClose={onClose}
      open={visible}
      size={typeof window !== 'undefined' && window.innerWidth > 768 ? 800 : '100%'}
    >
      <Title level={4} style={{ textAlign: 'center', marginBottom: 32 }}>
        BẢN TÓM TẮT THÔNG TIN
      </Title>

      {SECTIONS.map((section) => (
        <div key={section.id} style={{ marginBottom: 40 }}>
          <Title level={5} style={{ color: '#1677ff', borderLeft: '4px solid #1677ff', paddingLeft: 12 }}>
            {section.title}
          </Title>
          
          {section.id === 'section4' ? (
            <Table 
              dataSource={data.q21} 
              pagination={false} 
              size="small"
              columns={[
                { title: 'Lĩnh vực', dataIndex: 'field' },
                { title: 'Họ tên', dataIndex: 'name' },
                { title: 'Chức danh', dataIndex: 'position' },
                { title: 'SĐT/Email', dataIndex: 'phoneEmail' },
              ]}
            />
          ) : (
            <Descriptions bordered column={1} size="small">
              {section.questions.map((qId) => {
                const q = QUESTIONS.find((item) => item.id === qId);
                if (!q) return null;
                return (
                  <Descriptions.Item key={qId} label={`${q.number}. ${q.label}`}>
                    {renderValue(data[qId as keyof SurveyData])}
                    {qId === 'q14' && data.q14?.includes('Chỉ liên hệ trực tiếp khi cần') && (
                      <div style={{ marginTop: 8, color: '#8c8c8c' }}>
                        Mô tả: {data.q14_detail}
                      </div>
                    )}
                    {qId === 'q15' && data.q15?.includes('Chủ đề khác') && (
                      <div style={{ marginTop: 8, color: '#8c8c8c' }}>
                        Khác: {data.q15_other}
                      </div>
                    )}
                    {qId === 'q23' && data.q23?.includes('Chủ đề khác') && (
                      <div style={{ marginTop: 8, color: '#8c8c8c' }}>
                        Khác: {data.q23_other}
                      </div>
                    )}
                  </Descriptions.Item>
                );
              })}
            </Descriptions>
          )}
          <Divider />
        </div>
      ))}
    </Drawer>
  );
};

export default ReviewDrawer;
