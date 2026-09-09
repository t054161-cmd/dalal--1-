import type { Metadata } from 'next'
import { CupOfTheDay } from '@/components/cotd/cup-of-the-day'
import { FaqAccordion } from '@/components/common/faq-accordion'
import { CurveDivider } from '@/components/common/dividers'
import { Quiz } from '@/components/home/quiz'
import {
  FeatureCards,
  FinalCta,
  GalleryStrip,
  Hero,
  ImpactCounter,
  Reviews,
  TemperatureProof,
  TrustStrip,
} from '@/components/home/sections'
import { faqs } from '@/data/content'
import { SectionHeading } from '@/components/home/section-heading'

export const metadata: Metadata = {
  title: 'TERRA — the mug made from the earth, made yours',
  description:
    'A reusable, customizable, double-wall insulated mug in recycled stainless steel. Hot 12 hours, cold 24. Design yours in 3D, in Arabic or English.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  const featuredFaqs = faqs.filter((f) => f.featured)

  return (
    <>
      <Hero />
      <TrustStrip />

      {/* Cup of the Day ------------------------------------------------- */}
      <section className="section container-terra" id="cup-of-the-day">
        <CupOfTheDay variant="section" />
      </section>

      <CurveDivider fill="rgb(var(--surface-raised))" />
      <div className="bg-surface-raised">
        <FeatureCards />
      </div>
      <CurveDivider flip fill="rgb(var(--surface-raised))" />

      <TemperatureProof />
      <ImpactCounter />
      <GalleryStrip />
      <Quiz />
      <Reviews />

      {/* Short FAQ ------------------------------------------------------ */}
      <section className="section container-terra">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr]">
          <SectionHeading
            eyebrowKey="home.faq.eyebrow"
            headingKey="home.faq.heading"
            ctaKey="home.faq.cta"
            ctaHref="/faq"
          />
          <FaqAccordion items={featuredFaqs} />
        </div>
      </section>

      <FinalCta />
    </>
  )
}
