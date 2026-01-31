/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use proto folder as the source directory
  // Next.js 16 uses app directory by default

  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  },

  // Rewrites for API proxy during development
  async rewrites() {
    return [
      // Proxy /api requests to backend during local development
      // Comment out in production when using separate backend URL
      // {
      //   source: '/api/:path*',
      //   destination: 'http://localhost:8080/api/:path*',
      // },
    ];
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
