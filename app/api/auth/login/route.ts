import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/utils/mysql';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Tìm kiếm user trong cơ sở dữ liệu MySQL
    const [rows]: [any[], any] = await pool.execute(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length > 0) {
      // Đăng nhập thành công
      const response = NextResponse.json({ success: true });
      
      // Thiết lập cookie phiên làm việc
      (await cookies()).set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 giờ
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi hệ thống: ' + error.message },
      { status: 500 }
    );
  }
}
