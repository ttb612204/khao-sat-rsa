'use client';

import React, { useMemo } from 'react';
import { Typography, Progress } from 'antd';
import { useWatch } from 'react-hook-form';
import { SURVEY_TITLE, SURVEY_SUBTITLE, QUESTIONS } from '@/constants/survey';

const { Title, Text } = Typography;

interface SurveyHeaderProps {
  control: any;
}

const SurveyHeader: React.FC<SurveyHeaderProps> = ({ control }) => {
  // Watch all values to calculate progress
  const allValues = useWatch({ control });

  const progress = useMemo(() => {
    const totalQuestions = QUESTIONS.length + 1; // +1 for Section 4
    let answered = 0;
    
    if (!allValues) return 0;

    QUESTIONS.forEach(q => {
      const val = allValues[q.id];
      if (Array.isArray(val) ? val.length > 0 : (val && val !== '')) {
        answered++;
      }
    });
    
    if (allValues.q21 && Array.isArray(allValues.q21) && allValues.q21.some((cp: any) => cp.name || cp.phoneEmail)) {
      answered++;
    }

    return Math.round((answered / totalQuestions) * 100);
  }, [allValues]);

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
