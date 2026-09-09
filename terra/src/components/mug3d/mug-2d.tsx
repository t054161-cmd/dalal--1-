'use client'

import * as React from 'react'
import { getBodyColor, getFont, getLidColor, getSize, getTextColor } from '@/data/product'
import { getAccessory } from '@/data/accessories'
import type { DesignConfig } from '@/types/design'

/**
 * The no-WebGL / reduced-motion preview.
 *
 * A hand-built SVG mug that takes the same design config as the 3D viewer, so
 * colours, text, font, placement and accessories all still apply. Eight preset
 * angles are simulated by foreshortening the engraving and swinging the handle
 * around the body — enough to judge a design without a GPU.
 */

export const PRESET_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]

/** Fractions of body height, measured from the rim — mirrors the 3D bands. */
const PLACEMENT_Y: Record<DesignConfig['placement'], number> = {
  center: 0.42,
  lower: 0.64,
  wrap: 0.46,
}

export function Mug2D({
  design,
  angleIndex = 0,
  className,
  showText = true,
}: {
  design: DesignConfig
  angleIndex?: number
  className?: string
  showText?: boolean
}) {
  const size = getSize(design.sizeId)
  const body = getBodyColor(design.bodyColorId)
  const lid = getLidColor(design.lidColorId)
  const textColor = getTextColor(design.textColorId)
  const font = getFont(design.fontId)

  const theta = ((PRESET_ANGLES[angleIndex % PRESET_ANGLES.length] ?? 0) * Math.PI) / 180
  const cos = Math.cos(theta)
  const sin = Math.sin(theta)

  // Canvas is 200 wide; the mug is drawn to the proportions of the real size.
  const W = 200
  const H = 320
  const bodyH = (size.heightMm / 215) * 250
  const topR = (size.diameterMm / 84) * 52
  const bottomR = topR * 0.9
  const cx = W / 2
  const baseY = H - 24
  const topY = baseY - bodyH

  const uid = React.useId().replace(/:/g, '')
  const textVisible = showText && design.text.trim().length > 0 && cos > 0.12
  const textY = topY + bodyH * PLACEMENT_Y[design.placement]

  const hasSleeve = design.accessories.some((id) => getAccessory(id)?.render === 'sleeve')
  const hasChain = design.accessories.some((id) => getAccessory(id)?.render === 'chain')
  const showHandle = design.handle && design.sizeId !== '350'

  const fontScale = { sm: 0.72, md: 1, lg: 1.28 }[design.textSize]
  // Shrink to fit the printable arc, the way the real engraving does — long
  // text gets smaller rather than running off the body.
  const arcLength = topR * 1.84
  const requested = 20 * fontScale * font.scale
  const estimated = Math.max(1, design.text.trim().length) * requested * 0.56
  const fontSize = Math.max(7, estimated > arcLength ? requested * (arcLength / estimated) : requested)

  const handleX = cx + topR * 0.95 * cos
  const handleBehind = sin > 0

  // One tapered silhouette, reused for the fill, the shading and the clip.
  const bodyPath = `M ${cx - bottomR} ${baseY - 6}
      L ${cx - topR} ${topY}
      L ${cx + topR} ${topY}
      L ${cx + bottomR} ${baseY - 6}
      Q ${cx} ${baseY + 9} ${cx - bottomR} ${baseY - 6} Z`

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Cylindrical shading, painted OVER a solid body fill: a highlight
            on the upper left, a core shadow on the right, and a thin bounce
            light at the very edge. */}
        <linearGradient id={`shade-${uid}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.18" />
          <stop offset="9%" stopColor="#ffffff" stopOpacity="0.10" />
          <stop offset="24%" stopColor="#ffffff" stopOpacity="0.34" />
          <stop offset="46%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="72%" stopColor="#000000" stopOpacity="0.14" />
          <stop offset="92%" stopColor="#000000" stopOpacity="0.26" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id={`lid-${uid}`} x1="0" x2="1">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.12" />
          <stop offset="26%" stopColor="#ffffff" stopOpacity="0.26" />
          <stop offset="62%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
        </linearGradient>
        <radialGradient id={`shadow-${uid}`}>
          <stop offset="0%" stopColor="#3E3229" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#3E3229" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`clip-${uid}`}>
          <path d={bodyPath} />
        </clipPath>
        <path
          id={`arc-${uid}`}
          d={`M ${cx - topR * 0.92} ${textY} Q ${cx} ${textY + 7} ${cx + topR * 0.92} ${textY}`}
          fill="none"
        />
      </defs>

      {/* Contact shadow */}
      <ellipse cx={cx} cy={baseY + 10} rx={topR * 1.5} ry={9} fill={`url(#shadow-${uid})`} />

      {/* Handle behind the body */}
      {showHandle && handleBehind ? (
        <path
          d={`M ${handleX} ${topY + bodyH * 0.3} q ${28 * (cos >= 0 ? 1 : -1)} ${bodyH * 0.1} 0 ${bodyH * 0.28}`}
          fill="none"
          stroke={body.hex}
          strokeWidth={9}
          strokeLinecap="round"
          opacity={0.55}
        />
      ) : null}

      {/* Body: solid colour first, then the shading pass on top. */}
      <path d={bodyPath} fill={body.hex} />
      <path d={bodyPath} fill={`url(#shade-${uid})`} />
      {/* Base fillet */}
      <ellipse cx={cx} cy={baseY - 6} rx={bottomR * 0.98} ry={7} fill="#000" opacity="0.14" />

      {/* Cork sleeve accessory */}
      {hasSleeve ? (
        <g clipPath={`url(#clip-${uid})`}>
          <rect
            x={cx - topR - 2}
            y={topY + bodyH * 0.72}
            width={topR * 2 + 4}
            height={bodyH * 0.22}
            fill={getAccessory('holder')?.hex ?? '#C79A62'}
          />
          <rect
            x={cx - topR - 2}
            y={topY + bodyH * 0.72}
            width={topR * 2 + 4}
            height={bodyH * 0.22}
            fill={`url(#shade-${uid})`}
          />
        </g>
      ) : null}

      {/* Engraved text, foreshortened by the viewing angle */}
      {textVisible ? (
        <g
          opacity={0.35 + 0.65 * cos}
          transform={`translate(${cx + topR * 0.55 * sin} 0) scale(${Math.max(0.15, cos)} 1) translate(${-cx} 0)`}
          style={{ transformOrigin: 'center' }}
        >
          <text
            fontFamily={`var(${font.cssVar}), sans-serif`}
            fontWeight={font.weight}
            fontSize={fontSize}
            fill={textColor.hex}
            direction={/[؀-ۿ]/.test(design.text) ? 'rtl' : 'ltr'}
          >
            <textPath href={`#arc-${uid}`} startOffset="50%" textAnchor="middle">
              {design.text}
            </textPath>
          </text>
        </g>
      ) : null}

      {/* Rim, then the lid sitting on it with a slight overhang. */}
      <ellipse cx={cx} cy={topY + 1} rx={topR} ry={8} fill={body.hex} />
      <ellipse cx={cx} cy={topY + 1} rx={topR} ry={8} fill="#000" opacity="0.22" />
      <g>
        <rect
          x={cx - topR - 3}
          y={topY - 12}
          width={topR * 2 + 6}
          height={17}
          rx={7}
          fill={lid.hex}
        />
        <rect
          x={cx - topR - 3}
          y={topY - 12}
          width={topR * 2 + 6}
          height={17}
          rx={7}
          fill={`url(#lid-${uid})`}
        />
        <ellipse cx={cx} cy={topY - 12} rx={topR + 3} ry={7} fill={lid.hex} />
        <ellipse cx={cx} cy={topY - 13} rx={topR + 3} ry={7} fill="#fff" opacity="0.16" />
      </g>

      {/* Carry chain accessory */}
      {hasChain ? (
        <g stroke="#A9AEB2" strokeWidth={3} fill="none" strokeLinecap="round">
          <circle cx={cx + topR * 0.5} cy={topY - 18} r={5} />
          <path
            d={`M ${cx + topR * 0.5} ${topY - 13} q 10 22 26 8`}
            strokeDasharray="3 4"
          />
        </g>
      ) : null}

      {/* Handle in front of the body */}
      {showHandle && !handleBehind ? (
        <path
          d={`M ${handleX} ${topY + bodyH * 0.3} q ${30 * (cos >= 0 ? 1 : -1)} ${bodyH * 0.1} 0 ${bodyH * 0.28}`}
          fill="none"
          stroke={body.hex}
          strokeWidth={10}
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  )
}
