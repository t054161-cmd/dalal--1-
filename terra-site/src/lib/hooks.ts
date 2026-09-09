'use client'

import * as React from 'react'

/** True once mounted on the client. */
export function useHydrated() {
  const [hydrated, setHydrated] = React.useState(false)
  React.useEffect(() => setHydrated(true), [])
  return hydrated
}

/** Live prefers-reduced-motion, so the setting can change without a reload. */
export function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(q.matches)
    const on = (e: MediaQueryListEvent) => setReduced(e.matches)
    q.addEventListener('change', on)
    return () => q.removeEventListener('change', on)
  }, [])
  return reduced
}

/** Feature-detect WebGL once. `null` while undetermined. */
export function useWebGL() {
  const [ok, setOk] = React.useState<boolean | null>(null)
  React.useEffect(() => {
    try {
      const c = document.createElement('canvas')
      setOk(Boolean(c.getContext('webgl2') ?? c.getContext('webgl')))
    } catch {
      setOk(false)
    }
  }, [])
  return ok
}

/** Fires once when an element scrolls into view. */
export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = React.useRef<T | null>(null)
  const [inView, setInView] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  return [ref, inView] as const
}

/**
 * 0 → 1 progress of an element through the viewport, on rAF.
 * Used for scroll-linked rotation and parallax; it never runs while the
 * element is off screen.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null)
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    let active = false

    const measure = () => {
      const rect = el.getBoundingClientRect()
      const span = rect.height + window.innerHeight
      const raw = (window.innerHeight - rect.top) / span
      setProgress(Math.min(1, Math.max(0, raw)))
      frame = active ? requestAnimationFrame(measure) : 0
    }

    const io = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting
      if (active && !frame) frame = requestAnimationFrame(measure)
    })
    io.observe(el)

    return () => {
      io.disconnect()
      if (frame) cancelAnimationFrame(frame)
      active = false
    }
  }, [])

  return [ref, progress] as const
}

/**
 * True while an element is anywhere near the viewport. Used to mount the 3D
 * canvases only around the section that needs one — a page with four viewers
 * would otherwise hold four live WebGL contexts at once.
 */
export function useNearViewport<T extends HTMLElement>(margin = '300px') {
  const ref = React.useRef<T | null>(null)
  const [near, setNear] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true)
      return
    }
    const io = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      rootMargin: margin,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [margin])

  return [ref, near] as const
}

/** A one-time flag per browser — for the "drag to turn" hint. */
export function useOnceFlag(key: string) {
  const storageKey = `terra.seen.${key}`
  const [seen, setSeen] = React.useState(true)

  React.useEffect(() => {
    try {
      setSeen(window.localStorage.getItem(storageKey) === '1')
    } catch {
      setSeen(false)
    }
  }, [storageKey])

  const mark = React.useCallback(() => {
    setSeen(true)
    try {
      window.localStorage.setItem(storageKey, '1')
    } catch {
      /* ignore */
    }
  }, [storageKey])

  return [seen, mark] as const
}

/** Copy to clipboard with a short-lived confirmation. */
export function useCopy(timeout = 2000) {
  const [copied, setCopied] = React.useState(false)
  const copy = React.useCallback(
    async (value: string) => {
      try {
        await navigator.clipboard.writeText(value)
      } catch {
        /* the field stays selectable */
      }
      setCopied(true)
      window.setTimeout(() => setCopied(false), timeout)
    },
    [timeout],
  )
  return [copied, copy] as const
}
