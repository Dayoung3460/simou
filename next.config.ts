import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevents workspace root from being misdetected because another lockfile exists in the home directory
  turbopack: {
    root: __dirname,
  },
  // The upload route loads sharp at runtime; on Vercel the traced function bundle missed the
  // linux-x64 native binary (sharp then silently fell back to @img/sharp-wasm32, whose
  // SharedArrayBuffer-backed output @vercel/blob's fetch rejects), so include it explicitly
  outputFileTracingIncludes: {
    "/api/admin/photos": [
      "node_modules/@img/sharp-linux-x64/**",
      "node_modules/@img/sharp-libvips-linux-x64/**",
    ],
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
