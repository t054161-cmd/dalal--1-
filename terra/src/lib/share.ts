/**
 * Encode a design into a URL query string and back, so "Share design via link"
 * produces a URL that opens the exact mug in 3D for anyone.
 *
 * The encoding is human-readable on purpose (short keys, plain values) — a
 * support agent can read a shared link and know what the customer configured.
 *
 *   /customize?s=500&b=clay&l=bamboo&t=Layla&f=caveat&c=cream&z=md&p=center&h=1&a=holder.chain
 */

import { defaultDesign, MAX_TEXT_LENGTH } from '@/data/product'
import type { DesignConfig, Placement, SizeId, TextSize } from '@/types/design'

const KEYS = {
  sizeId: 's',
  bodyColorId: 'b',
  lidColorId: 'l',
  text: 't',
  fontId: 'f',
  textColorId: 'c',
  textSize: 'z',
  placement: 'p',
  handle: 'h',
  accessories: 'a',
  presetId: 'k',
  discountPercent: 'd',
} as const

export function encodeDesign(design: DesignConfig): string {
  const params = new URLSearchParams()
  params.set(KEYS.sizeId, design.sizeId)
  params.set(KEYS.bodyColorId, design.bodyColorId)
  params.set(KEYS.lidColorId, design.lidColorId)
  if (design.text) params.set(KEYS.text, design.text)
  params.set(KEYS.fontId, design.fontId)
  params.set(KEYS.textColorId, design.textColorId)
  params.set(KEYS.textSize, design.textSize)
  params.set(KEYS.placement, design.placement)
  params.set(KEYS.handle, design.handle ? '1' : '0')
  if (design.accessories.length) params.set(KEYS.accessories, design.accessories.join('.'))
  if (design.presetId) params.set(KEYS.presetId, design.presetId)
  if (design.discountPercent) params.set(KEYS.discountPercent, String(design.discountPercent))
  return params.toString()
}

const sizeIds: SizeId[] = ['350', '500', '700']
const placementIds: Placement[] = ['center', 'lower', 'wrap']
const textSizeIds: TextSize[] = ['sm', 'md', 'lg']

/** Returns null when the query carries no design at all. */
export function decodeDesign(params: URLSearchParams): DesignConfig | null {
  const has = Object.values(KEYS).some((k) => params.has(k))
  if (!has) return null

  const pickFrom = <T extends string>(key: string, allowed: T[], fallback: T): T => {
    const value = params.get(key)
    return value && (allowed as string[]).includes(value) ? (value as T) : fallback
  }

  return {
    sizeId: pickFrom(KEYS.sizeId, sizeIds, defaultDesign.sizeId),
    bodyColorId: params.get(KEYS.bodyColorId) ?? defaultDesign.bodyColorId,
    lidColorId: params.get(KEYS.lidColorId) ?? defaultDesign.lidColorId,
    text: (params.get(KEYS.text) ?? '').slice(0, MAX_TEXT_LENGTH),
    fontId: params.get(KEYS.fontId) ?? defaultDesign.fontId,
    textColorId: params.get(KEYS.textColorId) ?? defaultDesign.textColorId,
    textSize: pickFrom(KEYS.textSize, textSizeIds, defaultDesign.textSize),
    placement: pickFrom(KEYS.placement, placementIds, defaultDesign.placement),
    handle: params.get(KEYS.handle) === '1',
    accessories: (params.get(KEYS.accessories) ?? '').split('.').filter(Boolean),
    presetId: params.get(KEYS.presetId) ?? undefined,
    discountPercent: params.get(KEYS.discountPercent)
      ? Number(params.get(KEYS.discountPercent))
      : undefined,
  }
}

export function shareUrl(design: DesignConfig, origin?: string) {
  const base = origin ?? (typeof window !== 'undefined' ? window.location.origin : 'https://terra.example')
  return `${base}/customize?${encodeDesign(design)}`
}
