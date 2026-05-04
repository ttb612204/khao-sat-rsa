import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// LẤY DANH SÁCH TOÀN BỘ CÂU TRẢ LỜI TỪ SUPABASE
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('responses')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    // Map lại cấu hình để admin page dễ đọc (giải nén cột data)
    const formattedData = data.map(item => ({
      ...(item.data || {}),
      id: item.id,
      submittedAt: item.submitted_at || item.created_at
    }));
    
    return NextResponse.json(formattedData, { status: 200 });
  } catch (error: any) {
    console.error('API Responses GET Error:', error);
    return NextResponse.json({ message: 'Lỗi khi lấy dữ liệu: ' + error.message }, { status: 500 });
  }
}

// XÓA MỘT BẢN GHI KHỎI SUPABASE
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Thiếu ID bản ghi' }, { status: 400 });
    }

    const { error } = await supabase
      .from('responses')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Ghi nhật ký xóa dữ liệu vào Supabase
    await supabase.from('audit_logs').insert([
      { action: 'DELETE_RECORD', username: 'admin', details: `Xóa bản ghi ID: ${id}` }
    ]);
    
    return NextResponse.json({ message: 'Xóa thành công' }, { status: 200 });
  } catch (error: any) {
    console.error('API Responses DELETE Error:', error);
    return NextResponse.json({ message: 'Lỗi khi xóa dữ liệu: ' + error.message }, { status: 500 });
  }
}
