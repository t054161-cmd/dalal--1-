import type { Metadata } from 'next'
import { CheckoutContent } from '@/components/pages/checkout-content'

export const metadata: Metadata = {
  title: 'Checkout — TERRA',
  description: 'Guest checkout on one screen: no account, no password, KNET and Apple Pay.',
  alternates: { canonical: '/checkout' },
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return <CheckoutContent />
}
