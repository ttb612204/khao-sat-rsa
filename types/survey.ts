export interface Question {
  id: string;
  number: number | string;
  label: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'info' | 'contact_list';
  options?: string[];
  placeholder?: string;
  helperText?: string;
  required?: boolean;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  questions: string[]; // IDs of questions in this section
}

export interface ContactPoint {
  field: string;
  name: string;
  position: string;
  phone: string;
  email: string;
}

export interface SurveyData {
  // Section 1
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string[];
  q7: string;
  q8: string;
  q9_capital: string;
  q9_revenue: string;
  q9_labor: string;
  q10: string;

  // Section 2
  q11: string;
  q12: string;
  q13: string[];
  q14: string[];
  q14_detail?: string;
  q15: string[];
  q15_other?: string;
  q15_sustainability: string;
  q15_csr: string;

  // Section 3
  q16: string;
  q17: string;
  q18_phone: string;
  q18_email: string;
  q18_other: string;
  q19: string[];
  q20: string[];

  // Section 4
  q21: ContactPoint[];

  // Section 5
  q22: string;
  q23: string[];
  q23_other?: string;
  q24: string;
}
