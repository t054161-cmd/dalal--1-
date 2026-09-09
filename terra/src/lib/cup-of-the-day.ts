/**
 * ============================================================================
 * CUP OF THE DAY — deterministic daily selection
 * ============================================================================
 * The featured design is a pure function of the visitor's LOCAL calendar date,
 * never of chance and never of the clock on our server. Two visitors in the
 * same timezone always see the same cup; the cup rolls over exactly at their
 * own local midnight.
 *
 * Because the answer depends on the client's clock, components must render a
 * neutral skeleton on the server and compute this after mount (see
 * useCupOfTheDay below) — otherwise React would hydrate with the server's day
 * and flash the wrong cup.
 * ============================================================================
 */

import * as React from 'react'
import { presets, type Preset } from '@/data/presets'

/** Fixed epoch. Never change it — it would shift every day's cup. */
export const EPOCH = new Date(2024, 0, 1) // 1 January 2024, local time

const DAY_MS = 24 * 60 * 60 * 1000

/** Local midnight for a given date. */
export function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/** Whole days between the epoch and `date`, in the visitor's own timezone. */
export function dayIndexFor(date: Date) {
  const epoch = startOfLocalDay(EPOCH).getTime()
  const day = startOfLocalDay(date).getTime()
  // Math.round absorbs the one-hour drift daylight-saving changes introduce.
  return Math.round((day - epoch) / DAY_MS)
}

/** The preset for a given local date. */
export function presetForDate(date: Date): Preset {
  const index = ((dayIndexFor(date) % presets.length) + presets.length) % presets.length
  return presets[index]
}

export function presetForOffset(offsetDays: number, from = new Date()): Preset {
  const d = startOfLocalDay(from)
  d.setDate(d.getDate() + offsetDays)
  return presetForDate(d)
}

/** Milliseconds until the next local midnight. */
export function msUntilLocalMidnight(from = new Date()) {
  const next = startOfLocalDay(from)
  next.setDate(next.getDate() + 1)
  return next.getTime() - from.getTime()
}

export function splitDuration(ms: number) {
  const clamped = Math.max(0, ms)
  const totalSeconds = Math.floor(clamped / 1000)
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Live Cup of the Day. Returns `null` for `today` until the component has
 * mounted, so the server and the first client render agree; the caller shows a
 * skeleton for that one frame.
 *
 * At local midnight the hook swaps to the next preset by itself — no reload,
 * and `justChanged` stays true for a moment so the UI can crossfade.
 */
export function useCupOfTheDay() {
  const [mounted, setMounted] = React.useState(false)
  const [today, setToday] = React.useState<Preset | null>(null)
  const [yesterday, setYesterday] = React.useState<Preset | null>(null)
  const [tomorrow, setTomorrow] = React.useState<Preset | null>(null)
  const [remaining, setRemaining] = React.useState(0)
  const [justChanged, setJustChanged] = React.useState(false)
  const dayRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    setMounted(true)

    const sync = (crossfade: boolean) => {
      const now = new Date()
      setToday(presetForDate(now))
      setYesterday(presetForOffset(-1, now))
      setTomorrow(presetForOffset(1, now))
      dayRef.current = dayIndexFor(now)
      if (crossfade) {
        setJustChanged(true)
        window.setTimeout(() => setJustChanged(false), 900)
      }
    }

    sync(false)

    // One interval drives both the countdown and the rollover, so the design
    // changes the same second the timer hits zero.
    const id = window.setInterval(() => {
      const now = new Date()
      setRemaining(msUntilLocalMidnight(now))
      if (dayRef.current !== null && dayIndexFor(now) !== dayRef.current) sync(true)
    }, 1000)

    setRemaining(msUntilLocalMidnight())
    return () => window.clearInterval(id)
  }, [])

  const parts = splitDuration(remaining)

  return {
    mounted,
    today,
    yesterday,
    tomorrow,
    remaining,
    justChanged,
    parts,
    formatted: `${pad(parts.hours)}:${pad(parts.minutes)}:${pad(parts.seconds)}`,
  }
}
