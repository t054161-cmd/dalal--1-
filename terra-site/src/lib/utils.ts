import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

export const uid = (prefix = 'id') =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`

/** Linear interpolation, used by the scroll-linked animations. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
