import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Menghilangkan pesan error HMR yang mengganggu
  devIndicators: {
    appIsrStatus: false,
  },
  // Menambahkan izin host sesuai saran error terminal Anda
  experimental: {
    allowedDevOrigins: ['127.0.0.1', 'localhost', '169.254.28.69']
  }
};

export default nextConfig;