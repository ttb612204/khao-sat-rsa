import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'responses.json');

// LẤY DANH SÁCH TOÀN BỘ CÂU TRẢ LỜI
export async function GET() {
  try {
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([], { status: 200 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent || '[]');
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi khi lấy dữ liệu' }, { status: 500 });
  }
}

// XÓA MỘT BẢN GHI (Dựa trên submittedAt hoặc một ID duy nhất)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // Ở đây ta dùng submittedAt làm ID tạm thời

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ message: 'Không tìm thấy dữ liệu' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    let data = JSON.parse(fileContent || '[]');
    
    data = data.filter((item: any) => item.submittedAt !== id);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    
    return NextResponse.json({ message: 'Xóa thành công' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Lỗi khi xóa dữ liệu' }, { status: 500 });
  }
}
