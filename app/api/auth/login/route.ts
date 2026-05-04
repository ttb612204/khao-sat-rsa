import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const envUser = process.env.ADMIN_USERNAME || 'admin';
    const envPass = process.env.ADMIN_PASSWORD || 'rsa123456';

    if (username === envUser && password === envPass) {
      // Login success
      const response = NextResponse.json({ success: true });
      
      // Set a simple auth cookie
      // In a real app, you'd use a JWT or session ID
      (await cookies()).set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Lỗi hệ thống' },
      { status: 500 }
    );
  }
}
