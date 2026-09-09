import type { Metadata } from 'next'
import { WishlistContent } from '@/components/pages/wishlist-content'

export const metadata: Metadata = {
  title: 'Your TERRA wishlist',
  description: 'Designs you saved for later.',
  alternates: { canonical: '/wishlist' },
  robots: { index: false, follow: true },
}

export default function WishlistPage() {
  return <WishlistContent />
}
