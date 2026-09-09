import type { Metadata } from 'next'
import { Checkout } from '@/components/pages/checkout'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Guest checkout — one screen, no account.',
  alternates: { canonical: '/checkout' },
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return <Checkout />
}
