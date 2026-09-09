import type { Metadata } from 'next'
import { Suspense } from 'react'
import { TrackContent } from '@/components/pages/track-content'

export const metadata: Metadata = {
  title: 'Track your TERRA order',
  description: 'Follow your order from the workshop to your door: ordered, in production, printing, shipped, delivered.',
  alternates: { canonical: '/track' },
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="container-terra py-16">…</div>}>
      <TrackContent />
    </Suspense>
  )
}
