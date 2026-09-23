/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.plnspttrs.net',
      },
      {
        protocol: 'https',
        hostname: '**.planespotters.net',
      },
    ],
  },
};

export default nextConfig;
