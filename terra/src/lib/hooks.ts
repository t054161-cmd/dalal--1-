'use client'

import * as React from 'react'

/** True once the component has mounted on the client. */
export function useHydrated() {
  const [hydrated, setHydrated] = React.useState(false)
  React.useEffect(() => setHydrated(true), [])
  return hydrated
}

/** Live prefers-reduced-motion, so a user can change it without reloading. */
export function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/** Feature-detect WebGL once. Returns null while undetermined. */
export function useWebGL() {
  const [supported, setSupported] = React.useState<boolean | null>(null)
  React.useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl =
        canvas.getContext('webgl2') ??
        canvas.getContext('webgl') ??
        canvas.getContext('experimental-webgl')
      setSupported(Boolean(gl))
    } catch {
      setSupported(false)
    }
  }, [])
  return supported
}

/**
 * A one-time flag stored per browser — used for the "drag to rotate" hint,
 * which should appear on a first visit and never nag afterwards.
 */
export function useOnceFlag(key: string) {
  const storageKey = `terra.seen.${key}`
  const [seen, setSeen] = React.useState(true) // assume seen during SSR

  React.useEffect(() => {
    try {
      setSeen(window.localStorage.getItem(storageKey) === '1')
    } catch {
      setSeen(false)
    }
  }, [storageKey])

  const markSeen = React.useCallback(() => {
    setSeen(true)
    try {
      window.localStorage.setItem(storageKey, '1')
    } catch {
      /* ignore */
    }
  }, [storageKey])

  return [seen, markSeen] as const
}

/** Fire once when an element scrolls into view — for reveals and count-ups. */
export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = React.useRef<T | null>(null)
  const [inView, setInView] = React.useState(false)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25, ...options },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [options])

  return [ref, inView] as const
}

/** Copy to clipboard with a short-lived "copied" state. */
export function useCopy(timeout = 2200) {
  const [copied, setCopied] = React.useState(false)
  const copy = React.useCallback(
    async (value: string) => {
      try {
        await navigator.clipboard.writeText(value)
      } catch {
        // Clipboard permissions can be denied; the input is still selectable.
      }
      setCopied(true)
      window.setTimeout(() => setCopied(false), timeout)
    },
    [timeout],
  )
  return [copied, copy] as const
}
