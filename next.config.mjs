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
    // Exclude the src directory (Vite app) from being processed
    config.module.rules.push({
      test: /\.jsx?$/,
      include: /src/,
      use: 'ignore-loader',
    })
    return config
  },
  // Exclude src directory from page detection
  pageExtensions: ['tsx', 'ts'].concat(
    process.env.NODE_ENV === 'development' ? ['jsx', 'js'] : []
  ),
}

export default nextConfig
