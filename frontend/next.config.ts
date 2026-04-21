import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mengabaikan error HMR yang mengganggu di browser
  devIndicators: {
    appIsrStatus: false,
  },
  // Memaksa koneksi stabil ke localhost
  serverRuntimeConfig: {
    host: 'localhost',
    port: 3000,
  },
};

export default nextConfig;