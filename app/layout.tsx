import type { Metadata } from "next";
import "./globals.css";
import "@/styles/print.css";
import StyledComponentsRegistry from "@/components/AntdRegistry";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";

export const metadata: Metadata = {
  title: "PHIẾU CẬP NHẬT THÔNG TIN HỘI VIÊN VABSO",
  description: "Hệ thống cập nhật thông tin hội viên chính thức của VABSO",
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
