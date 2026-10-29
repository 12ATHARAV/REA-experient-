import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/chat/chat_fetch.php',
        destination: '/api/chat/fetch',
      },
      {
        source: '/chat/chat_send.php',
        destination: '/api/chat/send',
      },
    ];
  },
};

export default nextConfig;
