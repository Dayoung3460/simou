import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 홈 디렉토리에 다른 lockfile이 있어 workspace root 추론이 어긋나는 것 방지
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
