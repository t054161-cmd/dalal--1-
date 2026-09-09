import type { Metadata } from 'next'
import { RewardsContent } from '@/components/pages/rewards-content'

export const metadata: Metadata = {
  title: 'Soil Club — TERRA points, tiers and rewards',
  description:
    'Earn points on every order and on every cup you send back. Four tiers, a standing discount that never expires, and rewards you can actually use.',
  alternates: { canonical: '/rewards' },
}

export default function RewardsPage() {
  return <RewardsContent />
}
