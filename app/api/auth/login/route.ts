import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/utils/supabase';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    console.log('[LOGIN] Attempt for:', username);

    // Tìm kiếm user trong bảng 'users' của Supabase
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .ilike('username', username);

    if (error) {
      console.error('[LOGIN] Supabase Query Error:', error);
      return NextResponse.json({ success: false, message: 'Lỗi kết nối cơ sở dữ liệu' }, { status: 500 });
    }

    if (!users || users.length === 0) {
      console.warn('[LOGIN] User not found:', username);
      // Chống Brute Force
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu' }, { status: 401 });
    }

    const user = users[0];
    console.log('[LOGIN] User found, comparing password...');
    
    // Kiểm tra mật khẩu đã mã hóa Bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      console.log('[LOGIN] Password valid, creating session...');
      // Ghi nhật ký đăng nhập thành công
      await supabase.from('audit_logs').insert([
        { action: 'LOGIN_SUCCESS', username, details: 'Đăng nhập vào hệ thống (Cloud)' }
      ]);

      const response = NextResponse.json({ success: true });
      
      const secret = process.env.AUTH_SECRET || 'default_secret_key_123';
      const sessionToken = crypto
        .createHmac('sha256', secret)
        .update(username + Date.now())
        .digest('hex');

      (await cookies()).set('admin_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60, // 1 giờ
        path: '/',
      });

      return response;
    } else {
      console.warn('[LOGIN] Password invalid for:', username);
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
    console.error('[LOGIN] System Error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi hệ thống' },
      { status: 500 }
    );
  }
}
