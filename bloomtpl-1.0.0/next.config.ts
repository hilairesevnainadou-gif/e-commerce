import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The Laravel API runs on localhost in dev, which resolves to a loopback
    // IP; Next's SSRF guard blocks that by default regardless of remotePatterns.
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8002",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
