export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('--- NEW SUPABASE SUBMISSION ---');
    console.log('Business:', body.q1);

    // Chèn dữ liệu vào bảng 'responses' trong Supabase
    const { error } = await supabase
      .from('responses')
      .insert([
        { 
          data: body 
        }
      ]);

    if (error) {
      console.error('Supabase Insert Error:', error);
      return NextResponse.json({ message: 'Lỗi Supabase: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Dữ liệu đã được lưu thành công lên Supabase.' 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error saving to Supabase:', error);
    return NextResponse.json(
      { message: 'Lỗi hệ thống: ' + error.message },
      { status: 500 }
    );
  }
}
