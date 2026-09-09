import { Hero } from '@/components/hero/hero'
import { Manifesto, Packaging, ClosingCta } from '@/components/sections/story-blocks'
import { Anatomy, ProductReveal } from '@/components/sections/product-reveal'
import { Tones } from '@/components/sections/tones'
import { DesignerTeaser } from '@/components/sections/designer-teaser'
import { Sustainability } from '@/components/sections/sustainability'
import { Ritual } from '@/components/sections/ritual'
import { Community } from '@/components/sections/community'

/**
 * The journey, in order:
 *   enter → the idea → the object → inside it → the tones →
 *   design yours → why it exists → the ritual → the box → the community
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <ProductReveal />
      <Anatomy />
      <Tones />
      <DesignerTeaser />
      <Sustainability />
      <Ritual />
      <Packaging />
      <Community />
      <ClosingCta />
    </>
  )
}
