import type { Metadata } from 'next'
import { AboutContent } from '@/components/pages/about-content'

export const metadata: Metadata = {
  title: 'About TERRA — our name, and why we started',
  description:
    'TERRA is Latin for earth, land and soil — the root of terrain, terracotta and terrestrial. Why we chose the name, why we started, and how a TERRA is made.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About TERRA — from the earth, for the earth',
    description: 'A small workshop in Kuwait making one thing properly: a mug you keep.',
  },
}

export default function AboutPage() {
  return <AboutContent />
}
