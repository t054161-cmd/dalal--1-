'use client'

import * as React from 'react'
import { useReducedMotion } from '@/lib/hooks'
import { LeafBlade, scatter } from './botanical'

/**
 * ============================================================================
 * THE AMBIENT CANOPY
 * ============================================================================
 * The layer behind every page. Three depths of leaves, a shaft of light that
 * crosses the frame over about a minute and a half, and shade pooling at the
 * foot of the screen.
 *
 * Three rules keep it from becoming wallpaper that fights the content:
 *
 *  1. It is *slow*. The fastest thing here takes 58 seconds to complete one
 *     pass. Nothing should ever be caught moving — it should only ever turn
 *     out to have moved.
 *  2. It is *faint*. Opacity comes from the --canopy-* tokens, around 5% in
 *     light and 6% in dark, and it is drawn beneath the type rather than
 *     around it: `scatter` holds every leaf out of the middle of the frame.
 *  3. It is *fixed*. Scrolling moves the page across the garden rather than
 *     dragging the garden along, and one very shallow parallax offset
 *     separates the three depths as it goes.
 *
 * Dark mode is not this image inverted: the tokens make the leaves lighter
 * than the ground and turn the sun into moonlight, so it reads as the same
 * garden at night.
 * ============================================================================
 */

const FAR = scatter(0x7e11, 15, { keepClear: 21, scale: 1.35 })
const MID = scatter(0x4a3d, 11, { keepClear: 27, scale: 1 })
const NEAR = scatter(0x91c2, 6, { keepClear: 33, scale: 0.78 })

/** rgb(var(--canopy-leaf) / a·ink) — one place for the token maths. */
const leaf = (alpha: number) => `rgb(var(--canopy-leaf) / calc(var(--canopy-ink) * ${alpha}))`

function Layer({
  sprigs,
  blur,
  alpha,
  animation,
  depth,
  shift,
}: {
  sprigs: ReturnType<typeof scatter>
  blur: number
  alpha: number
  animation: string
  depth: number
  shift: number
}) {
  return (
    // Two elements on purpose: the outer one carries the scroll parallax and
    // the inner one the sway, because a CSS animation on `transform` would
    // otherwise overwrite whatever the scroll handler had written.
    <div
      className="canopy-layer"
      style={{ transform: `translate3d(0, ${(shift * depth).toFixed(1)}px, 0)` }}
    >
      {/* will-change keeps the blurred layer rasterised once and moved by the
          compositor, instead of re-blurring a full-viewport SVG every frame. */}
      <div
        className={`h-full w-full ${animation}`}
        style={{ filter: `blur(${blur}px)`, willChange: 'transform' }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
          aria-hidden
        >
          {sprigs.map((sprig, i) => (
            <LeafBlade key={i} sprig={sprig} fill={leaf(alpha)} veins={blur < 6} />
          ))}
        </svg>
      </div>
    </div>
  )
}

export function AmbientCanopy() {
  const reduced = useReducedMotion()
  const [shift, setShift] = React.useState(0)

  // Very shallow parallax, rAF-throttled, and skipped entirely for readers who
  // asked for less motion.
  React.useEffect(() => {
    if (reduced) return
    let frame = 0
    const read = () => {
      frame = 0
      setShift(window.scrollY)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [reduced])

  return (
    <div className="canopy" aria-hidden>
      <Layer sprigs={FAR} blur={9} alpha={0.8} animation="animate-drift-far" depth={-0.012} shift={shift} />
      <Layer sprigs={MID} blur={4} alpha={1} animation="animate-drift-mid" depth={-0.026} shift={shift} />
      <Layer sprigs={NEAR} blur={1.2} alpha={1.15} animation="animate-drift-near" depth={-0.045} shift={shift} />

      {/* Sunlight crossing the frame. */}
      <div
        className="absolute inset-0 animate-sun-wash"
        style={{
          background:
            'radial-gradient(42% 34% at 18% 8%, rgb(var(--canopy-sun) / calc(var(--canopy-sun-ink) * 0.5)), transparent 70%),' +
            'radial-gradient(34% 28% at 82% 22%, rgb(var(--canopy-sun) / calc(var(--canopy-sun-ink) * 0.32)), transparent 72%)',
        }}
      />

      {/* Shade pooling along the bottom edge, so the page sits on something. */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/5"
        style={{
          background:
            'radial-gradient(70% 100% at 50% 100%, rgb(var(--canopy-shade) / var(--canopy-shade-ink)), transparent 72%)',
        }}
      />
    </div>
  )
}
