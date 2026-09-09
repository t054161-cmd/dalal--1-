import type { Metadata } from 'next'
import { FaqContent } from '@/components/pages/faq-content'

export const metadata: Metadata = {
  title: 'TERRA — frequently asked questions',
  description:
    'Insulation, Arabic engraving, care, delivery times, returns, the lifetime warranty and the take-back programme.',
  alternates: { canonical: '/faq' },
}

export default function FaqPage() {
  return <FaqContent />
}
