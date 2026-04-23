'use client';

import React, { useState, useEffect } from 'react';
import { Form, message, Input } from 'antd';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import SurveyHeader from '@/components/survey/SurveyHeader';
import SectionCard from '@/components/survey/SectionCard';
import QuestionField from '@/components/survey/QuestionField';
import ContactTableSection from '@/components/survey/ContactTableSection';
import SubmitBar from '@/components/survey/SubmitBar';
import ReviewDrawer from '@/components/survey/ReviewDrawer';

import { QUESTIONS, SECTIONS, DEFAULT_CONTACT_POINTS } from '@/constants/survey';
import { surveySchema, SurveySchemaType } from '@/schemas/survey.schema';
import { useSurveyAutosave } from '@/hooks/useSurveyAutosave';
import { loadDraft, clearDraft, saveDraft } from '@/utils/storage';

export default function SurveyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SurveySchemaType>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      q6: [],
      q13: [],
      q14: [],
      q15: [],
      q19: [],
      q20: [],
      q21: DEFAULT_CONTACT_POINTS.map((field) => ({
        key: field,
        field,
        name: '',
        position: '',
        phoneEmail: '',
      })),
      q23: [],
    },
  });

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      reset(draft);
      message.success('Đã khôi phục bản nháp gần nhất');
    }
  }, [reset]);

  // Autosave
  useSurveyAutosave(watch);

  // Progress Calculation
  const formValues = watch();
  useEffect(() => {
    const totalQuestions = QUESTIONS.length + 1; // +1 for Section 4
    let answered = 0;
    
    QUESTIONS.forEach(q => {
      const val = formValues[q.id as keyof SurveySchemaType];
      if (Array.isArray(val) ? val.length > 0 : (val && val !== '')) {
        answered++;
      }
    });
    
    if (formValues.q21 && formValues.q21.some(cp => cp.name || cp.phoneEmail)) {
      answered++;
    }

    setProgress(Math.round((answered / totalQuestions) * 100));
  }, [formValues]);

  const onSubmit = async (data: SurveySchemaType) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        message.success('Gửi phiếu khảo sát thành công!');
        clearDraft();
        router.push('/thank-you');
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
    <main className="survey-container">
      <SurveyHeader progress={progress} />

      <Form layout="vertical">
        <AnimatePresence>
          {SECTIONS.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <SectionCard 
                id={section.id} 
                title={section.title}
                description={section.description}
              >
                {section.id === 'section4' ? (
                  <ContactTableSection control={control} />
                ) : (
                  section.questions.map((qId) => {
                    const q = QUESTIONS.find((item) => item.id === qId);
                    if (!q) return null;
                    
                    return (
                      <React.Fragment key={qId}>
                        <QuestionField 
                          question={q} 
                          control={control} 
                          error={errors[qId as keyof SurveySchemaType]?.message as string} 
                        />
                        
                        {/* Conditional Fields */}
                        {qId === 'q14' && watch('q14')?.includes('Chỉ liên hệ trực tiếp khi cần') && (
                          <Form.Item label="Mô tả trường hợp liên hệ trực tiếp">
                            <Input.TextArea {...control.register('q14_detail')} placeholder="Nhập mô tả..." />
                          </Form.Item>
                        )}
                        
                        {qId === 'q15' && watch('q15')?.includes('Chủ đề khác') && (
                          <Form.Item label="Nhập chủ đề quan tâm khác">
                            <Input.TextArea {...control.register('q15_other')} placeholder="Nhập chủ đề..." />
                          </Form.Item>
                        )}

                        {qId === 'q23' && watch('q23')?.includes('Chủ đề khác') && (
                          <Form.Item label="Nhập nhu cầu hỗ trợ khác">
                            <Input.TextArea {...control.register('q23_other')} placeholder="Nhập nhu cầu..." />
                          </Form.Item>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </SectionCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </Form>

      <SubmitBar 
        onSave={() => {
          saveDraft(watch());
          message.success('Đã lưu bản nháp');
        }}
        onReset={() => {
          reset();
          clearDraft();
          message.info('Đã xóa toàn bộ dữ liệu');
        }}
        onReview={() => setReviewVisible(true)}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
      />

      <ReviewDrawer 
        visible={reviewVisible} 
        onClose={() => setReviewVisible(false)} 
        data={watch() as any}
      />
    </main>
  );
}
