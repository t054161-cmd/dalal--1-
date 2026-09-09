import type { Config } from 'tailwindcss'

/**
 * TERRA design system.
 * ---------------------------------------------------------------
 * Every colour is wired to a CSS custom property declared in
 * src/app/globals.css, so light mode, dark mode and future
 * re-brands are a one-file change.
 */
const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        clay: 'rgb(var(--clay) / <alpha-value>)',
        sage: 'rgb(var(--sage) / <alpha-value>)',
        sand: 'rgb(var(--sand) / <alpha-value>)',
        stone: 'rgb(var(--stone) / <alpha-value>)',
        bark: 'rgb(var(--bark) / <alpha-value>)',
        cream: 'rgb(var(--cream) / <alpha-value>)',
        moss: 'rgb(var(--moss) / <alpha-value>)',

        // Semantic tokens (these flip in dark mode)
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-raised': 'rgb(var(--surface-raised) / <alpha-value>)',
        'surface-sunken': 'rgb(var(--surface-sunken) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        'ink-soft': 'rgb(var(--ink-soft) / <alpha-value>)',
        'ink-mute': 'rgb(var(--ink-mute) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-ink': 'rgb(var(--accent-ink) / <alpha-value>)',
        'accent-soft': 'rgb(var(--accent-soft) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-latin)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-latin)', 'serif'],
      },
      borderRadius: {
        // Soft organic shapes: 12–24px everywhere.
        sm: '0.5rem',
        DEFAULT: '0.75rem',
        md: '0.875rem',
        lg: '1rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        blob: '2.5rem 1.75rem 2.25rem 1.5rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgb(62 50 41 / 0.04), 0 8px 24px -12px rgb(62 50 41 / 0.14)',
        lift: '0 2px 4px rgb(62 50 41 / 0.05), 0 20px 40px -20px rgb(62 50 41 / 0.22)',
        inset: 'inset 0 1px 0 rgb(255 255 255 / 0.35)',
      },
      fontSize: {
        'display-sm': ['clamp(1.9rem, 5vw, 2.6rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        display: ['clamp(2.3rem, 7vw, 4rem)', { lineHeight: '1.06', letterSpacing: '-0.025em' }],
        'display-lg': ['clamp(2.8rem, 9vw, 5.5rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
      },
      transitionTimingFunction: {
        organic: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'soft-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.5s ease both',
        'accordion-down': 'accordion-down 0.25s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'soft-pulse': 'soft-pulse 1.8s ease-in-out infinite',
        drift: 'drift 6s ease-in-out infinite',
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
