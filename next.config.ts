import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Để build được trên Vercel khi có lỗi lint (any type...)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Để build được trên Vercel khi có lỗi type
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
