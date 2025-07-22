/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Handle browser-only packages
    if (isServer) {
      config.externals.push({
        'lokijs': 'lokijs',
        'pino-pretty': 'pino-pretty',
      });
    }
    return config;
  },
}

export default nextConfig
