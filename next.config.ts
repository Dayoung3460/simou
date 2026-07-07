import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevents workspace root from being misdetected because another lockfile exists in the home directory
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
