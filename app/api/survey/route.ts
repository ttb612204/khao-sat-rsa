import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('--- NEW SURVEY SUBMISSION ---');
    console.log('Business:', body.q1);
    console.log('Time:', new Date().toLocaleString());

    // ĐƯỜNG DẪN TỚI FILE LƯU TRỮ DỮ LIỆU
    // Lưu ý: Trên môi trường Production như Vercel, cách này sẽ không hoạt động 
    // vì hệ thống tệp tin là Read-only. Cần dùng Database thật như Supabase/MongoDB.
    const filePath = path.join(process.cwd(), 'responses.json');

    let existingData = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      existingData = JSON.parse(fileContent || '[]');
    }

    // Thêm bản ghi mới cùng thời gian nộp
    const newEntry = {
      ...body,
      submittedAt: new Date().toISOString(),
    };

    existingData.push(newEntry);

    // Ghi lại vào file
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf8');

    return NextResponse.json({ 
      success: true, 
      message: 'Dữ liệu đã được lưu thành công vào server.' 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error saving survey:', error);
    return NextResponse.json(
      { message: 'Lỗi khi lưu dữ liệu: ' + error.message },
      { status: 500 }
    );
  }
}
