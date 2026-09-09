import type { Metadata } from 'next'
import { CartContent } from '@/components/pages/cart-content'

export const metadata: Metadata = {
  title: 'Your TERRA cart',
  description: 'Review your custom mugs, add gift wrapping, and check out as a guest.',
  alternates: { canonical: '/cart' },
  robots: { index: false, follow: true },
}

export default function CartPage() {
  return <CartContent />
}
