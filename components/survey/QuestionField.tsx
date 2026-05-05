'use client';

import React from 'react';
import { Form, Input, Checkbox, Radio, Typography, Collapse, Card, Space } from 'antd';
const { Text } = Typography;
const { Panel } = Collapse;
import { Controller, Control } from 'react-hook-form';
import { Question } from '@/types/survey';

const { TextArea } = Input;

interface QuestionFieldProps {
  question: Question;
  control: any;
  error?: string;
}

const QuestionField: React.FC<QuestionFieldProps> = ({ question, control, error }) => {
  const { id, label, number, type, options, placeholder, helperText, required } = question;

  const isSubQuestion = typeof number === 'string' && number.includes('.');

  if (type === 'info') {
    return (
      <div style={{ 
        marginBottom: 16, 
        marginTop: isSubQuestion ? 0 : 20,
        paddingLeft: isSubQuestion ? 24 : 0 
      }}>
        <Text strong style={{ fontSize: isSubQuestion ? '14px' : '16px', color: '#1e293b' }}>
          {number}. {label}
        </Text>
      </div>
    );
  }

  return (
    <Form.Item
      label={
        <span className={`question-label ${isSubQuestion ? 'sub-question' : ''}`} style={{ paddingLeft: isSubQuestion ? 24 : 0 }}>
          {number}. {label} {required && <span style={{ color: '#ff4d4f' }}>*</span>}
        </span>
      }
      validateStatus={error ? 'error' : ''}
      help={error || helperText}
      layout="vertical"
      style={{ marginBottom: 24 }}
    >
      <div style={{ paddingLeft: isSubQuestion ? 24 : 0 }}>
        <Controller
          name={id}
          control={control}
          render={({ field }) => {
            if (type === 'contact_list') {
              const currentValues = Array.isArray(field.value) ? field.value : [];
              // Lấy danh sách các trường con từ helperText (mặc định nếu trống)
              const subFieldLabels = helperText 
                ? helperText.split(',').map(s => s.trim()).filter(s => s)
                : ['Họ tên', 'Chức danh', 'Số điện thoại', 'Email'];
              
              const updateItem = (category: string, fieldName: string, value: string) => {
                const newValues = [...currentValues];
                const index = newValues.findIndex(v => v.field === category);
                if (index > -1) {
                  newValues[index] = { ...newValues[index], [fieldName]: value };
                } else {
                  newValues.push({ field: category, [fieldName]: value });
                }
                field.onChange(newValues);
              };

              const collapseItems = options?.map((category: string, idx: number) => {
                const data = currentValues.find(v => v.field === category) || {};
                return {
                  key: idx,
                  label: <Text strong style={{ color: '#0052cc' }}>{category}</Text>,
                  className: "contact-panel",
                  children: (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {subFieldLabels.map((subLabel, sIdx) => (
                        <Form.Item key={sIdx} label={subLabel} style={{ marginBottom: 12 }}>
                          <Input 
                            value={data[subLabel] || ''} 
                            onChange={(e) => updateItem(category, subLabel, e.target.value)}
                            placeholder={`Nhập ${subLabel.toLowerCase()}...`}
                          />
                        </Form.Item>
                      ))}
                    </div>
                  )
                };
              });

              return (
                <div className="contact-list-container">
                  <Collapse 
                    ghost 
                    expandIconPlacement="end" 
                    className="custom-collapse" 
                    items={collapseItems}
                  />
                  <style jsx>{`
                    :global(.contact-panel) {
                      background: #ffffff !important;
                      border: 1px solid #e1e4e8 !important;
                      border-radius: 12px !important;
                      margin-bottom: 12px !important;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                    }
                    :global(.contact-panel .ant-collapse-header) {
                      padding: 16px 20px !important;
                    }
                  `}</style>
                </div>
              );
            }
            if (type === 'checkbox') {
              return (
                <Checkbox.Group
                  {...field}
                  className="custom-checkbox-group"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {options?.map((opt: string, i: number) => (
                      <Checkbox key={i} value={opt}>{opt}</Checkbox>
                    ))}
                  </div>
                </Checkbox.Group>
              );
            }
            if (type === 'radio') {
              return (
                <Radio.Group
                  {...field}
                  className="custom-radio-group"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {options?.map((opt: string, i: number) => (
                      <Radio key={i} value={opt}>{opt}</Radio>
                    ))}
                  </div>
                </Radio.Group>
              );
            }
            if (type === 'textarea') {
              return (
                <TextArea
                  {...field}
                  placeholder={placeholder || "Nhập nội dung..."}
                  autoSize={{ minRows: 3, maxRows: 8 }}
                  className="custom-textarea"
                />
              );
            }
            return (
              <Input
                {...field}
                placeholder={placeholder || "Nhập câu trả lời..."}
                className="custom-input"
              />
            );
          }}
        />
      </div>
    </Form.Item>
  );
};

export default QuestionField;
