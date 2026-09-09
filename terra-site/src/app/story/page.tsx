import type { Metadata } from 'next'
import { Story } from '@/components/pages/story'

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    'TERRA is Latin for earth. Why we chose the name, why we started with one object, how it is made, and what we promise.',
  alternates: { canonical: '/story' },
}

export default function StoryPage() {
  return <Story />
}
