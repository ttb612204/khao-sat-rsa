# ĐỀ XUẤT: NÂNG CẤP BẢO MẬT TRANG QUẢN TRỊ (ADMIN)

## 1. Tình trạng hiện tại
Hiện nay, trang tổng hợp dữ liệu khảo sát đang được truy cập thông qua một đường dẫn ẩn. Tuy nhiên, về mặt kỹ thuật, bất kỳ ai có đường dẫn này đều có thể:
*   Xem toàn bộ thông tin nhạy cảm của các doanh nghiệp hội viên.
*   Xuất dữ liệu Excel ra máy cá nhân.
*   Xóa bản ghi dữ liệu khỏi hệ thống.

=> **Rủi ro**: Nếu đường dẫn vô tình bị chia sẻ ra ngoài, dữ liệu hội viên sẽ không còn được đảm bảo tính riêng tư.

---

## 2. Giải pháp đề xuất: Thêm lớp khóa bảo vệ (Admin Login)
Chúng ta sẽ xây dựng một trang Đăng nhập dành riêng cho người quản lý. Khi ai đó cố gắng truy cập vào trang dữ liệu, hệ thống sẽ yêu cầu cung cấp **Tên đăng nhập** và **Mật khẩu**.

### Cách thức hoạt động:
1.  **Chặn truy cập tự do**: Mọi yêu cầu vào trang quản trị sẽ bị chặn lại và chuyển hướng về trang Đăng nhập.
2.  **Xác thực người dùng**: Chỉ những người giữ tài khoản chính thức mới có thể vượt qua lớp bảo vệ này.
3.  **Ghi nhớ phiên làm việc**: Sau khi đăng nhập thành công, người quản lý có thể làm việc trong một khoảng thời gian nhất định mà không cần nhập lại mật khẩu.

---

## 3. Các phương án thực hiện

### Phương án A: Bảo mật bằng mật khẩu quản trị (Nhanh & Hiệu quả)
*   **Cách làm**: Thiết lập một bộ Tên đăng nhập/Mật khẩu cố định và lưu trữ bí mật trên máy chủ.
*   **Ưu điểm**: Triển khai cực nhanh, dễ sử dụng, không cần quản lý nhiều tài khoản phức tạp.
*   **Phù hợp**: Khi chỉ có 1-2 người chịu trách nhiệm quản lý chính.

### Phương án B: Hệ thống quản lý tài khoản chuyên nghiệp (Nâng cao)
*   **Cách làm**: Sử dụng công nghệ xác thực của Supabase để tạo tài khoản riêng cho từng người (ví dụ: admin1, admin2...).
*   **Ưu điểm**: Có thể cấp quyền hoặc thu hồi quyền của từng người, bảo mật đa lớp.
*   **Phù hợp**: Khi có nhiều bộ phận cùng tham gia quản lý dữ liệu.

---

## 4. Lợi ích sau khi nâng cấp
*   **An tâm tuyệt đối**: Dữ liệu hội viên được bảo vệ bởi "khóa" an toàn, không lo bị rò rỉ thông tin.
*   **Tính chuyên nghiệp**: Thể hiện sự tôn trọng và cam kết bảo mật thông tin của RSA đối với các doanh nghiệp hội viên.
*   **Kiểm soát tốt**: Ngăn chặn các hành động xóa dữ liệu ngoài ý muốn từ những người không có thẩm quyền.

---
**Khuyến nghị**: Chúng ta nên triển khai **Phương án A** ngay trong giai đoạn này để đảm bảo an toàn kịp thời cho dữ liệu khảo sát đang đổ về.
