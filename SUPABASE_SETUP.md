# HƯỚNG DẪN CÀI ĐẶT SUPABASE (CLOUD)

Để hệ thống hoạt động ổn định trên Vercel và đảm bảo bảo mật, bạn hãy thực hiện các bước sau trong trang quản trị Supabase:

---

### 1. Khôi phục dự án (Restore)
*   Nếu dự án của bạn đang bị tạm dừng (**Paused**), hãy nhấn nút **Restore** trong Supabase Dashboard. Đợi khoảng 2-3 phút để máy chủ khởi động lại.

---

### 2. Tạo các bảng dữ liệu bằng SQL Editor
*   Trong Supabase Dashboard, chọn dự án của bạn.
*   Tìm mục **SQL Editor** ở thanh menu bên trái.
*   Nhấn **New query**.
*   Copy và Paste đoạn mã sau vào ô nhập liệu:

```sql
-- 1. Tạo bảng lưu trữ câu trả lời khảo sát (nếu chưa có)
CREATE TABLE IF NOT EXISTS responses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  data jsonb NOT NULL,
  submitted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tạo bảng lưu trữ tài khoản quản trị
CREATE TABLE IF NOT EXISTS users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  username text NOT NULL UNIQUE,
  password text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tạo bảng lưu nhật ký hoạt động (Audit Logs)
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  action text NOT NULL,
  username text DEFAULT 'unknown',
  details text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Thêm tài khoản quản trị mặc định (admin / rsa123456)
-- Mật khẩu đã được mã hóa Bcrypt để bảo mật
INSERT INTO users (username, password) 
VALUES ('admin', '$2b$10$WdTSd0tnTqYfTLXXhnZJ.uMR3SoCXbQi0RFB6NtXl1wwrwU3Ifby.')
ON CONFLICT (username) DO NOTHING;
```

*   Nhấn nút **Run** để thực thi.

---

### 3. Cấu hình file .env và Vercel
Hãy đảm bảo bạn đã điền đúng thông tin Supabase vào file `.env` (để chạy local) và vào phần **Environment Variables** trên Vercel (để chạy online):

*   `NEXT_PUBLIC_SUPABASE_URL`: Đường dẫn dự án của bạn.
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Mã Anon Key (chuỗi ký tự rất dài).
*   `AUTH_SECRET`: Một chuỗi ký tự ngẫu nhiên bất kỳ (để bảo mật phiên làm việc).

---
**Trạng thái**: Hệ thống đã chuyển đổi hoàn toàn sang Supabase, sẵn sàng để đồng bộ lên Vercel và sử dụng chính thức.
