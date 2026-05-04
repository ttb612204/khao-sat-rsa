import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bỏ qua các cảnh báo trong quá trình build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
