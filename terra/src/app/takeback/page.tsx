import type { Metadata } from 'next'
import { TakebackContent } from '@/components/pages/takeback-content'

export const metadata: Metadata = {
  title: 'TERRA take-back programme',
  description: 'Send us your old cup — any brand, any condition. We recycle the steel and take 15% off your next TERRA.',
  alternates: { canonical: '/takeback' },
}

export default function TakebackPage() {
  return <TakebackContent />
}
