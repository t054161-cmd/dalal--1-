/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Placeholder art ships as SVG in /public/images. Swap for real photography later.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'inline',
    formats: ['image/avif', 'image/webp'],
  },
  // three.js ships untranspiled ESM examples; Next handles it, but keep the
  // 3D bundle out of the server graph where possible.
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
