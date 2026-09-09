import type { Metadata } from 'next'
import { Cart } from '@/components/pages/cart'

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Your TERRA cart.',
  alternates: { canonical: '/cart' },
  robots: { index: false, follow: true },
}

export default function CartPage() {
  return <Cart />
}
