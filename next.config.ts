import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

export default nextConfig;
