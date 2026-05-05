'use client';

import React, { useMemo } from 'react';
import { Typography, Progress } from 'antd';
import { useWatch } from 'react-hook-form';
import { SURVEY_TITLE, SURVEY_SUBTITLE } from '@/constants/survey';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

interface SurveyHeaderProps {
  control: any;
  dynamicQuestions: any[];
}

const SurveyHeader: React.FC<SurveyHeaderProps> = ({ control, dynamicQuestions }) => {
  const allValues = useWatch({ control });

  const progress = useMemo(() => {
    const questionsToCount = dynamicQuestions || [];
    const totalQuestions = questionsToCount.length;
    if (totalQuestions === 0) return 0;
    
    let answered = 0;
    if (!allValues) return 0;

    questionsToCount.forEach(q => {
      const val = allValues[q.id];
      if (Array.isArray(val) ? val.length > 0 : (val && val !== '')) {
        answered++;
      }
    });

    return Math.round((answered / totalQuestions) * 100);
  }, [allValues, dynamicQuestions]);

  return (
    <header className="header-wrapper">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="header-content"
      >
        <div className="vabso-logo">VABSO</div>
        <Title level={1} className="main-title">
          {SURVEY_TITLE}
        </Title>
        <Text className="sub-title">
          {SURVEY_SUBTITLE}
        </Text>

        <div className="progress-section">
          <div className="progress-info">
            <span className="progress-label">Tiến độ hoàn thành</span>
            <span className="progress-value">{progress}%</span>
          </div>
          <Progress 
            percent={progress} 
            status="active" 
            strokeColor={{ '0%': '#ff4d4f', '100%': '#d32f2f' }}
            strokeWidth={10}
            showInfo={false}
            className="custom-progress"
          />
        </div>
      </motion.div>

      <style jsx>{`
        .header-wrapper { padding: 80px 20px 60px; text-align: center; position: relative; }
        .header-content { max-width: 800px; margin: 0 auto; }
        .vabso-logo { font-size: 24px; font-weight: 900; color: #d32f2f; letter-spacing: 4px; margin-bottom: 24px; display: inline-block; border-bottom: 3px solid #d32f2f; padding-bottom: 4px; }
        .main-title { font-size: 42px !important; font-weight: 900 !important; color: #1a1a1a !important; line-height: 1.2 !important; margin-bottom: 16px !important; text-transform: uppercase; letter-spacing: -1px; }
        .sub-title { font-size: 18px; color: #666; display: block; margin-bottom: 40px; font-weight: 400; }
        .progress-section { max-width: 450px; margin: 0 auto; background: rgba(255, 255, 255, 0.7); padding: 20px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); backdrop-filter: blur(5px); }
        .progress-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .progress-label { font-size: 14px; color: #888; font-weight: 600; }
        .progress-value { font-size: 18px; font-weight: 800; color: #d32f2f; }
        @media (max-width: 768px) { .main-title { font-size: 28px !important; } .header-wrapper { padding-top: 40px; } }
      `}</style>
    </header>
  );
};

export default SurveyHeader;
