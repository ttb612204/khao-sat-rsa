'use client';

import React from 'react';
import { Typography, Progress } from 'antd';
import { SURVEY_TITLE, SURVEY_SUBTITLE } from '@/constants/survey';

const { Title, Text } = Typography;

interface SurveyHeaderProps {
  progress: number;
}

const SurveyHeader: React.FC<SurveyHeaderProps> = ({ progress }) => {
  return (
    <header className="header-container">
      <Title level={1} className="header-title">
        {SURVEY_TITLE}
      </Title>
      <Text style={{ fontSize: 18, color: '#595959', fontWeight: 400, letterSpacing: '0.5px' }}>
        {SURVEY_SUBTITLE}
      </Text>
      <div style={{ maxWidth: 500, margin: '32px auto 0' }}>
        <Progress 
          percent={progress} 
          status="active" 
          strokeColor={{ '0%': '#002766', '100%': '#1677ff' }}
          size={12}
          showInfo={false}
        />
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
          <Text type="secondary">Tiến độ hoàn thành</Text>
          <Text strong style={{ color: '#1677ff' }}>{progress}%</Text>
        </div>
      </div>
    </header>
  );
};

export default SurveyHeader;
