import type { Metadata } from 'next'
import { ImpactContent } from '@/components/pages/impact-content'

export const metadata: Metadata = {
  title: 'TERRA impact — the numbers behind the claims',
  description:
    'What TERRA is made of by weight, the product lifecycle, the take-back programme, and a calculator for the cups your own mug replaces.',
  alternates: { canonical: '/impact' },
}

export default function ImpactPage() {
  return <ImpactContent />
}
