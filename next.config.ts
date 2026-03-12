import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://pgthikana.in/api/:path*',
      },
    ];
  },
};

export default nextConfig;
