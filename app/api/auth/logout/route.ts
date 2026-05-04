export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/utils/supabase';

export async function POST() {
  // Ghi nhật ký đăng xuất
  try {
    await supabase.from('audit_logs').insert([
      { action: 'LOGOUT', username: 'admin', details: 'Người dùng đăng xuất khỏi hệ thống' }
    ]);
  } catch (e) {
    console.error('Audit Log Error:', e);
  }

  const response = NextResponse.json({ success: true });
  
  (await cookies()).set('admin_session', '', {
    maxAge: 0,
    path: '/',
  });

  return response;
}
