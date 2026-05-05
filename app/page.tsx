'use client';

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, message, FloatButton, ConfigProvider, Spin } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { FileSearchOutlined, SendOutlined, SaveOutlined, LoadingOutlined, EyeOutlined } from '@ant-design/icons';

import { SURVEY_TITLE, SURVEY_SUBTITLE } from '@/constants/survey';
import { surveySchema, SurveySchemaType } from '@/schemas/survey.schema';
import { useSurveyAutosave } from '@/hooks/useSurveyAutosave';
import { saveDraft, clearDraft } from '@/utils/storage';

import SectionCard from '@/components/survey/SectionCard';
import QuestionField from '@/components/survey/QuestionField';
import SurveyHeader from '@/components/survey/SurveyHeader';
import SubmitBar from '@/components/survey/SubmitBar';
import ReviewDrawer from '@/components/survey/ReviewDrawer';
import ContactTableSection from '@/components/survey/ContactTableSection';

export default function SurveyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dynamicSections, setDynamicSections] = useState<any[]>([]);
  const [dynamicQuestions, setDynamicQuestions] = useState<any[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty }
  } = useForm<SurveySchemaType>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      q6: [], q13: [], q14: [], q15: [], q19: [], q20: [], q23: [],
    }
  });

  // Fetch Dynamic Content
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('preview') === 'true') {
      setPreviewMode(true);
    }

    const fetchData = async () => {
      try {
        const [secRes, queRes] = await Promise.all([
          fetch('/api/admin/sections'),
          fetch('/api/admin/questions')
        ]);
        const secData = await secRes.json();
        const queData = await queRes.json();
        setDynamicSections(secData);
        setDynamicQuestions(queData);
      } catch (error) {
        message.error('Không thể tải cấu trúc khảo sát');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useSurveyAutosave(watch as any);

  const handleSaveManual = () => {
    const data = watch();
    saveDraft(data);
    message.success('Đã lưu bản nháp thành công');
  };

  const onSubmit: SubmitHandler<SurveySchemaType> = async (data) => {
    if (previewMode) {
      message.warning('Bạn đang ở chế độ xem trước, không thể gửi phiếu!');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        message.success('Cảm ơn bạn đã hoàn thành khảo sát!');
        clearDraft();
        window.location.href = '/thank-you';
      } else {
        throw new Error('Gửi thất bại');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fcf6f6' }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#d32f2f' }} spin />} description="Đang tải khảo sát..." />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#d32f2f',
          borderRadius: 12,
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      }}
    >
      <main className="survey-wrapper">
        {previewMode && (
          <motion.div 
            initial={{ y: -50 }} 
            animate={{ y: 0 }} 
            className="preview-banner"
          >
            <div className="preview-content">
              <EyeOutlined /> <strong>CHẾ ĐỘ XEM TRƯỚC:</strong> Bạn có thể xem giao diện nhưng không thể gửi phiếu thực tế.
            </div>
          </motion.div>
        )}
        <div className="decor-circle circle-1"></div>
        <div className="decor-circle circle-2"></div>
        
        <div className="survey-container">
          <SurveyHeader control={control} dynamicQuestions={dynamicQuestions} />

          <Form layout="vertical" className="main-form">
            <AnimatePresence>
              {dynamicSections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  className="section-wrapper"
                >
                  <SectionCard 
                    id={section.id} 
                    title={section.title}
                    description={section.description}
                  >
                    <div className="questions-grid">
                      {dynamicQuestions
                        .filter(q => q.section_id === section.id)
                        .map((q) => (
                          <div key={q.id} className={`question-container ${q.type === 'textarea' || q.type === 'contact_list' ? 'full-width' : ''}`}>
                            <QuestionField 
                              question={q} 
                              control={control} 
                              error={errors[q.id as keyof SurveySchemaType]?.message as string} 
                            />
                          </div>
                        ))
                      }
                    </div>
                  </SectionCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </Form>

          <SubmitBar 
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            isDirty={isDirty}
            previewMode={previewMode}
          />

          <FloatButton.Group trigger="hover" type="primary" icon={<FileSearchOutlined />} style={{ right: 24, bottom: 100 }}>
            <FloatButton icon={<SaveOutlined />} onClick={handleSaveManual} tooltip="Lưu nháp ngay" />
            <FloatButton icon={<SendOutlined />} onClick={handleSubmit(onSubmit)} tooltip="Gửi phiếu ngay" />
          </FloatButton.Group>
        </div>

        <style jsx global>{`
          .survey-wrapper { background-color: #fcf6f6; min-height: 100vh; position: relative; overflow-x: hidden; padding-bottom: 120px; }
          .decor-circle { position: absolute; border-radius: 50%; filter: blur(100px); z-index: 0; opacity: 0.4; }
          .circle-1 { width: 600px; height: 600px; background: #ff4d4f; top: -200px; left: -200px; }
          .circle-2 { width: 500px; height: 500px; background: #1890ff; bottom: 100px; right: -200px; }
          .survey-container { max-width: 1000px; margin: 0 auto; padding: 0 20px; position: relative; z-index: 1; padding-top: ${previewMode ? '80px' : '0'}; }
          .main-form { margin-top: -40px; }
          .section-wrapper { margin-bottom: 40px; }
          .questions-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
          .question-container.full-width { grid-column: span 2; }
          
          .preview-banner {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 50px;
            background: linear-gradient(90deg, #ef4444, #b91c1c);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
            font-family: 'Inter', sans-serif;
          }

          .preview-content {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 15px;
            font-weight: 600;
          }

          @media (max-width: 768px) { .questions-grid { grid-template-columns: 1fr; } .question-container.full-width { grid-column: span 1; } }
        `}</style>
      </main>
    </ConfigProvider>
  );
}
