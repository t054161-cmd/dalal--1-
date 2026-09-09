import type { Metadata } from 'next'
import { GiftsContent } from '@/components/pages/gifts-content'

export const metadata: Metadata = {
  title: 'TERRA gifts & bulk orders',
  description:
    'Corporate gifting from 25 units: tiered pricing, your logo on recycled steel, seed-paper wrapping and handwritten cards.',
  alternates: { canonical: '/gifts' },
}

export default function GiftsPage() {
  return <GiftsContent />
}
