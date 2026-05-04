import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const username = 'AdminVabso';
    const password = 'Saodo@123';
    
    // Tạo hash trực tiếp bằng thư viện đang chạy trên server
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cập nhật vào Supabase
    const { error } = await supabase
      .from('users')
      .upsert({ 
        username: username, 
        password: hashedPassword 
      }, { onConflict: 'username' });

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: 'Admin account updated successfully with correct hash' 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}
