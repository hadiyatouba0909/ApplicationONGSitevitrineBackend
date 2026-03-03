/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        // Backend déployé sur Render
        protocol: 'https',
        hostname: '**.onrender.com',
        pathname: '/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;
