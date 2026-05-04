import { NextResponse } from 'next/server';
import pool from '@/utils/mysql';

// LẤY DANH SÁCH TOÀN BỘ CÂU TRẢ LỜI TỪ MYSQL
export async function GET() {
  try {
    console.log('Fetching responses from MySQL...');
    
    const [rows]: [any[], any] = await pool.execute(
      'SELECT id, data, created_at FROM responses ORDER BY created_at DESC'
    );

    console.log('MySQL returned:', rows.length, 'items');

    const formattedData = rows.map(item => {
      let parsedData = {};
      try {
        parsedData = typeof item.data === 'string' ? JSON.parse(item.data) : item.data;
      } catch (e) {
        console.error('Error parsing JSON for item', item.id);
      }

      return {
        ...parsedData,
        id: item.id,
        submittedAt: item.created_at
      };
    });
    
    return NextResponse.json(formattedData, { status: 200 });
  } catch (error: any) {
    console.error('API Responses GET Error:', error);
    return NextResponse.json({ message: 'Lỗi khi lấy dữ liệu từ MySQL: ' + error.message }, { status: 500 });
  }
}

// XÓA MỘT BẢN GHI KHỎI MYSQL
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Thiếu ID bản ghi' }, { status: 400 });
    }

    await pool.execute('DELETE FROM responses WHERE id = ?', [id]);
    
    return NextResponse.json({ message: 'Xóa thành công khỏi MySQL' }, { status: 200 });
  } catch (error: any) {
    console.error('API Responses DELETE Error:', error);
    return NextResponse.json({ message: 'Lỗi khi xóa dữ liệu từ MySQL: ' + error.message }, { status: 500 });
  }
}
