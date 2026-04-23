# Hướng dẫn đưa Website Khảo sát lên Internet (Deploy)

Tài liệu này hướng dẫn bạn cách đưa ứng dụng Next.js từ máy tính cá nhân lên môi trường web thật để mọi người có thể truy cập.

---

## 1. Cách dễ nhất: Sử dụng Vercel (Miễn phí & Tối ưu cho Next.js)

Vercel là nền tảng quản lý của chính đội ngũ tạo ra Next.js, rất mạnh mẽ và dễ sử dụng.

### Bước 1: Đưa code lên GitHub
1. Truy cập [github.com](https://github.com) và tạo tài khoản.
2. Tạo một Repository mới (ví dụ: `khao-sat-rsa`).
3. Tại thư mục dự án trên máy tính, mở terminal và chạy các lệnh sau:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TEN_TAI_KHOAN/khao-sat-rsa.git
   git push -u origin main
   ```

### Bước 2: Kết nối với Vercel
1. Truy cập [vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
2. Nhấn nút **"Add New"** -> **"Project"**.
3. Tìm Repository `khao-sat-rsa` và nhấn **"Import"**.
4. Tại phần "Environment Variables" (nếu bạn có dùng CSDL sau này), hãy nhập các khóa bí mật vào đây.
5. Nhấn **"Deploy"**.
6. Sau khi hoàn tất, bạn sẽ nhận được một đường link (ví dụ: `khao-sat-rsa.vercel.app`).

---

## 2. Cách chạy trên Server riêng (VPS) sử dụng PM2

Nếu bạn thuê server riêng (Ubuntu, Windows Server, v.v.), hãy làm theo các bước này:

1. **Cài đặt Node.js**: Đảm bảo server đã cài Node.js phiên bản 18 trở lên.
2. **Cài đặt PM2** (Công cụ giữ server luôn chạy):
   ```bash
   npm install pm2 -g
   ```
3. **Build ứng dụng**:
   ```bash
   npm run build
   ```
4. **Chạy với PM2**:
   ```bash
   pm2 start npm --name "survey-app" -- start
   ```
5. **Cấu hình tự khởi động**:
   ```bash
   pm2 save
   pm2 startup
   ```

---

## 3. Các lưu ý cực kỳ quan trọng

### A. Kết nối Cơ sở dữ liệu (Database)
Hiện tại web đang dùng **Mock API** (dữ liệu in ra Terminal). Khi đưa lên mạng, bạn cần kết nối với Database thật để lưu trữ dữ liệu.
*   **Gợi ý**: Sử dụng **Supabase** (miễn phí, dễ dùng cho Next.js).
*   **Cách làm**: Cập nhật tệp `app/api/survey/route.ts` để thực hiện lệnh `INSERT` vào bảng trong Database.

### B. Tên miền (Domain)
Nếu bạn đã mua tên miền (ví dụ: `khaosatsaodo.vn`):
1. Trong Vercel, vào mục **Settings** -> **Domains**.
2. Nhập tên miền của bạn.
3. Cập nhật bản ghi **A** hoặc **CNAME** trong quản lý tên miền theo hướng dẫn của Vercel.

### C. Chứng chỉ bảo mật (SSL/HTTPS)
Nếu dùng Vercel, bạn sẽ được cấp SSL (khóa xanh trên thanh địa chỉ) **hoàn toàn miễn phí**.

---

*Chúc bạn triển khai dự án thành công!*
