import { z } from 'zod';

export const contactPointSchema = z.object({
  key: z.string(),
  field: z.string().min(1, 'Lĩnh vực không được để trống'),
  name: z.string().optional(),
  position: z.string().optional(),
  phoneEmail: z.string().optional(),
});

export const surveySchema = z.object({
  // Section 1
  q1: z.string().min(1, 'Tên doanh nghiệp không được để trống'),
  q2: z.string().optional(),
  q3: z.string().optional(),
  q4: z.string().optional(),
  q5: z.string().optional(),
  q6: z.array(z.string()).optional(),
  q7: z.string().optional(),
  q8: z.string().optional(),
  q9_capital: z.string().optional(),
  q9_revenue: z.string().optional(),
  q9_labor: z.string().optional(),
  q10: z.string().optional(),

  // Section 2
  q11: z.string().min(1, 'Họ tên hội viên chính thức không được để trống'),
  q12: z.string().optional(),
  q13: z.array(z.string()).optional(),
  q14: z.array(z.string()).optional(),
  q14_detail: z.string().optional(),
  q15: z.array(z.string()).optional(),
  q15_other: z.string().optional(),

  // Section 3
  q16: z.string().optional(),
  q17: z.string().optional(),
  q18_phone: z.string().optional(),
  q18_email: z.string().optional().refine((val) => !val || z.string().email().safeParse(val).success, {
    message: 'Email không đúng định dạng',
  }),
  q18_other: z.string().optional(),
  q19: z.array(z.string()).optional(),
  q20: z.array(z.string()).optional(),

  // Section 4
  q21: z.array(contactPointSchema),

  // Section 5
  q22: z.string().optional(),
  q23: z.array(z.string()).optional(),
  q23_other: z.string().optional(),
  q24: z.string().optional(),
}).superRefine((data, ctx) => {
  // Conditional validation for Q14
  if (data.q14?.includes('Chỉ liên hệ trực tiếp khi cần') && (!data.q14_detail || data.q14_detail.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Vui lòng mô tả trường hợp liên hệ trực tiếp',
      path: ['q14_detail'],
    });
  }

  // Conditional validation for Q15
  if (data.q15?.includes('Chủ đề khác') && (!data.q15_other || data.q15_other.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Vui lòng nhập chủ đề khác',
      path: ['q15_other'],
    });
  }

  // Conditional validation for Q23
  if (data.q23?.includes('Chủ đề khác') && (!data.q23_other || data.q23_other.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Vui lòng nhập chủ đề khác',
      path: ['q23_other'],
    });
  }
});

export type SurveySchemaType = z.infer<typeof surveySchema>;
