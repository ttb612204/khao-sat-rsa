import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/utils/mysql';

export async function POST() {
  // Ghi nhật ký đăng xuất
  try {
    await pool.execute(
      'INSERT INTO audit_logs (action, username, details) VALUES (?, ?, ?)',
      ['LOGOUT', 'admin', 'Người dùng đăng xuất khỏi hệ thống']
    );
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
