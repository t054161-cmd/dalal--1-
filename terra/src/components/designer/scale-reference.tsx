'use client'

import { getSize } from '@/data/product'
import { useI18n } from '@/i18n/provider'
import type { SizeId } from '@/types/design'

/**
 * Visual scale: the mug next to an espresso cup and an open hand, all drawn
 * to the same millimetre scale so the comparison is honest.
 */
export function ScaleReference({ sizeId }: { sizeId: SizeId }) {
  const { t, n } = useI18n()
  const size = getSize(sizeId)

  const SCALE = 0.42 // px per mm
  const mugH = size.heightMm * SCALE
  const mugW = size.diameterMm * SCALE
  const espressoH = 62 * SCALE
  const espressoW = 58 * SCALE
  const handH = 185 * SCALE

  const baseline = 96

  return (
    <svg
      viewBox="0 0 220 110"
      className="h-28 w-full"
      role="img"
      aria-label={t('designer.step1.scaleAlt', { volume: n(size.volumeMl) })}
    >
      {/* ground line */}
      <line x1="6" y1={baseline} x2="214" y2={baseline} stroke="rgb(var(--line))" strokeWidth="1" />

      {/* espresso cup */}
      <g>
        <path
          d={`M 18 ${baseline} L 22 ${baseline - espressoH} L ${22 + espressoW} ${baseline - espressoH} L ${18 + espressoW + 4} ${baseline} Z`}
          fill="rgb(var(--stone) / 0.55)"
        />
        <path
          d={`M ${22 + espressoW} ${baseline - espressoH + 6} q 10 6 0 14`}
          stroke="rgb(var(--stone))"
          strokeWidth="2.5"
          fill="none"
        />
        <text x="20" y={baseline + 11} fontSize="6" fill="rgb(var(--ink-mute))">
          espresso
        </text>
      </g>

      {/* the mug */}
      <g>
        <rect
          x={78}
          y={baseline - mugH}
          width={mugW}
          height={mugH}
          rx={mugW * 0.18}
          fill="rgb(var(--clay))"
        />
        <rect
          x={76}
          y={baseline - mugH - 5}
          width={mugW + 4}
          height={6}
          rx={3}
          fill="rgb(var(--sand))"
        />
        <text x={78} y={baseline + 11} fontSize="6" fill="rgb(var(--ink-mute))">
          {n(size.volumeMl)} ml
        </text>
      </g>

      {/* open hand, drawn as a palm with four fingers */}
      <g transform={`translate(150 ${baseline - handH})`} fill="rgb(var(--sand))" stroke="rgb(var(--stone))" strokeWidth="0.8">
        <rect x="8" y={handH * 0.42} width="34" height={handH * 0.58} rx="12" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={10 + i * 8} y={handH * 0.1 + i * 2} width="6.5" height={handH * 0.38} rx="3" />
        ))}
        <rect x="0" y={handH * 0.5} width="10" height={handH * 0.3} rx="5" transform="rotate(-18 5 50)" />
      </g>

      <text x="150" y={baseline + 11} fontSize="6" fill="rgb(var(--ink-mute))">
        hand
      </text>
    </svg>
  )
}
