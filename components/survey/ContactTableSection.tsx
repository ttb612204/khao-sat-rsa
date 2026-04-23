'use client';

import React from 'react';
import { Input, Space, Typography, Collapse } from 'antd';
import { useFieldArray, Controller } from 'react-hook-form';

const { Text } = Typography;

interface ContactTableSectionProps {
  control: any;
}

const ContactTableSection: React.FC<ContactTableSectionProps> = ({ control }) => {
  const { fields } = useFieldArray({
    control,
    name: 'q21',
  });

  const items = fields.map((field, index) => {
    const sectorName = (field as any).field;

    return {
      key: index.toString(),
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            background: '#1677ff',
            flexShrink: 0
          }} />
          <Text strong style={{ color: '#002766', fontSize: '15px' }}>
            {sectorName}
          </Text>
        </div>
      ),
      children: (
        <Space orientation="vertical" style={{ width: '100%', padding: '8px 4px' }} size="middle">
          <div>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>Họ tên:</Text>
            <Controller
              name={`q21.${index}.name`}
              control={control}
              render={({ field: inputField }) => (
                <Input
                  {...inputField}
                  placeholder="Nhập họ và tên"
                  style={{ borderRadius: '8px' }}
                />
              )}
            />
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>Chức danh:</Text>
            <Controller
              name={`q21.${index}.position`}
              control={control}
              render={({ field: inputField }) => (
                <Input
                  {...inputField}
                  placeholder="Nhập chức danh"
                  style={{ borderRadius: '8px' }}
                />
              )}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>Số điện thoại:</Text>
              <Controller
                name={`q21.${index}.phone`}
                control={control}
                render={({ field: inputField }) => (
                  <Input
                    {...inputField}
                    placeholder="Nhập SĐT"
                    style={{ borderRadius: '8px' }}
                  />
                )}
              />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>Email:</Text>
              <Controller
                name={`q21.${index}.email`}
                control={control}
                render={({ field: inputField }) => (
                  <Input
                    {...inputField}
                    placeholder="Nhập email"
                    style={{ borderRadius: '8px' }}
                  />
                )}
              />
            </div>
          </div>
        </Space>
      ),
      style: {
        marginBottom: 16, 
        background: '#fff', 
        borderRadius: '12px',
        border: '1px solid #f0f0f0',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }
    };
  });

  return (
    <div className="contact-section">
      <Collapse 
        defaultActiveKey={['0']} 
        expandIconPlacement="end"
        items={items}
        style={{ 
          background: 'transparent', 
          border: 'none' 
        }}
        className="contact-collapse"
      />
      
      <div style={{ marginTop: 12, padding: '0 8px' }}>
        <Text type="secondary" style={{ fontSize: '13px', fontStyle: 'italic' }}>
          * Nhấn vào từng lĩnh vực để điền thông tin đầu mối tương ứng.
        </Text>
      </div>

      <style jsx global>{`
        .contact-collapse .ant-collapse-header {
          padding: 16px 20px !important;
          align-items: center !important;
        }
        .contact-collapse .ant-collapse-content-box {
          padding: 12px 24px 24px !important;
        }
        .contact-collapse .ant-collapse-item-active {
          border-color: #1677ff !important;
        }
        .contact-collapse .ant-collapse-item-active .ant-collapse-header {
          background: #f0f7ff !important;
        }
      `}</style>
    </div>
  );
};

export default ContactTableSection;
