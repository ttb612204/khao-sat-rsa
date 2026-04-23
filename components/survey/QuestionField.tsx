'use client';

import React from 'react';
import { Form, Input, Checkbox } from 'antd';
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

  return (
    <Form.Item
      label={
        <span className="question-label">
          {number}. {label} {required && <span style={{ color: '#ff4d4f' }}>*</span>}
        </span>
      }
      validateStatus={error ? 'error' : ''}
      help={error || helperText}
      layout="vertical"
      style={{ marginBottom: 24 }}
    >
      <Controller
        name={id}
        control={control}
        render={({ field }) => {
          if (type === 'checkbox') {
            return (
              <Checkbox.Group
                {...field}
                options={options}
                style={{ width: '100%' }}
              />
            );
          }
          return (
            <TextArea
              {...field}
              placeholder={placeholder}
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          );
        }}
      />
    </Form.Item>
  );
};

export default QuestionField;
