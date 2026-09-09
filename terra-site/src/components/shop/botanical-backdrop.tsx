'use client'

import { LeafBlade, scatter } from '@/components/common/botanical'

/**
 * ============================================================================
 * THE BOTANICAL SET
 * ============================================================================
 * What the cup is photographed against on the product page: leaves, thrown out
 * of focus, in three planes.
 *
 * The depth is arranged the way a real lens arranges it, which is the whole
 * trick — a uniform blur reads as a wallpaper, graded blur reads as a room:
 *
 *   FOREGROUND  a few big blades framing the very edges of the frame, blurred
 *               hardest (26px) because they are closest to the lens
 *   SUBJECT     nothing. This plane belongs to the cup, and `scatter`'s
 *               keepClear holds the leaves out of it
 *   MIDGROUND   blurred moderately (10px), the plane just behind the cup
 *   BACKGROUND  blurred soft and wide (17px), almost only colour
 *
 * A pool of light sits on the subject plane and a vignette closes the corners,
 * so the eye is walked to the middle of the frame and left there. The cup
 * itself is a WebGL canvas painted above all of this and is never blurred, so
 * it stays the one sharp object in the shot.
 *
 * The edges of the set dissolve rather than stopping at a rectangle: there is
 * a mask on the wrapper, because a hard border would turn a photograph into a
 * card, and this design does not use cards.
 * ============================================================================
 */

const BACK = scatter(0x2f5a, 13, { keepClear: 12, scale: 2.1 })
const MID = scatter(0x8b17, 9, { keepClear: 26, scale: 1.6 })
const FORE = scatter(0xc4e3, 5, { keepClear: 40, scale: 3.2 })

const leaf = (alpha: number) => `rgb(var(--bokeh-leaf) / calc(var(--bokeh-ink) * ${alpha}))`

/**
 * A long plateau, then a long ramp. The set has to be at full strength across
 * the whole frame and gone by the edge of the bleed, and the plateau is what
 * stops the middle of the shot from being quietly washed out by its own mask.
 */
const MASK =
  'radial-gradient(72% 70% at 50% 46%, #000 0%, #000 36%, rgb(0 0 0 / 0.6) 56%, rgb(0 0 0 / 0.16) 70%, transparent 80%)'

function Plane({
  sprigs,
  blur,
  alpha,
  animation,
}: {
  sprigs: ReturnType<typeof scatter>
  blur: number
  alpha: number
  animation: string
}) {
  return (
    <div
      className={`absolute inset-0 ${animation}`}
      style={{ filter: `blur(${blur}px)`, willChange: 'transform' }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        {sprigs.map((sprig, i) => (
          // Veins are pointless past about 12px of blur — they only cost paint.
          <LeafBlade key={i} sprig={sprig} fill={leaf(alpha)} veins={blur < 12} />
        ))}
      </svg>
    </div>
  )
}

export function BotanicalBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute overflow-hidden"
      style={{
        // The set bleeds well past the frame — asymmetrically, so it never
        // creeps under the column of type beside it — and the mask has gone
        // fully transparent long before the bleed runs out. Anything less and
        // the backdrop reads as a rectangular panel rather than a room.
        top: '-6rem',
        bottom: '-6rem',
        insetInlineStart: '-6rem',
        insetInlineEnd: '-2rem',
        maskImage: MASK,
        WebkitMaskImage: MASK,
      }}
    >
      {/* The wash the whole set sits in. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(162deg, rgb(var(--bokeh-wash) / calc(var(--bokeh-wash-ink) * 0.5)) 0%,' +
            ' rgb(var(--bokeh-wash) / var(--bokeh-wash-ink)) 58%,' +
            ' rgb(var(--bokeh-leaf) / calc(var(--bokeh-ink) * 0.7)) 100%)',
        }}
      />

      <Plane sprigs={BACK} blur={17} alpha={0.72} animation="animate-bokeh-b" />
      <Plane sprigs={MID} blur={10} alpha={1} animation="animate-bokeh-a" />

      {/* The light the cup stands in — on the subject plane, under the glass. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(31% 37% at 50% 46%, var(--viewer-glow) 0%, transparent 76%)',
        }}
      />

      {/* Foreground framing: closest to the lens, so the softest of all. */}
      <Plane sprigs={FORE} blur={26} alpha={1.25} animation="animate-bokeh-a" />

      {/* Close the corners so the middle of the frame is the brightest part. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(74% 68% at 50% 46%, transparent 44%, rgb(var(--canopy-shade) / var(--bokeh-vignette-ink)) 100%)',
        }}
      />
      <div className="absolute inset-0" style={{ backgroundImage: 'var(--grain)', opacity: 0.55 }} />
    </div>
  )
}
