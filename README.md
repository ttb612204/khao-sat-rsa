# Website Khảo sát RSA / CLB Sao Đỏ

Website biểu mẫu khảo sát doanh nghiệp chuyên nghiệp được xây dựng bằng Next.js 14, Ant Design và React Hook Form.

## Tính năng chính

- **Form 5 phần chuyên sâu**: Bao phủ toàn bộ thông tin doanh nghiệp, đại diện, đầu mối và nhu cầu kết nối.
- **Bảng động (Phần 4)**: Cho phép thêm/xóa đầu mối chuyên môn, tự động chuyển sang giao diện Card trên Mobile.
- **Autosave**: Tự động lưu bản nháp vào LocalStorage để không mất dữ liệu khi tải lại trang.
- **Import/Export JSON**: Cho phép người dùng tải về bản ghi hoặc nhập lại file JSON để tiếp tục điền.
- **Xem lại trước khi gửi**: Drawer tóm tắt toàn bộ thông tin đã nhập giúp người dùng kiểm tra kỹ trước khi nộp.
- **Tối ưu in ấn**: CSS riêng biệt giúp bản in đẹp mắt và chuyên nghiệp.
- **Validation chặt chẽ**: Sử dụng Zod để kiểm tra tính hợp lệ của dữ liệu, bao gồm cả các logic điều kiện.

## Công nghệ sử dụng

- **Framework**: Next.js 14 (App Router)
- **UI Library**: Ant Design (antd)
- **Form Management**: React Hook Form
- **Validation**: Zod
- **Date/Time**: Dayjs
- **Icons**: @ant-design/icons

## Hướng dẫn cài đặt

1. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

2. **Chạy môi trường phát triển**:
   ```bash
   npm run dev
   ```
   Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

3. **Build production**:
   ```bash
   npm run build
   npm start
   ```

## Cấu trúc thư mục

- `/app`: Chứa các trang và API routes.
- `/components`: Các thành phần giao diện tái sử dụng.
- `/constants`: Nội dung câu hỏi và cấu hình khảo sát.
- `/schemas`: Logic validation dữ liệu.
- `/types`: Định nghĩa kiểu dữ liệu TypeScript.
- `/utils`: Các hàm tiện ích (Storage, Import/Export).
- `/hooks`: Custom hooks (Autosave).
- `/styles`: CSS toàn cục và CSS in ấn.

## Tùy biến

- **Thay đổi câu hỏi**: Chỉnh sửa tại `constants/survey.ts`.
- **Thay đổi logic validation**: Chỉnh sửa tại `schemas/survey.schema.ts`.
- **Thay đổi giao diện**: Chỉnh sửa `app/globals.css` hoặc các component trong `components/survey/`.
