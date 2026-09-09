import type { Metadata } from 'next'
import { CupOfTheDay } from '@/components/cotd/cup-of-the-day'
import { PageHeader } from '@/components/home/section-heading'

export const metadata: Metadata = {
  title: 'Cup of the Day — a new TERRA design every midnight',
  description:
    'One curated TERRA design a day, with a today-only discount. It changes at midnight in your own timezone.',
  alternates: { canonical: '/cup-of-the-day' },
  openGraph: {
    title: "TERRA — today's cup",
    description: 'A new curated design every midnight, with a today-only discount.',
  },
}

export default function CupOfTheDayPage() {
  return (
    <>
      <PageHeader eyebrowKey="cotd.eyebrow" headingKey="cotd.heading" />
      <section className="container-terra pb-16">
        <CupOfTheDay variant="page" />
      </section>
    </>
  )
}
