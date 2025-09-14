/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs']
  },
  typescript: {
    // Temporarily ignore build errors during development
    ignoreBuildErrors: false,
  },
  eslint: {
    // Temporarily ignore lint errors during development
    ignoreDuringBuilds: false,
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig