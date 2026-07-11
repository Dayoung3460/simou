import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevents workspace root from being misdetected because another lockfile exists in the home directory
  turbopack: {
    root: __dirname,
  },
  experimental: {
    // proxy.ts matches /api/admin/*, which makes Next buffer request bodies with a 10MB cap by
    // default — silently truncating admin photo uploads. Only a safety net for originals the
    // browser couldn't downscale; production is still bound by Vercel's 4.5MB function body limit
    proxyClientMaxBodySize: "25mb",
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
