import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Disable standalone output for Netlify - let the plugin handle it
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  // Ensure proper asset prefix for Netlify
  trailingSlash: false,
};

export default nextConfig;
