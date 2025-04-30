import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'img1.kakaocdn.net',
      't1.kakaocdn.net',
    ],
  },
};

export default nextConfig;
