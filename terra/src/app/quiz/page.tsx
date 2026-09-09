import type { Metadata } from 'next'
import { Quiz } from '@/components/home/quiz'

export const metadata: Metadata = {
  title: 'Which TERRA is yours?',
  description: 'Three questions and a recommended starting design you can order as-is or make your own.',
  alternates: { canonical: '/quiz' },
}

export default function QuizPage() {
  return <Quiz />
}
