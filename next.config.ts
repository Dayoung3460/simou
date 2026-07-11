import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevents workspace root from being misdetected because another lockfile exists in the home directory
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pphw01l6hrjbno16.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
