import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const withMDX = createMDX({
  // Plugins passed as string names so they are serializable for Turbopack.
  options: {
    remarkPlugins: [['remark-gfm']],
    rehypePlugins: [],
  },
})

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', 'three'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default withMDX(nextConfig)
