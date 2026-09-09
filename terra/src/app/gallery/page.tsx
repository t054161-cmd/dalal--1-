import type { Metadata } from 'next'
import { GalleryContent } from '@/components/pages/gallery-content'

export const metadata: Metadata = {
  title: 'TERRA community gallery',
  description: 'Customer designs, votes, and the Design of the Month — produced as a limited run.',
  alternates: { canonical: '/gallery' },
}

export default function GalleryPage() {
  return <GalleryContent />
}
