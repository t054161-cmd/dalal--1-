import type { Metadata } from 'next'
import { ShopContent } from '@/components/pages/shop-content'

export const metadata: Metadata = {
  title: 'Ready-made TERRA designs',
  description:
    'Curated TERRA mugs, ready to order — filter by colour, size and occasion, or open any design in the 3D designer and make it yours.',
  alternates: { canonical: '/shop' },
}

export default function ShopPage() {
  return <ShopContent />
}
