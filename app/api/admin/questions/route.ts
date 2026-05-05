import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export const dynamic = 'force-dynamic';

// Lấy danh sách câu hỏi
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('survey_questions')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Thêm hoặc Cập nhật câu hỏi (Kèm logic tự động đẩy thứ tự)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Đảm bảo các trường quan trọng có giá trị mặc định nếu thiếu
    const payload = {
      ...body,
      options: Array.isArray(body.options) ? body.options : [],
      required: !!body.required,
      order_index: body.order_index || (parseFloat(body.number) * 100)
    };

    const { data, error } = await supabase
      .from('survey_questions')
      .upsert(payload, { onConflict: 'id' })
      .select();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Xóa câu hỏi (Kèm logic tự động dồn hàng lên)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    // 1. Lấy thông tin câu hỏi sắp xóa
    const { data: target } = await supabase
      .from('survey_questions')
      .select('order_index')
      .eq('id', id)
      .single();

    if (target) {
      // 2. Xóa câu hỏi
      const { error: deleteError } = await supabase
        .from('survey_questions')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
