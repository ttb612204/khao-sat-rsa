'use client';

import React from 'react';
import { Button, Input, Space, Card, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useFieldArray } from 'react-hook-form';
import { ContactPoint } from '@/types/survey';

const { Text } = Typography;

interface ContactTableSectionProps {
  control: any;
}

const ContactTableSection: React.FC<ContactTableSectionProps> = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'q21',
  });

  const renderCell = (index: number, fieldName: keyof ContactPoint, placeholder: string) => (
    <Input
      placeholder={placeholder}
      {...control.register(`q21.${index}.${fieldName}`)}
      style={{ borderRadius: '8px' }}
    />
  );

  return (
    <div className="contact-section">
      <div className="contact-cards-container">
        {fields.map((field, index) => (
          <Card 
            key={field.id} 
            size="small" 
            style={{ 
              marginBottom: 20, 
              borderRadius: '12px', 
              border: '1px solid #f0f0f0',
              background: '#fff'
            }}
            title={
              <Space>
                <Text strong style={{ color: '#1677ff' }}>Đầu mối {index + 1}</Text>
              </Space>
            }
            extra={
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => remove(index)} 
              />
            }
          >
            <Space orientation="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>Lĩnh vực:</Text>
                {renderCell(index, 'field', 'Lĩnh vực chuyên môn')}
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>Họ tên:</Text>
                {renderCell(index, 'name', 'Nhập họ và tên')}
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>Chức danh:</Text>
                {renderCell(index, 'position', 'Nhập chức danh')}
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 4 }}>SĐT và Email:</Text>
                {renderCell(index, 'phoneEmail', 'Nhập số điện thoại và email liên hệ')}
              </div>
            </Space>
          </Card>
        ))}
      </div>

      <Button 
        type="dashed" 
        onClick={() => append({ key: Date.now().toString(), field: '', name: '', position: '', phoneEmail: '' })} 
        block 
        icon={<PlusOutlined />}
        style={{ 
          height: '45px', 
          borderRadius: '12px', 
          marginTop: 8,
          borderStyle: 'dashed',
          borderColor: '#d9d9d9'
        }}
      >
        Thêm đầu mối kết nối
      </Button>
    </div>
  );
};

export default ContactTableSection;
