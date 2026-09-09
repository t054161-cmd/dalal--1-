import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Designer } from '@/components/designer/designer'
import { ViewerSkeleton } from '@/components/mug3d/viewer-skeleton'

export const metadata: Metadata = {
  title: 'Design your TERRA — 3D mug designer',
  description:
    'Pick a size, colours, your own text in Arabic or English, and watch it appear on a real 3D mug. Save, share or order your design.',
  alternates: { canonical: '/customize' },
  openGraph: {
    title: 'Design your TERRA',
    description: 'Your colours, your words, on a mug you keep for life.',
  },
}

export default function CustomizePage() {
  return (
    // useSearchParams needs a Suspense boundary during prerendering.
    <Suspense
      fallback={
        <div className="container-terra py-16">
          <div className="h-[30rem]">
            <ViewerSkeleton />
          </div>
        </div>
      }
    >
      <Designer />
    </Suspense>
  )
}
