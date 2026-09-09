import type { Metadata } from 'next'
import { SubscribeContent } from '@/components/pages/subscribe-content'

export const metadata: Metadata = {
  title: 'TERRA refills — lids, seals & brushes',
  description: 'Replacement bamboo lids, seal rings and cleaning brushes, delivered every 3, 6 or 12 months in a paper envelope.',
  alternates: { canonical: '/subscribe' },
}

export default function SubscribePage() {
  return <SubscribeContent />
}
