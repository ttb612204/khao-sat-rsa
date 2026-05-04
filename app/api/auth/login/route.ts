export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/utils/supabase';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Tìm kiếm user trong bảng 'users' của Supabase
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username);

    if (error) {
      console.error('Supabase Auth Error:', error);
      throw error;
    }

    if (users && users.length > 0) {
      const user = users[0];
      
      // Kiểm tra mật khẩu đã mã hóa Bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // Ghi nhật ký đăng nhập thành công
        await supabase.from('audit_logs').insert([
          { action: 'LOGIN_SUCCESS', username, details: 'Đăng nhập vào hệ thống (Cloud)' }
        ]);

        const response = NextResponse.json({ success: true });
        
        // Tạo Token phiên làm việc bảo mật
        const secret = process.env.AUTH_SECRET || 'default_secret_key_123';
        const sessionToken = crypto
          .createHmac('sha256', secret)
          .update(username + Date.now())
          .digest('hex');

        // Thiết lập cookie phiên làm việc - GIỚI HẠN 1 TIẾNG
        (await cookies()).set('admin_session', sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60, // 1 giờ
          path: '/',
        });

        return response;
      }
    }

    // Ghi nhật ký đăng nhập thất bại
    await supabase.from('audit_logs').insert([
      { action: 'LOGIN_FAILED', username: username || 'unknown', details: 'Thử đăng nhập sai mật khẩu' }
    ]);

    // Chống Brute Force
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
