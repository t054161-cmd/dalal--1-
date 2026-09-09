'use client'

import * as React from 'react'
import { LocaleProvider } from '@/i18n/provider'

type Theme = 'light' | 'dark'

const ThemeContext = React.createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'light',
  toggle: () => {},
})

const THEME_KEY = 'terra.theme'

/**
 * Dark mode stays in the earth family (see globals.css) — this only flips the
 * `data-theme` attribute the tokens hang off. The initial value is applied by
 * the inline script in <head>, before paint, so there is no flash.
 */
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>('light')

  React.useEffect(() => {
    const attr = document.documentElement.dataset.theme
    if (attr === 'dark' || attr === 'light') {
      setTheme(attr)
      return
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(prefersDark ? 'dark' : 'light')
  }, [])

  const toggle = React.useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      document.documentElement.dataset.theme = next
      try {
        window.localStorage.setItem(THEME_KEY, next)
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const value = React.useMemo(() => ({ theme, toggle }), [theme, toggle])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return React.useContext(ThemeContext)
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>{children}</LocaleProvider>
    </ThemeProvider>
  )
}

/**
 * Runs before hydration: reads the two stored preferences and stamps them on
 * <html> so direction and theme are right on the very first paint.
 */
export const preHydrationScript = `
(function () {
  try {
    var l = localStorage.getItem('terra.locale');
    if (l === 'ar' || l === 'en') {
      document.documentElement.lang = l;
      document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    }
    var t = localStorage.getItem('terra.theme');
    if (t === 'dark' || t === 'light') {
      document.documentElement.dataset.theme = t;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.dataset.theme = 'dark';
    }
  } catch (e) {}
})();
`
