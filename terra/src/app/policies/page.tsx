import type { Metadata } from 'next'
import { PoliciesContent } from '@/components/pages/policies-content'

export const metadata: Metadata = {
  title: 'TERRA shipping & returns',
  description: 'Delivery times by region, the 14-day return window, the lifetime warranty and how refunds work.',
  alternates: { canonical: '/policies' },
}

export default function PoliciesPage() {
  return <PoliciesContent />
}
