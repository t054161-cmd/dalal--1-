/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Placeholder art ships as SVG; swap for photography later.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'inline',
    formats: ['image/avif', 'image/webp'],
  },
  experimental: { optimizePackageImports: ['lucide-react'] },
}
export default nextConfig
