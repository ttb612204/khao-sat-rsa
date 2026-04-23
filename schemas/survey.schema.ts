import { z } from 'zod';

export const contactPointSchema = z.object({
  field: z.string(),
  name: z.string().optional(),
  position: z.string().optional(),
  phoneEmail: z.string().optional(),
});

export const surveySchema = z.object({
  // Section 1
  q1: z.string().min(1, 'Vui lòng nhập tên doanh nghiệp'),
  q2: z.string().min(1, 'Vui lòng nhập tên thương hiệu'),
  q3: z.string().min(1, 'Vui lòng nhập mã số thuế'),
  q4: z.string().min(1, 'Vui lòng nhập năm thành lập'),
  q5: z.string().min(1, 'Vui lòng nhập trụ sở chính'),
  q6: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất một khu vực'),
  q7: z.string().min(1, 'Vui lòng nhập ngành nghề kinh doanh'),
  q8: z.string().min(1, 'Vui lòng nhập sản phẩm chủ lực'),
  q9_capital: z.string().min(1, 'Vui lòng nhập vốn điều lệ'),
  q9_revenue: z.string().min(1, 'Vui lòng nhập doanh thu'),
  q9_labor: z.string().min(1, 'Vui lòng nhập số lao động'),
  q10: z.string().optional(),

  // Section 2
  q11: z.string().min(1, 'Vui lòng nhập họ tên hội viên'),
  q12: z.string().min(1, 'Vui lòng nhập chức danh'),
  q13: z.array(z.string()).min(1, 'Vui lòng chọn mức độ tham gia'),
  q14: z.array(z.string()).min(1, 'Vui lòng chọn hình thức liên hệ'),
  q14_detail: z.string().optional(),
  q15: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất một lĩnh vực'),
  q15_other: z.string().optional(),

  // Section 3
  q16: z.string().min(1, 'Vui lòng nhập họ tên đầu mối'),
  q17: z.string().min(1, 'Vui lòng nhập chức danh đầu mối'),
  q18_phone: z.string().min(1, 'Vui lòng nhập số điện thoại'),
  q18_email: z.string().min(1, 'Vui lòng nhập email'),
  q18_other: z.string().min(1, 'Vui lòng nhập Zalo/phương thức khác'),
  q19: z.array(z.string()).min(1, 'Vui lòng chọn vai trò đầu mối'),
  q20: z.array(z.string()).min(1, 'Vui lòng chọn mức độ ủy quyền'),

  // Section 4
  q21: z.array(contactPointSchema),

  // Section 5
  q22: z.string().min(1, 'Vui lòng nhập thế mạnh doanh nghiệp'),
  q23: z.array(z.string()).min(1, 'Vui lòng chọn nhu cầu hỗ trợ'),
  q23_other: z.string().optional(),
  q24: z.string().min(1, 'Vui lòng nhập danh mục sản phẩm'),
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
