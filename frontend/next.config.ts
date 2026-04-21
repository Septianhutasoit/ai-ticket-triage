import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;