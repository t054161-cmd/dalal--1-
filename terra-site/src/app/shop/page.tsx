import type { Metadata } from 'next'
import { ProductPage } from '@/components/shop/product'

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'The TERRA tumbler in nine earth tones — Linen, Sage, Sandi, Forest, Smoked green, Putty, Terracotta, Ochre and Bark. 500 ml, recycled stainless steel, leak-resistant lid, reusable straw.',
  alternates: { canonical: '/shop' },
}

export default function Shop() {
  return <ProductPage />
}
