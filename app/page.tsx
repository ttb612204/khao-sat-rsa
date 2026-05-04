'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, message, FloatButton, ConfigProvider } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { FileSearchOutlined, SendOutlined, SaveOutlined } from '@ant-design/icons';

import { QUESTIONS, SECTIONS, SURVEY_TITLE, SURVEY_SUBTITLE } from '@/constants/survey';
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
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      q6: [],
      q13: [],
      q14: [],
      q15: [],
      q19: [],
      q20: [],
      q23: [],
      q21: [
        { field: 'Kinh doanh / Phát triển thị trường', name: '', position: '', phone: '', email: '' },
        { field: 'Mua hàng / Chuỗi cung ứng', name: '', position: '', phone: '', email: '' },
        { field: 'Đầu tư / Hợp tác chiến lược / M&A', name: '', position: '', phone: '', email: '' },
        { field: 'Đổi mới sáng tạo / Công nghệ', name: '', position: '', phone: '', email: '' },
        { field: 'Nhân sự / Đào tạo', name: '', position: '', phone: '', email: '' },
        { field: 'Truyền thông / Thương hiệu', name: '', position: '', phone: '', email: '' },
      ],
    }
  });

  // Autosave & Load Draft - Fixed: pass 'watch' and remove 'lastSaved'
  useSurveyAutosave(watch as any);

  const handleSaveManual = () => {
    const data = watch();
    saveDraft(data);
    message.success('Đã lưu bản nháp thành công');
  };

  const onSubmit: SubmitHandler<SurveySchemaType> = async (data) => {
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
        <div className="decor-circle circle-1"></div>
        <div className="decor-circle circle-2"></div>
        
        <div className="survey-container">
          <SurveyHeader control={control} />

          <Form layout="vertical" className="main-form">
            <AnimatePresence>
              {SECTIONS.map((section, index) => (
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
                    {section.id === 'section4' ? (
                      <ContactTableSection control={control} />
                    ) : (
                      <div className="questions-grid">
                        {section.questions.map((qId) => {
                          const q = QUESTIONS.find((item) => item.id === qId);
                          if (!q) return null;
                          
                          return (
                            <React.Fragment key={qId}>
                              <div className={`question-container ${q.type === 'textarea' ? 'full-width' : ''}`}>
                                <QuestionField 
                                  question={q} 
                                  control={control} 
                                  error={errors[qId as keyof SurveySchemaType]?.message as string} 
                                />
                                
                                {qId === 'q14' && watch('q14')?.includes('Chỉ liên hệ trực tiếp khi cần') && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }} 
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="conditional-field"
                                  >
                                    <Form.Item label="Mô tả trường hợp liên hệ trực tiếp" className="mt-2">
                                      <textarea 
                                        {...control.register('q14_detail')} 
                                        placeholder="Nhập mô tả..."
                                        className="premium-textarea"
                                        rows={3}
                                      />
                                    </Form.Item>
                                  </motion.div>
                                )}
                                
                                {qId === 'q15' && watch('q15')?.includes('Chủ đề khác') && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }} 
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="conditional-field"
                                  >
                                    <Form.Item label="Nhập chủ đề khác" className="mt-2">
                                      <input 
                                        {...control.register('q15_other')} 
                                        placeholder="Nhập chủ đề..."
                                        className="premium-input"
                                      />
                                    </Form.Item>
                                  </motion.div>
                                )}

                                {qId === 'q23' && watch('q23')?.includes('Chủ đề khác') && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }} 
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="conditional-field"
                                  >
                                    <Form.Item label="Nhập chủ đề khác" className="mt-2">
                                      <input 
                                        {...control.register('q23_other')} 
                                        placeholder="Nhập chủ đề..."
                                        className="premium-input"
                                      />
                                    </Form.Item>
                                  </motion.div>
                                )}
                              </div>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    )}
                  </SectionCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </Form>

          <SubmitBar 
            onReview={() => setIsReviewOpen(true)}
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            isDirty={isDirty}
          />

          <ReviewDrawer 
            open={isReviewOpen}
            onClose={() => setIsReviewOpen(false)}
            data={watch() as any}
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
          />

          <FloatButton.Group trigger="hover" type="primary" icon={<FileSearchOutlined />} style={{ right: 24, bottom: 100 }}>
            <FloatButton icon={<SaveOutlined />} onClick={handleSaveManual} tooltip="Lưu nháp ngay" />
            <FloatButton icon={<SendOutlined />} onClick={handleSubmit(onSubmit)} tooltip="Gửi phiếu ngay" />
          </FloatButton.Group>
        </div>

        <style jsx global>{`
          .survey-wrapper {
            background-color: #fcf6f6;
            min-height: 100vh;
            position: relative;
            overflow-x: hidden;
            padding-bottom: 120px;
          }

          .decor-circle {
            position: absolute;
            border-radius: 50%;
            filter: blur(100px);
            z-index: 0;
            opacity: 0.4;
          }

          .circle-1 {
            width: 600px;
            height: 600px;
            background: #ff4d4f;
            top: -200px;
            left: -200px;
          }

          .circle-2 {
            width: 500px;
            height: 500px;
            background: #1890ff;
            bottom: 100px;
            right: -200px;
          }

          .survey-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 20px;
            position: relative;
            z-index: 1;
          }

          .main-form {
            margin-top: -40px;
          }

          .section-wrapper {
            margin-bottom: 40px;
          }

          .questions-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }

          .question-container.full-width {
            grid-column: span 2;
          }

          .premium-input, .premium-textarea {
            width: 100%;
            padding: 12px 16px;
            border-radius: 12px;
            border: 1px solid #d9d9d9;
            transition: all 0.3s;
            outline: none;
          }

          .premium-input:focus, .premium-textarea:focus {
            border-color: #d32f2f;
            box-shadow: 0 0 0 2px rgba(211,47,47,0.1);
          }

          .conditional-field {
            margin-top: 12px;
            padding: 16px;
            background: #fff1f0;
            border-radius: 16px;
            border-left: 4px solid #ff4d4f;
          }

          @media (max-width: 768px) {
            .questions-grid {
              grid-template-columns: 1fr;
            }
            .question-container.full-width {
              grid-column: span 1;
            }
            .survey-container {
              padding: 0 12px;
            }
          }
        `}</style>
      </main>
    </ConfigProvider>
  );
}
