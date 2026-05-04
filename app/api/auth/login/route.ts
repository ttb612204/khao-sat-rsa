import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '@/utils/mysql';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Tìm kiếm user trong cơ sở dữ liệu MySQL
    const [rows]: [any[], any] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (rows.length > 0) {
      const user = rows[0];
      
      // Kiểm tra mật khẩu đã mã hóa
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // Đăng nhập thành công
        const response = NextResponse.json({ success: true });
        
        // Tạo một Token phiên làm việc bảo mật (HMAC)
        const secret = process.env.AUTH_SECRET || 'default_secret_key_123';
        const sessionToken = crypto
          .createHmac('sha256', secret)
          .update(username + Date.now())
          .digest('hex');

        // Thiết lập cookie phiên làm việc
        (await cookies()).set('admin_session', sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24, // 24 giờ
          path: '/',
        });

        return response;
      }
    }

    // Thêm khoảng trễ để chống Brute Force
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(
      { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi hệ thống' },
      { status: 500 }
    );
  }
}
