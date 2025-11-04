import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Enable standalone output for Docker deployments
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
};

export default nextConfig;
