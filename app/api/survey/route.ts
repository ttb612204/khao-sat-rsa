import { NextResponse } from 'next/server';
import pool from '@/utils/mysql';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('--- NEW MYSQL SUBMISSION ---');
    console.log('Business:', body.q1);

    // Chèn dữ liệu vào bảng 'responses' trong MySQL
    console.log('Attempting to insert into MySQL...');
    
    // Lưu toàn bộ JSON vào cột 'data'
    const [result] = await pool.execute(
      'INSERT INTO responses (data) VALUES (?)',
      [JSON.stringify(body)]
    );

    console.log('MySQL Insert Success:', result);

    return NextResponse.json({ 
      success: true, 
      message: 'Dữ liệu đã được lưu thành công vào MySQL (XAMPP).' 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error saving to MySQL:', error);
    return NextResponse.json(
      { message: 'Lỗi khi lưu dữ liệu vào MySQL: ' + error.message },
      { status: 500 }
    );
  }
}
