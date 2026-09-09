'use client'

import * as React from 'react'
import type { CupConfig, PatternId } from '@/types'
import { markFonts } from '@/data/product'
import { cn } from '@/lib/utils'

/**
 * The no-WebGL / reduced-motion preview, and the small preview used in cards,
 * the cart and checkout.
 *
 * Same silhouette as the 3D model — tall, straight-sided, softly rounded base,
 * flat lid a shade wider, one straight straw — and it takes the same config,
 * so colours, pattern, wordmark and the customer's mark all still apply.
 * Eight preset angles stand in for orbiting.
 */

export const ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]

/** Small motifs for the 2D stand-in of each pattern. */
function PatternDef({ id, pattern, color }: { id: string; pattern: PatternId; color: string }) {
  if (pattern === 'none') return null
  const common = { fill: 'none', stroke: color, strokeWidth: 1.1, strokeLinecap: 'round' as const }
  return (
    <pattern id={id} width={pattern === 'field' ? 14 : 26} height={pattern === 'field' ? 14 : 30} patternUnits="userSpaceOnUse">
      {pattern === 'olive' || pattern === 'sprig' ? (
        <g opacity="0.55">
          <path d="M13 3 v24" {...common} />
          {[7, 13, 19, 25].map((y, i) => (
            <g key={y}>
              <ellipse cx={i % 2 ? 17 : 9} cy={y} rx="3.6" ry="1.5" fill={color} opacity="0.75" transform={`rotate(${i % 2 ? -28 : 28} ${i % 2 ? 17 : 9} ${y})`} />
            </g>
          ))}
        </g>
      ) : null}
      {pattern === 'arch' ? (
        <g opacity="0.5">
          <path d="M5 26 V16 A8 8 0 0 1 21 16 V26" {...common} />
          <path d="M9 26 V17 A4 4 0 0 1 17 17 V26" {...common} />
        </g>
      ) : null}
      {pattern === 'field' ? (
        <g fill={color} opacity="0.5">
          <circle cx="4" cy="4" r="1.4" />
          <circle cx="10" cy="9" r="1.1" />
          <circle cx="3" cy="11" r="0.9" />
        </g>
      ) : null}
      {pattern === 'ridge' ? (
        <g opacity="0.45">
          <path d="M0 8 Q 6.5 3 13 8 T 26 8" {...common} />
          <path d="M0 20 Q 6.5 15 13 20 T 26 20" {...common} />
        </g>
      ) : null}
      {pattern === 'terrazzo' ? (
        <g fill={color} opacity="0.4">
          <path d="M4 5 l4 1 -1 4 -4 -1z" />
          <path d="M16 14 l5 2 -2 4 -4 -2z" />
          <path d="M9 22 l3 1 -1 3 -3 -1z" />
        </g>
      ) : null}
    </pattern>
  )
}

export function Tumbler2D({
  config,
  angleIndex = 0,
  className,
  showPrint = true,
}: {
  config: CupConfig
  angleIndex?: number
  className?: string
  showPrint?: boolean
}) {
  const uid = React.useId().replace(/:/g, '')
  const theta = ((ANGLES[angleIndex % ANGLES.length] ?? 0) * Math.PI) / 180
  const cos = Math.cos(theta)
  const sin = Math.sin(theta)

  // Geometry, matched to the 3D proportions (205 mm × 72 mm).
  const W = 200
  const H = 470
  const cx = W / 2
  const bodyTop = 104
  const bodyBottom = 430
  const bodyR = 38
  const lidR = 42
  const lidTop = 76
  const lidBottom = 106

  const bodyH = bodyBottom - bodyTop
  const face = Math.max(0.1, cos) // how much of the print faces us
  const printVisible = showPrint && face > 0.16

  const face3 = markFonts.find((f) => f.id === config.markFont) ?? markFonts[0]
  const mark = config.mark.trim()
  // Shrink long marks so they never run past the body.
  const markSize = mark.length > 10 ? 9 : mark.length > 6 ? 11 : 13

  const bodyPath = `M ${cx - bodyR} ${bodyTop}
    L ${cx - bodyR} ${bodyBottom - 22}
    Q ${cx - bodyR} ${bodyBottom} ${cx - bodyR + 22} ${bodyBottom}
    L ${cx + bodyR - 22} ${bodyBottom}
    Q ${cx + bodyR} ${bodyBottom} ${cx + bodyR} ${bodyBottom - 22}
    L ${cx + bodyR} ${bodyTop} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn(className)} role="img" aria-hidden="true" focusable="false">
      <defs>
        {/* Cylindrical shading over a solid fill. */}
        <linearGradient id={`shade-${uid}`} x1="0" x2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.16" />
          <stop offset="10%" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="26%" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="48%" stopColor="#fff" stopOpacity="0.03" />
          <stop offset="74%" stopColor="#000" stopOpacity="0.12" />
          <stop offset="93%" stopColor="#000" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id={`floor-${uid}`}>
          <stop offset="0%" stopColor="#2B342C" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2B342C" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`body-${uid}`}>
          <path d={bodyPath} />
        </clipPath>
        <PatternDef id={`pat-${uid}`} pattern={config.pattern} color={config.patternColor} />
      </defs>

      {/* Contact shadow */}
      <ellipse cx={cx} cy={bodyBottom + 8} rx={bodyR * 1.7} ry={7} fill={`url(#floor-${uid})`} />

      {/* Straw */}
      <rect
        x={cx - 3.4 + sin * 1.5}
        y={26}
        width={6.8}
        height={lidTop - 18}
        rx={3.4}
        fill={config.strawColor}
      />
      <rect
        x={cx - 3.4 + sin * 1.5}
        y={26}
        width={2.4}
        height={lidTop - 18}
        rx={1.2}
        fill="#fff"
        opacity="0.22"
      />

      {/* Body */}
      <path d={bodyPath} fill={config.bodyColor} />
      {config.pattern !== 'none' && printVisible ? (
        <g clipPath={`url(#body-${uid})`} opacity={face}>
          <rect x={cx - bodyR} y={bodyTop} width={bodyR * 2} height={bodyH} fill={`url(#pat-${uid})`} />
        </g>
      ) : null}
      <path d={bodyPath} fill={`url(#shade-${uid})`} />

      {/* Print: symbol, mark, wordmark — foreshortened by the angle */}
      {printVisible ? (
        <g
          opacity={0.35 + 0.65 * face}
          transform={`translate(${cx + bodyR * 0.5 * sin} 0) scale(${face} 1) translate(${-cx} 0)`}
        >
          {mark ? (
            <text
              x={cx}
              y={bodyTop + bodyH * 0.52}
              textAnchor="middle"
              fontFamily={`${face3.css}, sans-serif`}
              fontSize={markSize}
              fontWeight={face3.weight}
              letterSpacing={`${face3.tracking * markSize}px`}
              fill={config.markColor}
              direction={/[؀-ۿ]/.test(mark) ? 'rtl' : 'ltr'}
            >
              {mark}
            </text>
          ) : null}
          <text
            x={cx}
            y={bodyTop + bodyH * 0.71}
            textAnchor="middle"
            fontFamily="var(--font-display), sans-serif"
            fontSize="9"
            fontWeight="300"
            letterSpacing="3.6"
            fill={config.markColor}
            opacity="0.8"
          >
            TERRA
          </text>
        </g>
      ) : null}

      {/* Lid — a flat cylinder, slightly wider than the body */}
      <rect x={cx - lidR} y={lidTop} width={lidR * 2} height={lidBottom - lidTop} rx={7} fill={config.lidColor} />
      <rect x={cx - lidR} y={lidTop} width={lidR * 2} height={lidBottom - lidTop} rx={7} fill={`url(#shade-${uid})`} />
      {/* Collar around the straw */}
      <ellipse cx={cx + sin * 1.5} cy={lidTop + 3} rx={9} ry={3.4} fill={config.lidColor} />
      <ellipse cx={cx + sin * 1.5} cy={lidTop + 2} rx={9} ry={3.4} fill="#fff" opacity="0.14" />
      {/* The seam between lid and body */}
      <rect x={cx - bodyR} y={lidBottom - 1} width={bodyR * 2} height={1.4} fill="#000" opacity="0.16" />
    </svg>
  )
}
