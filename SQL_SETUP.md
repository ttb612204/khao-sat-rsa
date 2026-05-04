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

### 3. Tạo bảng (Table) dữ liệu
*   Chọn cơ sở dữ liệu `rsa_survey` vừa tạo ở cột bên trái.
*   Nhấn vào tab **SQL** ở thanh công cụ phía trên.
*   Copy và Paste đoạn mã sau vào ô nhập liệu:

```sql
CREATE TABLE `responses` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `data` LONGTEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

*   Nhấn nút **Go** để thực thi.

---

### 4. Cấu hình file .env
Tôi đã cập nhật file `.env` cho bạn, hãy đảm bảo các thông tin sau là đúng với XAMPP của bạn:
*   `MYSQL_HOST=localhost`
*   `MYSQL_USER=root`
*   `MYSQL_PASSWORD=` (để trống nếu bạn chưa đặt mật khẩu cho XAMPP)
*   `MYSQL_DATABASE=rsa_survey`

---

### 5. Lưu ý quan trọng khi Deploy
*   **MySQL XAMPP** chỉ chạy trên máy tính cá nhân của bạn (Localhost). 
*   Nếu bạn đẩy code này lên **Vercel**, trang web sẽ **không thể kết nối** được tới máy tính của bạn để lưu dữ liệu.
*   Khi muốn chạy online, bạn cần sử dụng lại **Supabase** hoặc thuê một dịch vụ **Cloud MySQL** (như PlanetScale, Aiven, hoặc MySQL của Hostinger/Mắt Bão).

---
**Trạng thái**: Hệ thống đã sẵn sàng kết nối với MySQL. Sau khi bạn tạo xong bảng trong phpMyAdmin, hãy chạy lại lệnh `npm run dev` để bắt đầu sử dụng.
