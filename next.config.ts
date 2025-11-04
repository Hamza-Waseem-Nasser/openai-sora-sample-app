import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Disable standalone output for Netlify - let the plugin handle it
  output: process.env.NETLIFY === 'true' ? undefined : (process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined),
  // Ensure proper asset prefix handling
  assetPrefix: undefined,
  // Optimize for production
  poweredByHeader: false,
};

export default nextConfig;
