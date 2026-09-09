import type { Config } from 'tailwindcss'

/**
 * TERRA — design system.
 * ---------------------------------------------------------------------------
 * Three brand tones carry the whole site: Linen, Sage / Smoked Green, Sandi,
 * with Forest as the deep tone from the colourway range. Every value is a CSS
 * custom property declared in src/app/globals.css, so light mode, dark mode
 * and any future re-brand are a one-file change.
 */
const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Brand tones
        linen: 'rgb(var(--linen) / <alpha-value>)',
        sage: 'rgb(var(--sage) / <alpha-value>)',
        smoke: 'rgb(var(--smoke) / <alpha-value>)',
        sandi: 'rgb(var(--sandi) / <alpha-value>)',
        forest: 'rgb(var(--forest) / <alpha-value>)',
        clay: 'rgb(var(--clay) / <alpha-value>)',

        // Semantic tokens — these flip in dark mode
        surface: 'rgb(var(--surface) / <alpha-value>)',
        raised: 'rgb(var(--raised) / <alpha-value>)',
        sunken: 'rgb(var(--sunken) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        'ink-soft': 'rgb(var(--ink-soft) / <alpha-value>)',
        'ink-mute': 'rgb(var(--ink-mute) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-ink': 'rgb(var(--accent-ink) / <alpha-value>)',
      },
      fontFamily: {
        // 'Playlist' and 'Audrey' are named first: drop the licensed files in
        // (see src/app/fonts.ts) and the whole site picks them up.
        display: ['Playlist', 'var(--font-display)', 'ui-sans-serif', 'sans-serif'],
        body: ['Audrey', 'var(--font-body)', 'ui-sans-serif', 'sans-serif'],
        editorial: ['var(--font-editorial)', 'Georgia', 'serif'],
        arabic: ['var(--font-arabic)', 'ui-sans-serif', 'sans-serif'],
      },
      fontSize: {
        // Cinematic display scale — big, quiet, wide-tracked.
        'title-xl': ['clamp(3.5rem, 17vw, 15rem)', { lineHeight: '0.94', letterSpacing: '0.16em' }],
        'title-lg': ['clamp(2.6rem, 8vw, 6rem)', { lineHeight: '1', letterSpacing: '0.06em' }],
        title: ['clamp(2rem, 5vw, 3.6rem)', { lineHeight: '1.06', letterSpacing: '0.02em' }],
        'title-sm': ['clamp(1.5rem, 3vw, 2.2rem)', { lineHeight: '1.15', letterSpacing: '0.01em' }],
        label: ['0.7rem', { lineHeight: '1.2', letterSpacing: '0.26em' }],
      },
      letterSpacing: {
        wordmark: '0.42em',
        wide: '0.14em',
        wider: '0.22em',
      },
      borderRadius: { xl: '1rem', '2xl': '1.5rem', '3xl': '2rem' },
      boxShadow: {
        soft: '0 1px 2px rgb(43 52 44 / 0.04), 0 18px 40px -28px rgb(43 52 44 / 0.28)',
        lift: '0 2px 6px rgb(43 52 44 / 0.05), 0 40px 80px -40px rgb(43 52 44 / 0.38)',
      },
      transitionDuration: {
        '1100': '1100ms',
        '1400': '1400ms',
      },
      transitionTimingFunction: {
        cinema: 'cubic-bezier(0.16, 1, 0.3, 1)',
        breathe: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'sway-a': {
          '0%, 100%': { transform: 'translate3d(0,0,0) rotate(0deg)' },
          '50%': { transform: 'translate3d(1.2%, -1.4%, 0) rotate(1.1deg)' },
        },
        'sway-b': {
          '0%, 100%': { transform: 'translate3d(0,0,0) rotate(0.4deg)' },
          '50%': { transform: 'translate3d(-1.6%, 1%, 0) rotate(-1.3deg)' },
        },
        'light-drift': {
          '0%, 100%': { transform: 'translate3d(-4%, -2%, 0) scale(1.05)', opacity: '0.55' },
          '50%': { transform: 'translate3d(4%, 3%, 0) scale(1.14)', opacity: '0.8' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'pulse-soft': { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.45' } },
      },
      animation: {
        'sway-a': 'sway-a 19s ease-in-out infinite',
        'sway-b': 'sway-b 23s ease-in-out infinite',
        'light-drift': 'light-drift 26s ease-in-out infinite',
        'fade-up': 'fade-up 1s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.9s ease both',
        'accordion-down': 'accordion-down 0.3s ease-out',
        'accordion-up': 'accordion-up 0.25s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
      maxWidth: { prose: '62ch', measure: '46ch' },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
