# Prompt xây dựng website phiếu khảo sát RSA / CLB Sao Đỏ

Nguồn nội dung phiếu khảo sát bám theo file Word người dùng cung cấp: fileciteturn0file0  
Bản prompt nền trước đó do người dùng dán thêm trong file văn bản: fileciteturn1file0

---

## PROMPT HOÀN CHỈNH NÂNG CẤP — CÓ ĐẦY ĐỦ INPUT / OUTPUT

```text
Bạn là một Senior Full-Stack Engineer + Senior UI/UX Engineer + Solution Architect chuyên xây dựng web form doanh nghiệp production-ready.

Nhiệm vụ của bạn:
Hãy xây dựng cho tôi một website phiếu khảo sát hoàn chỉnh, full source code, chạy ổn định, không lỗi, dễ deploy, dễ chỉnh sửa, dễ mở rộng, dùng stack hiện đại và phù hợp cho biểu mẫu doanh nghiệp.

==================================================
1) VAI TRÒ VÀ CÁCH LÀM VIỆC
==================================================

Bạn phải làm việc như một kỹ sư phần mềm thực thụ, không phải trả lời kiểu mô tả chung chung.
Bạn phải:
- Phân tích yêu cầu
- Thiết kế kiến trúc thư mục
- Xây dựng UI/UX hợp lý
- Tạo schema validation
- Tạo đầy đủ types
- Tạo constants và data config
- Viết component tái sử dụng
- Tạo API route mock
- Viết README rõ ràng
- Xuất code theo từng file cụ thể
- Đảm bảo ghép lại chạy được

Không được:
- Viết code demo sơ sài
- Viết code nửa chừng
- Chỉ mô tả mà không xuất code
- Bỏ qua phần validation
- Bỏ qua phần responsive
- Dùng placeholder mơ hồ kiểu “// TODO”
- Bỏ qua phần xử lý lỗi
- Bỏ qua phần autosave/import/export/review trước submit

==================================================
2) STACK CÔNG NGHỆ BẮT BUỘC
==================================================

Tech stack bắt buộc:
- Next.js 14+ App Router
- TypeScript
- Ant Design (antd) là UI framework chính
- React Hook Form
- Zod
- dayjs nếu cần
- CSS module hoặc global CSS nhẹ để tinh chỉnh
- Không dùng Tailwind làm hệ UI chính
- Không dùng shadcn/ui
- Không dùng MUI
- Không dùng Bootstrap

Yêu cầu code:
- TypeScript nghiêm túc
- Hạn chế tối đa any
- Component hóa rõ ràng
- Có cấu trúc dự án sạch
- Có thể deploy trên Vercel hoặc môi trường Node thông thường

==================================================
3) BỐI CẢNH NGHIỆP VỤ
==================================================

Tôi cần một website biểu mẫu khảo sát doanh nghiệp với tên:

PHIẾU CẬP NHẬT THÔNG TIN HỘI VIÊN RSA / CLB SAO ĐỎ

Mô tả nhỏ ngay dưới tiêu đề:
Áp dụng cho doanh nghiệp hội viên lớn - kết nối đa điểm

Phiếu khảo sát có 5 phần.

Quy tắc form:
- Các câu hỏi KHÔNG có lựa chọn sẵn => mặc định dùng textarea
- Các câu hỏi CÓ lựa chọn => dùng checkbox cho phép chọn nhiều
- Riêng Phần 4 bắt buộc là bảng 4 cột:
  1. Lĩnh vực
  2. Họ tên
  3. Chức danh
  4. SĐT và Email

==================================================
4) INPUT NGHIỆP VỤ CẦN DÙNG ĐỂ SINH WEB
==================================================

Dữ liệu nội dung phiếu khảo sát:

TIÊU ĐỀ:
PHIẾU CẬP NHẬT THÔNG TIN HỘI VIÊN RSA / CLB SAO ĐỎ

MÔ TẢ NHỎ:
Áp dụng cho doanh nghiệp hội viên lớn - kết nối đa điểm

----------------------------------
PHẦN 1. THÔNG TIN DOANH NGHIỆP
----------------------------------
1. Tên doanh nghiệp đầy đủ
2. Tên thương hiệu / tên giao dịch chính
3. Mã số thuế hoặc số đăng ký doanh nghiệp
4. Năm thành lập doanh nghiệp
5. Trụ sở chính (địa chỉ, tỉnh/thành)
6. Khu vực hoạt động trọng điểm
   - Miền Bắc
   - Miền Trung
   - Miền Nam
   - Toàn quốc
   - Quốc tế
   => checkbox nhiều lựa chọn

7. Ngành nghề kinh doanh chính (liệt kê 1–3 lĩnh vực)
8. Sản phẩm / dịch vụ chủ lực
9. Quy mô doanh nghiệp
   - Vốn điều lệ (tỷ VNĐ)
   - Doanh thu năm gần nhất (tỷ VNĐ)
   - Số lượng lao động
   => cụm field nhóm đẹp, trực quan
10. Danh sách công ty thành viên / đơn vị trực thuộc / hệ sinh thái (nếu có)

----------------------------------
PHẦN 2. HỘI VIÊN CHÍNH THỨC TẠI RSA
----------------------------------
11. Họ và tên hội viên chính thức (Chủ tịch, CEO hoặc đại diện pháp luật)
12. Chức danh
13. Mức độ tham gia trực tiếp của hội viên chính thức
   - Thường xuyên
   - Theo sự kiện trọng điểm
   - Chỉ tham gia giao lưu cấp cao
   - Chủ yếu ủy quyền cho đầu mối khác
   => checkbox nhiều lựa chọn

14. Hình thức liên hệ với hội viên chính thức
   - Trực tiếp
   - Qua trợ lý/thư ký
   - Qua người đại diện tại RSA
   - Chỉ liên hệ trực tiếp khi cần
   => checkbox nhiều lựa chọn
   => nếu chọn “Chỉ liên hệ trực tiếp khi cần” thì hiện thêm ô nhập mô tả trường hợp

15. Lĩnh vực quan tâm ưu tiên của hội viên chính thức
   - Chính sách & môi trường kinh doanh
   - Đầu tư – M&A
   - Đổi mới sáng tạo
   - Chuyển đổi số
   - Thế hệ kế cận
   - CSR – Thiện nguyện
   - Golf, giao lưu thể thao
   - Phát triển lãnh đạo trẻ
   - Bất động sản
   - Công nghệ
   - Chuyển đổi xanh – ESG
   - Đào tạo – nhân sự
   - Quản trị doanh nghiệp
   - Chủ đề khác
   => checkbox nhiều lựa chọn
   => nếu chọn “Chủ đề khác” thì hiện ô nhập nội dung

----------------------------------
PHẦN 3. ĐẦU MỐI LÀM VIỆC VỚI RSA
----------------------------------
16. Họ tên đầu mối chính (trợ lý, thư ký, chánh văn phòng, giám đốc đối ngoại...)
17. Chức danh đầu mối chính
18. Thông tin liên hệ đầu mối chính
   - Số điện thoại
   - Email
   - Zalo hoặc phương thức liên hệ khác

19. Vai trò của đầu mối trong doanh nghiệp với RSA
   - Nhận thông tin hoạt động
   - Xác nhận/điều phối lịch tham dự
   - Điều phối liên hệ nội bộ
   - Thay mặt lãnh đạo trong sự kiện chuyên đề
   - Triển khai xúc tiến hợp tác ban đầu
   => checkbox nhiều lựa chọn

20. Mức độ ủy quyền của đầu mối
   - Chỉ nhận/báo cáo thông tin
   - Có thể xác nhận tham dự hoạt động
   - Được phép tham gia, ký kết/hợp tác ở mức ban đầu
   => vẫn render checkbox nhiều lựa chọn theo yêu cầu tổng quát
   => nhưng cần có helper text giải thích rõ

----------------------------------
PHẦN 4. ĐẦU MỐI CHUYÊN MÔN ĐỂ “KẾT NỐI ĐA ĐIỂM”
----------------------------------
21. Các đầu mối chuyên môn doanh nghiệp muốn đăng ký kết nối cùng hội viên khác

Phần này bắt buộc là bảng 4 cột:
- Lĩnh vực
- Họ tên
- Chức danh
- SĐT và Email

Tạo sẵn các dòng lĩnh vực gợi ý:
- Kinh doanh / Phát triển thị trường
- Mua hàng / Chuỗi cung ứng
- Đầu tư / Hợp tác chiến lược / M&A
- Đổi mới sáng tạo / Công nghệ / Chuyển đổi số
- Nhân sự / Đào tạo / Thế hệ kế cận
- Truyền thông / Thương hiệu / CSR

Yêu cầu:
- Mỗi dòng phải có thể nhập:
  - Họ tên
  - Chức danh
  - SĐT
  - Email
- Có thể hiển thị trong 4 cột, trong đó cột cuối cùng trình bày rõ “SĐT và Email”
- Cho phép thêm dòng tùy chỉnh ngoài danh sách gợi ý
- Cho phép xóa dòng
- Responsive tốt trên mobile
- Nếu cần, mobile tự chuyển sang card layout nhưng vẫn giữ đúng dữ liệu

----------------------------------
PHẦN 5. NĂNG LỰC, NHU CẦU & XÚC TIẾN NỘI BỘ
----------------------------------
22. Thế mạnh nổi bật doanh nghiệp có thể đóng góp cho mạng lưới RSA
23. Nhu cầu ưu tiên doanh nghiệp muốn RSA hỗ trợ kết nối
   - Khách hàng mới
   - Nhà cung cấp
   - Đối tác phân phối
   - Đối tác đầu tư
   - Đối tác công nghệ
   - Đối tác xuất khẩu
   - Đối tác truyền thông
   - Tuyển dụng nhân sự cấp cao
   - Chủ đề khác
   => checkbox nhiều lựa chọn
   => nếu chọn “Chủ đề khác” thì hiện ô nhập thêm

24. Danh mục sản phẩm/dịch vụ/cơ hội hợp tác muốn giới thiệu, ưu tiên kết nối trong mạng lưới hội viên RSA

==================================================
5) QUY TẮC RENDER UI
==================================================

Render theo quy tắc:
- Câu không có lựa chọn => textarea
- Câu có lựa chọn => checkbox group
- Có label rõ ràng
- Có số thứ tự câu
- Có placeholder tiếng Việt phù hợp
- Có helper text ngắn nếu cần
- Field bắt buộc phải có dấu *
- Field không bắt buộc ghi chú phù hợp nếu cần
- Các phần phải hiển thị bằng section/card rõ ràng
- Có navigation nhanh giữa 5 phần
- Có progress hiển thị mức độ hoàn thành

==================================================
6) YÊU CẦU UI/UX
==================================================

Thiết kế website theo phong cách:
- Chuyên nghiệp
- Trang nhã
- Doanh nghiệp
- Hiện đại
- Dễ đọc
- Không rối mắt
- Khoảng trắng tốt
- Font rõ ràng
- Tông sáng chuyên nghiệp

Yêu cầu UI/UX:
- Header đẹp với tiêu đề lớn
- Mô tả nhỏ nằm ngay dưới tiêu đề
- Mỗi phần là một card/section rõ ràng
- Có sticky action bar ở cuối hoặc cạnh màn hình
- Có nút:
  - Lưu tạm
  - Xóa toàn bộ
  - Xem lại trước khi gửi
  - Gửi phiếu khảo sát
- Có loading state khi submit
- Có success message đẹp
- Có error message rõ ràng
- Có animation nhẹ
- Có responsive cho desktop/tablet/mobile
- Có tối ưu in ấn (print CSS hoặc PDF-friendly layout)
- Có trang cảm ơn sau khi gửi thành công

==================================================
7) YÊU CẦU CHỨC NĂNG
==================================================

Bắt buộc phải có:
1. React Hook Form + Zod schema validation
2. Autosave localStorage
3. Restore dữ liệu từ localStorage khi tải lại trang
4. Export dữ liệu JSON
5. Import JSON để điền tiếp
6. Review toàn bộ dữ liệu trước submit
7. Submit tới API route mock nội bộ
8. Chống submit 2 lần
9. Validate email
10. Validate số điện thoại cơ bản
11. Validate trường “khác” nếu checkbox khác được chọn
12. Validate JSON import sai định dạng
13. Có reset form hoàn toàn
14. Có trạng thái hoàn thành từng phần
15. Có component bảng động cho Phần 4

==================================================
8) YÊU CẦU VALIDATION
==================================================

Validation cần có:
- Tên doanh nghiệp: không rỗng
- Họ tên người đại diện: không rỗng
- Email: đúng định dạng
- Số điện thoại: chỉ cho ký tự hợp lệ, kiểm tra cơ bản
- Checkbox “Chủ đề khác”: bắt buộc nhập nội dung nếu đã tick
- Checkbox “Chỉ liên hệ trực tiếp khi cần”: bắt buộc nhập mô tả nếu đã tick
- Năm thành lập: số hợp lệ, trong khoảng hợp lý
- Các field số trong quy mô doanh nghiệp: cho nhập số hợp lệ
- Import JSON sai schema: phải báo lỗi rõ ràng

==================================================
9) YÊU CẦU KIẾN TRÚC MÃ NGUỒN
==================================================

Hãy tổ chức source code tối thiểu gồm:

- app/
  - page.tsx
  - thank-you/page.tsx
  - api/
    - survey/route.ts

- components/
  - survey/
    - SurveyHeader.tsx
    - SectionCard.tsx
    - QuestionField.tsx
    - CheckboxGroup.tsx
    - ContactTableSection.tsx
    - ReviewDrawer.tsx
    - SubmitBar.tsx
    - SectionNavigator.tsx
    - ProgressSummary.tsx

- constants/
  - survey.ts

- schemas/
  - survey.schema.ts

- types/
  - survey.ts

- utils/
  - storage.ts
  - importExport.ts
  - validation.ts
  - format.ts

- hooks/
  - useSurveyAutosave.ts
  - useSectionProgress.ts

- styles/
  - print.css

- README.md
- package.json
- tsconfig.json
- next.config.* nếu cần

==================================================
10) YÊU CẦU CHẤT LƯỢNG CODE
==================================================

- TypeScript chặt chẽ
- Không lạm dụng any
- Tách logic ra khỏi UI khi hợp lý
- Dữ liệu câu hỏi phải nằm ở constants riêng
- Schema ở file riêng
- Types ở file riêng
- Utility ở file riêng
- Component có khả năng tái sử dụng
- Comment ngắn gọn, đúng chỗ
- Tối ưu maintainability
- Không viết code thừa
- Không hardcode bừa bãi trong component nếu nên tách config

==================================================
11) CÁC EDGE CASE CẦN XỬ LÝ
==================================================

Phải xử lý các tình huống:
- Reload trang không mất dữ liệu
- Submit liên tiếp nhiều lần
- Import file JSON lỗi cấu trúc
- Checkbox “khác” nhưng không nhập text
- Email nhập sai
- Số điện thoại nhập ký tự lạ
- Bảng phần 4 không có dữ liệu vẫn không crash
- Xóa hết dòng ở phần 4 vẫn hoạt động đúng
- LocalStorage có dữ liệu cũ sai format
- Người dùng thoát review rồi quay lại chỉnh tiếp
- Mobile hiển thị bảng phần 4 không bị vỡ layout

==================================================
12) OUTPUT BẮT BUỘC CỦA BẠN
==================================================

Bạn phải xuất kết quả theo đúng thứ tự sau:

PHẦN A — TÓM TẮT GIẢI PHÁP
- Nêu ngắn gọn kiến trúc
- Nêu lý do chọn Ant Design
- Nêu cách tổ chức state, schema, API mock

PHẦN B — CẤU TRÚC THƯ MỤC
- In ra tree thư mục hoàn chỉnh

PHẦN C — FULL SOURCE CODE
- Xuất lần lượt từng file
- Mỗi file phải có format:

### File: <đường_dẫn_tệp>

```tsx
...nội dung code...
```

hoặc

```ts
...nội dung code...
```

hoặc loại code fence phù hợp

- Không được bỏ sót file quan trọng
- Không được cắt bớt giữa chừng
- Các file phải ghép lại chạy được

PHẦN D — HƯỚNG DẪN CHẠY
- npm install
- npm run dev
- cách mở local
- cách build production

PHẦN E — HƯỚNG DẪN TÙY BIẾN
- Muốn sửa nội dung câu hỏi thì sửa file nào
- Muốn sửa validation thì sửa file nào
- Muốn nối API/database thật thì sửa file nào
- Muốn đổi giao diện thì sửa ở đâu

==================================================
13) TIÊU CHÍ NGHIỆM THU
==================================================

Kết quả được coi là đạt khi:
- Chạy được sau khi cài dependency
- Form hiển thị đúng tiêu đề và mô tả
- Có đủ 5 phần
- Phần 4 là bảng 4 cột đúng yêu cầu
- Câu không có lựa chọn là textarea
- Câu có lựa chọn là checkbox nhiều lựa chọn
- Có autosave
- Có review trước submit
- Có export/import JSON
- Có API route mock
- Có validation đầy đủ
- Có responsive
- Có trang cảm ơn sau submit thành công
- Không có lỗi TypeScript rõ ràng trong code xuất ra

==================================================
14) QUY TẮC LÀM VIỆC CUỐI CÙNG
==================================================

- Không được giản lược yêu cầu
- Không được tự ý bỏ tính năng
- Không được thay stack
- Không được biến checkbox thành radio nếu tôi chưa yêu cầu
- Không được bỏ qua phần review/import/export/autosave
- Không được chỉ mô tả ý tưởng
- Phải trả về code thật, đầy đủ, có thể ghép chạy
- Nếu nội dung dài, cứ tiếp tục theo từng file cho đến khi hoàn tất
```

---

## ĐOẠN BỔ SUNG SIẾT CHẶT CHẤT LƯỢNG CODE

```text
Ràng buộc cực quan trọng:
- Trước khi xuất code, hãy tự kiểm tra tính nhất quán giữa:
  1. types
  2. zod schema
  3. default values
  4. tên field trong form
  5. dữ liệu submit API
- Không được để mismatch field name
- Không được để import path sai
- Không được để component gọi props không tồn tại
- Không được để code thiếu dependency mà package.json không khai báo
- Không được để Next.js App Router bị dùng sai cú pháp
- Không được để Ant Design component dùng sai API
- Hãy đảm bảo source code đồng bộ từ đầu đến cuối
```

---

## ĐOẠN BỔ SUNG ÉP AI XUẤT CODE SẠCH, DỄ COPY

```text
Khi xuất code:
- Không giải thích lan man giữa các file
- Chỉ ghi ngắn gọn tên file rồi xuất code
- Mỗi file phải đầy đủ từ dòng đầu đến dòng cuối
- Không dùng ký hiệu “...” để cắt đoạn
- Không nói “phần còn lại tương tự”
- Không bỏ qua file nhỏ như types/constants/utils
```

---

## CÁCH DÙNG KHUYÊN NGHỊ

### Cách 1: Ép AI xuất toàn bộ một lần
Dùng nguyên prompt trên nếu model đủ mạnh và context dài.

### Cách 2: Chia 2 lượt để giảm lỗi
**Lượt 1**: yêu cầu AI xuất:
- PHẦN A
- PHẦN B
- 8 file quan trọng nhất

Gợi ý 8 file đầu:
- package.json
- app/page.tsx
- app/api/survey/route.ts
- schemas/survey.schema.ts
- types/survey.ts
- constants/survey.ts
- components/survey/ContactTableSection.tsx
- README.md

**Lượt 2**: yêu cầu:
- “Tiếp tục xuất toàn bộ các file còn lại, không lặp lại file cũ.”

---

## GỢI Ý LỜI NHẮN NGẮN ĐỂ DÙNG KÈM

```text
Hãy bám đúng prompt-spec dưới đây và xuất code production-ready. Không giản lược, không bỏ file, không mô tả suông. Tôi cần source code thật, chạy được, theo đúng App Router + TypeScript + Ant Design + React Hook Form + Zod.
```

