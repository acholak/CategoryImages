import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'fal.media' },
      { hostname: 'storage.googleapis.com' },
    ],
  },
};

export default config;
