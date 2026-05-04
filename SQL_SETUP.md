# HƯỚNG DẪN CÀI ĐẶT MYSQL (XAMPP)

Để chuyển đổi sang sử dụng MySQL cục bộ trên máy tính của bạn, hãy thực hiện các bước sau:

---

### 1. Khởi động MySQL trong XAMPP
*   Mở **XAMPP Control Panel**.
*   Nhấn nút **Start** ở dòng **MySQL**.
*   Nhấn nút **Admin** để mở trang **phpMyAdmin** trên trình duyệt.

---

### 2. Tạo Cơ sở dữ liệu (Database)
*   Trong phpMyAdmin, nhấn vào tab **Databases**.
*   Nhập tên cơ sở dữ liệu: `rsa_survey`
*   Chọn kiểu mã hóa (Collation): `utf8mb4_unicode_ci`
*   Nhấn nút **Create**.

---

### 3. Tạo các bảng dữ liệu
*   Chọn cơ sở dữ liệu `rsa_survey` vừa tạo ở cột bên trái.
*   Nhấn vào tab **SQL** ở thanh công cụ phía trên.
*   Copy và Paste đoạn mã sau vào ô nhập liệu:

```sql
-- 1. Tạo bảng lưu trữ câu trả lời khảo sát
CREATE TABLE `responses` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `data` LONGTEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tạo bảng lưu trữ tài khoản quản trị
CREATE TABLE `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Thêm tài khoản quản trị mặc định (admin / rsa123456)
-- Lưu ý: Mật khẩu 'rsa123456' đã được mã hóa bằng bcrypt
INSERT INTO `users` (`username`, `password`) VALUES ('admin', '$2b$10$WdTSd0tnTqYfTLXXhnZJ.uMR3SoCXbQi0RFB6NtXl1wwrwU3Ifby.');
```

*   Nhấn nút **Go** để thực thi.

---

### 4. Kiểm tra file .env
Hãy đảm bảo cấu hình kết nối trong file `.env` của bạn là đúng:
*   `MYSQL_HOST=localhost`
*   `MYSQL_USER=root`
*   `MYSQL_PASSWORD=` (để trống nếu XAMPP không có mật khẩu)
*   `MYSQL_DATABASE=rsa_survey`

---

### 5. Cách quản lý tài khoản
*   Để đổi mật khẩu Admin, bạn chỉ cần vào bảng `users` trong phpMyAdmin và sửa giá trị ở cột `password`.
*   Bạn có thể thêm nhiều tài khoản quản trị khác bằng cách thêm dòng mới vào bảng `users`.

---
**Trạng thái**: Hệ thống đã sẵn sàng kết nối với MySQL cho cả phần Lưu dữ liệu và Đăng nhập.
