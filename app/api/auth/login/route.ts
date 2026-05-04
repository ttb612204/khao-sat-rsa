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

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .ilike('username', username);

    if (error) {
      console.error('[LOGIN] Supabase Error:', error);
      return NextResponse.json({ success: false, message: 'Lỗi kết nối Database' }, { status: 500 });
    }

    if (!users || users.length === 0) {
      console.warn('[LOGIN] User NOT FOUND:', username);
      return NextResponse.json({ success: false, message: `Không tìm thấy tài khoản: ${username}` }, { status: 401 });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const response = NextResponse.json({ success: true });
      const secret = process.env.AUTH_SECRET || 'default_secret_key_123';
      const sessionToken = crypto
        .createHmac('sha256', secret)
        .update(username + Date.now())
        .digest('hex');

      (await cookies()).set('admin_session', sessionToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60,
        path: '/',
      });

      return response;
    } else {
      console.warn('[LOGIN] Password MISMATCH for:', username);
      return NextResponse.json({ success: false, message: 'Mật khẩu không chính xác' }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Lỗi hệ thống' }, { status: 500 });
  }
}
