import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['pdf-parse'],
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'img1.kakaocdn.net',
      't1.kakaocdn.net',
      'ssl.pstatic.net',
    ],
  },
};

export default nextConfig;
