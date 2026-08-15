import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    DEBUG: process.env.DEBUG,
    APP_NAME: process.env.APP_NAME,
    REFRESH_TOKEN_MINUTES: process.env.REFRESH_TOKEN_MINUTES,
    API_END_POINT: process.env.API_END_POINT,
  },
};

export default nextConfig;
