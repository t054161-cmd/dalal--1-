/**
 * Organic section dividers — a soft hill and a clay ridge. Both are pure SVG,
 * both flip cleanly in RTL because they are symmetrical enough not to care.
 */

export function CurveDivider({
  className,
  flip = false,
  fill = 'rgb(var(--surface))',
}: {
  className?: string
  flip?: boolean
  fill?: string
}) {
  return (
    <div className={className} aria-hidden>
      <svg
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        className="block h-[40px] w-full sm:h-[64px]"
        style={{ transform: flip ? 'scaleY(-1)' : undefined }}
      >
        <path
          d="M0 40 C 240 4 420 62 720 40 C 1020 18 1220 60 1440 30 L1440 64 L0 64 Z"
          fill={fill}
        />
      </svg>
    </div>
  )
}

/** A leaf, used sparingly as an eco marker. */
export function LeafMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <path
        d="M20 4c0 8-5 13-13 13H4c0-8 5-13 13-13h3Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path d="M4 20c3-6 8-9 13-10" stroke="currentColor" strokeWidth="1.4" fill="none" />
    </svg>
  )
}

/** Soil layers, for the impact and about pages. */
export function SoilLayers({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 120" className={className} aria-hidden focusable="false">
      <path d="M0 26 C 70 12 120 34 180 24 C 240 14 280 30 320 22 L320 44 L0 44 Z" fill="rgb(var(--sage) / 0.55)" />
      <path d="M0 44 h320 v26 H0 z" fill="rgb(var(--clay) / 0.5)" />
      <path d="M0 70 h320 v22 H0 z" fill="rgb(var(--stone) / 0.55)" />
      <path d="M0 92 h320 v28 H0 z" fill="rgb(var(--bark) / 0.55)" />
      <g fill="none" stroke="rgb(var(--cream) / 0.5)" strokeWidth="1.2">
        <path d="M40 44 v40 M120 44 v30 M210 44 v46 M280 44 v26" />
      </g>
    </svg>
  )
}
