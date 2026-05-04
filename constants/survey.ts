import { Question, Section } from '../types/survey';

export const SURVEY_TITLE = "PHIẾU CẬP NHẬT THÔNG TIN HỘI VIÊN RSA / CLB SAO ĐỎ";
export const SURVEY_SUBTITLE = "Áp dụng cho doanh nghiệp hội viên lớn - kết nối đa điểm";

export const DEFAULT_CONTACT_POINTS = [
  "Kinh doanh / Phát triển thị trường",
  "Mua hàng / Chuỗi cung ứng",
  "Đầu tư / Hợp tác chiến lược / M&A",
  "Đổi mới sáng tạo / Công nghệ / Chuyển đổi số",
  "Nhân sự / Đào tạo / Thế hệ kế cận",
  "Truyền thông / Thương hiệu / CSR"
];

export const QUESTIONS: Question[] = [
  // PHẦN 1
  { id: 'q1', number: 1, label: 'Tên doanh nghiệp đầy đủ', type: 'textarea', required: true, placeholder: 'Nhập tên đầy đủ của doanh nghiệp' },
  { id: 'q2', number: 2, label: 'Tên thương hiệu / tên giao dịch chính', type: 'textarea', required: true, placeholder: 'Nhập tên thương hiệu hoặc tên giao dịch' },
  { id: 'q3', number: 3, label: 'Mã số thuế hoặc số đăng ký doanh nghiệp', type: 'textarea', required: true, placeholder: 'Nhập mã số thuế' },
  { id: 'q4', number: 4, label: 'Năm thành lập doanh nghiệp', type: 'textarea', required: true, placeholder: 'VD: 1995' },
  { id: 'q5', number: 5, label: 'Trụ sở chính (địa chỉ, tỉnh/thành)', type: 'textarea', required: true, placeholder: 'Nhập địa chỉ trụ sở chính' },
  {
    id: 'q6', number: 6, label: 'Khu vực hoạt động trọng điểm', type: 'checkbox', required: true,
    options: ['Miền Bắc', 'Miền Trung', 'Miền Nam', 'Toàn quốc', 'Quốc tế'],
    helperText: 'Có thể chọn nhiều lựa chọn'
  },
  { id: 'q7', number: 7, label: 'Ngành nghề kinh doanh chính (liệt kê 1–3 lĩnh vực)', type: 'textarea', required: true, placeholder: 'Nhập ngành nghề kinh doanh' },
  { id: 'q8', number: 8, label: 'Sản phẩm / dịch vụ chủ lực', type: 'textarea', required: true, placeholder: 'Nhập sản phẩm/dịch vụ chủ lực' },
  { id: 'q9_capital', number: 9.1, label: 'Vốn điều lệ (tỷ VNĐ)', type: 'textarea', required: true, placeholder: 'Nhập vốn điều lệ' },
  { id: 'q9_revenue', number: 9.2, label: 'Doanh thu năm gần nhất (tỷ VNĐ)', type: 'textarea', required: true, placeholder: 'Nhập doanh thu' },
  { id: 'q9_labor', number: 9.3, label: 'Số lượng lao động', type: 'textarea', required: true, placeholder: 'Nhập số lượng lao động' },
  { id: 'q10', number: 10, label: 'Danh sách công ty thành viên / đơn vị trực thuộc / hệ sinh thái (nếu có)', type: 'textarea', required: false, placeholder: 'Nhập danh sách nếu có (Không bắt buộc)' },

  // PHẦN 2
  { id: 'q11', number: 11, label: 'Họ và tên hội viên chính thức (Chủ tịch, CEO hoặc đại diện pháp luật)', type: 'textarea', required: true, placeholder: 'Nhập họ tên' },
  { id: 'q12', number: 12, label: 'Chức danh', type: 'textarea', required: true, placeholder: 'Nhập chức danh' },
  {
    id: 'q13', number: 13, label: 'Mức độ tham gia trực tiếp của hội viên chính thức', type: 'checkbox', required: true,
    options: ['Thường xuyên', 'Theo sự kiện trọng điểm', 'Chỉ tham gia giao lưu cấp cao', 'Chủ yếu ủy quyền cho đầu mối khác']
  },
  {
    id: 'q14', number: 14, label: 'Hình thức liên hệ với hội viên chính thức', type: 'checkbox', required: true,
    options: ['Trực tiếp', 'Qua trợ lý/thư ký', 'Qua người đại diện tại RSA', 'Chỉ liên hệ trực tiếp khi cần'],
    helperText: 'Nếu chọn "Chỉ liên hệ trực tiếp khi cần", vui lòng mô tả trường hợp bên dưới'
  },
  {
    id: 'q15', number: 15, label: 'Lĩnh vực quan tâm ưu tiên của hội viên chính thức', type: 'checkbox', required: true,
    options: DEFAULT_CONTACT_POINTS,
    helperText: 'Chọn các lĩnh vực ưu tiên'
  },
  { id: 'q15_sustainability', number: 16, label: 'Doanh nghiệp đã có báo cáo bền vững chưa?', type: 'textarea', required: true, placeholder: 'Nhập thông tin báo cáo bền vững' },
  { id: 'q15_csr', number: 17, label: 'Lĩnh vực CSR ưu tiên?', type: 'textarea', required: true, placeholder: 'Nhập lĩnh vực CSR ưu tiên' },

  // PHẦN 3
  { id: 'q16', number: 18, label: 'Họ tên đầu mối chính (trợ lý, thư ký, chánh văn phòng, giám đốc đối ngoại...)', type: 'textarea', required: true, placeholder: 'Nhập họ tên đầu mối' },
  { id: 'q17', number: 19, label: 'Chức danh đầu mối chính', type: 'textarea', required: true, placeholder: 'Nhập chức danh' },
  { id: 'q18_phone', number: 20.1, label: 'Số điện thoại đầu mối', type: 'textarea', required: true, placeholder: 'Nhập số điện thoại' },
  { id: 'q18_email', number: 20.2, label: 'Email đầu mối', type: 'textarea', required: true, placeholder: 'Nhập email' },
  { id: 'q18_other', number: 20.3, label: 'Zalo hoặc phương thức liên hệ khác', type: 'textarea', required: true, placeholder: 'Nhập thông tin khác' },
  {
    id: 'q19', number: 21, label: 'Vai trò của đầu mối trong doanh nghiệp với RSA', type: 'checkbox', required: true,
    options: ['Nhận thông tin hoạt động', 'Xác nhận/điều phối lịch tham dự', 'Điều phối liên hệ nội bộ', 'Thay mặt lãnh đạo trong sự kiện chuyên đề', 'Triển khai xúc tiến hợp tác ban đầu']
  },
  {
    id: 'q20', number: 22, label: 'Mức độ ủy quyền của đầu mối', type: 'checkbox', required: true,
    options: ['Chỉ nhận/báo cáo thông tin', 'Có thể xác nhận tham dự hoạt động', ' Được phép tham gia, ký kết/hợp tác ở mức ban đầu'],
    helperText: 'Chọn các mức độ ủy quyền phù hợp'
  },

  // PHẦN 4
  { id: 'q21', number: 23, label: 'Đầu mối chuyên môn để “kết nối đa điểm”', type: 'textarea', required: false, placeholder: '' },

  // PHẦN 5
  { id: 'q22', number: 24, label: 'Thế mạnh nổi bật doanh nghiệp có thể đóng góp cho mạng lưới RSA', type: 'textarea', required: true, placeholder: 'Nhập thế mạnh doanh nghiệp' },
  {
    id: 'q23', number: 25, label: 'Nhu cầu ưu tiên doanh nghiệp muốn RSA hỗ trợ kết nối', type: 'checkbox', required: true,
    options: ['Khách hàng mới', 'Nhà cung cấp', 'Đối tác phân phối', 'Đối tác đầu tư', 'Đối tác công nghệ', 'Đối tác xuất khẩu', 'Đối tác truyền thông', 'Tuyển dụng nhân sự cấp cao', 'Chủ đề khác']
  },
  { id: 'q24', number: 26, label: 'Danh mục sản phẩm/dịch vụ/cơ hội hợp tác muốn giới thiệu, ưu tiên kết nối trong mạng lưới hội viên RSA', type: 'textarea', required: true, placeholder: 'Nhập danh mục sản phẩm/dịch vụ' },
];

export const SECTIONS: Section[] = [
  {
    id: 'section1',
    title: 'PHẦN 1. THÔNG TIN DOANH NGHIỆP',
    questions: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9_capital', 'q9_revenue', 'q9_labor', 'q10']
  },
  {
    id: 'section2',
    title: 'PHẦN 2. HỘI VIÊN CHÍNH THỨC TẠI RSA',
    questions: ['q11', 'q12', 'q13', 'q14', 'q15', 'q15_sustainability', 'q15_csr']
  },
  {
    id: 'section3',
    title: 'PHẦN 3. ĐẦU MỐI LÀM VIỆC VỚI RSA',
    questions: ['q16', 'q17', 'q18_phone', 'q18_email', 'q18_other', 'q19', 'q20']
  },
  {
    id: 'section4',
    title: 'PHẦN 4. ĐẦU MỐI CHUYÊN MÔN ĐỂ “KẾT NỐI ĐA ĐIỂM”',
    description: 'Các đầu mối chuyên môn doanh nghiệp muốn đăng ký kết nối cùng hội viên khác',
    questions: ['q21']
  },
  {
    id: 'section5',
    title: 'PHẦN 5. NĂNG LỰC, NHU CẦU & XÚC TIẾN NỘI BỘ',
    questions: ['q22', 'q23', 'q24']
  }
];
