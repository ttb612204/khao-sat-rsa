# TỔNG QUAN DỰ ÁN & CHÍNH SÁCH BẢO MẬT
## Hệ thống Khảo sát Hội viên RSA / CLB Sao Đỏ

Tài liệu này cung cấp thông tin tổng quan về kiến trúc hệ thống, tính năng và các biện pháp bảo mật được áp dụng để đảm bảo an toàn dữ liệu cho doanh nghiệp hội viên.

---

## 1. Giới thiệu tổng quan
Hệ thống được xây dựng nhằm hiện đại hóa quy trình thu thập và quản lý thông tin hội viên của mạng lưới RSA / CLB Sao Đỏ. Thay vì sử dụng các công cụ phổ thông, hệ thống này được thiết kế riêng biệt để mang lại trải nghiệm chuyên nghiệp, tinh tế và an toàn tuyệt đối.

### Công nghệ sử dụng:
*   **Frontend**: Next.js 16 (phiên bản mới nhất) kết hợp với **Ant Design 5** để tạo giao diện cao cấp.
*   **Backend**: Serverless Functions tích hợp trong Next.js giúp xử lý dữ liệu nhanh chóng và độc lập.
*   **Cơ sở dữ liệu**: **Supabase (PostgreSQL)** - Nền tảng Cloud Database hàng đầu thế giới với độ ổn định và bảo mật cao.
*   **Lưu trữ**: Triển khai trên hạ tầng **Vercel** tại Singapore để đảm bảo tốc độ truy cập tại Việt Nam là nhanh nhất.

---

## 2. Các tính năng nổi bật
*   **Giao diện Premium**: Sử dụng phong cách thiết kế *Glassmorphism* (hiệu ứng kính) trên nền màu đỏ nhạt sang trọng, phông chữ Times New Roman trang trọng.
*   **Biểu mẫu thông minh**: Chia làm 5 phần rõ rệt, có thanh tiến độ (Progress Bar) cập nhật theo thời gian thực giúp người dùng dễ dàng theo dõi.
*   **Hệ thống Bản nháp (Draft)**: Tích hợp tính năng lưu bản nháp thủ công. Người dùng có thể tắt máy và quay lại điền tiếp sau đó mà không bị mất dữ liệu.
*   **Quản trị tập trung (Admin Dashboard)**: Trang quản lý dành riêng cho admin để theo dõi, xóa hoặc xuất dữ liệu.
*   **Xuất dữ liệu chuyên nghiệp**: Hỗ trợ xuất toàn bộ dữ liệu ra file **Excel (.xlsx)** hoặc từng phiếu ra file **Word (.docx)** phục vụ báo cáo.

---

## 3. Chính sách Bảo mật Dữ liệu

Dữ liệu của hội viên RSA là tài sản quan trọng nhất. Chúng tôi áp dụng các tiêu chuẩn bảo mật sau:

### a. Mã hóa đường truyền (HTTPS)
Toàn bộ dữ liệu truyền từ máy tính người dùng đến máy chủ đều được mã hóa bằng giao thức **SSL/TLS (HTTPS)** cấp độ cao nhất. Điều này đảm bảo hacker không thể "nghe lén" hoặc đánh cắp thông tin khi đang truyền tải.

### b. Bảo mật Cơ sở dữ liệu (Supabase Security)
*   **Row Level Security (RLS)**: Dữ liệu được bảo vệ ở cấp độ dòng (row). Mỗi yêu cầu truy cập đều phải qua lớp kiểm tra khóa API bí mật mới có thể tương tác với Database.
*   **Cô lập dữ liệu**: Dữ liệu được lưu trữ trên hạ tầng Cloud của Supabase với hệ thống tường lửa và chống tấn công DDoS mạnh mẽ.

### c. Bảo mật phía Server (Backend Security)
*   **Environment Variables**: Các thông tin nhạy cảm như Khóa cơ sở dữ liệu (API Key) được lưu trữ trong biến môi trường (Environment Variables) trên Vercel. Không có bất kỳ đoạn code nào ở trình duyệt người dùng chứa thông tin bí mật này.
*   **API Protection**: Các đường dẫn API (như lấy danh sách câu trả lời) được thiết kế ẩn và chỉ được gọi từ máy chủ, tránh việc bị khai thác từ bên ngoài.

### d. Kiểm soát dữ liệu đầu vào (Validation)
*   Sử dụng **Zod Schema Validation** để kiểm tra tính hợp lệ của dữ liệu trước khi lưu vào máy chủ. Điều này ngăn chặn các cuộc tấn công SQL Injection hoặc việc nộp dữ liệu rác làm hỏng hệ thống.

### e. Quyền riêng tư của Bản nháp
*   Bản nháp chỉ được lưu cục bộ trên trình duyệt của chính người dùng đó thông qua `LocalStorage`. Không ai khác, kể cả quản trị viên, có thể nhìn thấy bản nháp của bạn cho đến khi bạn nhấn nút "Gửi phiếu khảo sát".

---

## 4. Khuyến nghị vận hành
Để đảm bảo an toàn tối đa, quản trị viên nên:
1.  Không chia sẻ đường dẫn trang `/admin` một cách công khai.
2.  Định kỳ xuất dữ liệu Excel để lưu trữ dự phòng ngoại tuyến.
3.  Thông báo cho hội viên về việc dữ liệu được lưu trữ an toàn trên hạ tầng Cloud để tạo sự tin tưởng.

---
**Trạng thái hệ thống**: Hoạt động ổn định
**Phiên bản cấu trúc**: 1.0.4
**Ngày cập nhật**: 23/04/2026
