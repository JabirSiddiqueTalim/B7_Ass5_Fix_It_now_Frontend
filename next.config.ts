import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "example.com"
      },
      {
        hostname: "i.ibb.co.com"
      }
    ]
  },
};

export default nextConfig;
