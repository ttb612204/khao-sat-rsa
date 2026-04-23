import type { Metadata } from "next";
import "./globals.css";
import "@/styles/print.css";
import StyledComponentsRegistry from "@/components/AntdRegistry";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";

export const metadata: Metadata = {
  title: "Khảo sát Hội viên RSA / CLB Sao Đỏ",
  description: "Phiếu cập nhật thông tin hội viên RSA / CLB Sao Đỏ dành cho doanh nghiệp lớn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <StyledComponentsRegistry>
          <ConfigProvider locale={viVN}>
            {children}
          </ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
