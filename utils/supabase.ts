import { createClient } from '@supabase/supabase-js';

// Ưu tiên lấy biến môi trường từ Vercel (Server-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Supabase environment variables are missing!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
