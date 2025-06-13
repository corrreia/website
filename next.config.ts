import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless', // Changed from 'require-corp' to allow external images
          },
        ],
      },
    ];
  },
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
