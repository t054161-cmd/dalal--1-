import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Designer } from '@/components/designer/designer'

export const metadata: Metadata = {
  title: 'Customize',
  description:
    'Describe the cup you want in a sentence, in Arabic or English, and watch it appear in 3D. Tones, botanical patterns, your initials, a symbol.',
  alternates: { canonical: '/customize' },
}

export default function Customize() {
  return (
    // useSearchParams needs a boundary while the page prerenders.
    <Suspense fallback={<div className="wrap py-40" />}>
      <Designer />
    </Suspense>
  )
}
