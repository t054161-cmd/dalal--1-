import type { Metadata, Viewport } from 'next'
import './globals.css'
import { fontVariables } from './fonts'
import { Providers, preHydrationScript } from '@/components/layout/providers'
import { Nav } from '@/components/layout/nav'
import { AmbientCanopy } from '@/components/common/ambient-canopy'
import { Footer } from '@/components/layout/footer'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://terra.example'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'TERRA — designed for everyday rituals',
    template: '%s · TERRA',
  },
  description:
    'A tall, slim reusable tumbler in recycled stainless steel, with a leak-resistant lid and a straw you keep. Four tones taken from the ground. Design your own in 3D.',
  applicationName: 'TERRA',
  keywords: [
    'reusable tumbler',
    'reusable cup',
    'sustainable design',
    'custom tumbler Kuwait',
    'كوب قابل لإعادة الاستخدام',
    'كوب حراري',
  ],
  openGraph: {
    type: 'website',
    siteName: 'TERRA',
    locale: 'en',
    alternateLocale: ['ar'],
    title: 'TERRA — designed for everyday rituals',
    description:
      'One cup, used ten thousand times. Recycled steel, four earth tones, and a designer that reads a sentence and builds your cup.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TERRA — designed for everyday rituals',
    description: 'A reusable tumbler for brighter days.',
  },
  alternates: { canonical: '/', languages: { en: '/', ar: '/' } },
  robots: { index: true, follow: true },
  icons: { icon: [{ url: '/images/brand/favicon.svg', type: 'image/svg+xml' }] },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#EFEAE1' },
    { media: '(prefers-color-scheme: dark)', color: '#212822' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // lang/dir start as English and are corrected before paint by the inline
    // script; the locale provider keeps them in step afterwards.
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preHydrationScript }} />
      </head>
      <body className={fontVariables}>
        <Providers>
          {/* Behind everything: leaves, light and shade, moving very slowly. */}
          <AmbientCanopy />
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
