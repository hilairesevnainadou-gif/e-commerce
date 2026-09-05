import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  // Standalone output bundles only the dependencies actually used, so the app
  // can be deployed to shared hosting without uploading node_modules.
  output: "standalone",
  images: {
    // The Laravel API runs on localhost in dev, which resolves to a loopback
    // IP; Next's SSRF guard blocks that by default regardless of remotePatterns.
    dangerouslyAllowLocalIP: isDev,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "friedrichgrupo.online",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.friedrichgrupo.online",
        pathname: "/**",
      },
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
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      ...(isDev
        ? [
            {
              protocol: "http" as const,
              hostname: "localhost",
              port: "8002",
              pathname: "/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
