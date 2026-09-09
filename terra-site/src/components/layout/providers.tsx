'use client'

import * as React from 'react'
import { LocaleProvider } from '@/i18n/provider'

type Theme = 'light' | 'dark'
const KEY = 'terra.theme'

const ThemeContext = React.createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'light',
  toggle: () => {},
})

/**
 * Light mode is linen with sandi accents; dark mode is deep smoked green with
 * linen type. The tokens live in globals.css — this only flips the attribute.
 */
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>('light')

  React.useEffect(() => {
    const attr = document.documentElement.dataset.theme
    if (attr === 'dark' || attr === 'light') {
      setTheme(attr)
      return
    }
    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  }, [])

  const toggle = React.useCallback(() => {
    // `theme-shift` puts a colour transition on everything for the length of
    // the crossfade and then takes it off again, so the switch is a dissolve
    // rather than a flip — and nothing carries a global transition the rest of
    // the time. See globals.css → THEME CROSSFADE.
    const root = document.documentElement
    root.classList.add('theme-shift')
    window.setTimeout(() => root.classList.remove('theme-shift'), 820)

    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      root.dataset.theme = next
      try {
        window.localStorage.setItem(KEY, next)
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const value = React.useMemo(() => ({ theme, toggle }), [theme, toggle])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => React.useContext(ThemeContext)

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>{children}</LocaleProvider>
    </ThemeProvider>
  )
}

/** Runs before hydration so direction and theme are right on the first paint. */
export const preHydrationScript = `
(function () {
  try {
    var l = localStorage.getItem('terra.locale');
    if (l === 'ar' || l === 'en') {
      document.documentElement.lang = l;
      document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    }
    var t = localStorage.getItem('terra.theme');
    if (t === 'dark' || t === 'light') document.documentElement.dataset.theme = t;
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.dataset.theme = 'dark';
  } catch (e) {}
})();
`
