import type { Metadata, Viewport } from 'next'
import './globals.css'
import { fontVariables } from './fonts'
import { Providers, preHydrationScript } from '@/components/layout/providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { WhatsAppButton } from '@/components/layout/whatsapp-button'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://terra.example'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'TERRA — the mug made from the earth, made yours',
    template: '%s · TERRA',
  },
  description:
    'A reusable, customizable, double-wall insulated mug in recycled stainless steel. Hot for 12 hours, cold for 24. Design yours in 3D, in Arabic or English.',
  applicationName: 'TERRA',
  keywords: [
    'reusable mug',
    'custom mug Kuwait',
    'insulated tumbler',
    'recycled stainless steel',
    'كوب قابل لإعادة الاستخدام',
    'كوب حراري مخصص',
  ],
  openGraph: {
    type: 'website',
    siteName: 'TERRA',
    locale: 'en',
    alternateLocale: ['ar'],
    title: 'TERRA — from the earth, for the earth',
    description:
      'Design a double-wall insulated mug in 3D: your colours, your words, in Arabic or English. One TERRA replaces about 730 disposable cups a year.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TERRA — from the earth, for the earth',
    description: 'A customizable insulated mug in recycled steel. Design yours in 3D.',
  },
  alternates: {
    canonical: '/',
    languages: { en: '/', ar: '/' },
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/images/brand/terra-favicon.svg', type: 'image/svg+xml' }],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F6F1E7' },
    { media: '(prefers-color-scheme: dark)', color: '#1E1915' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // lang/dir start as English and are corrected before paint by the inline
    // script below; the LocaleProvider keeps them in sync afterwards.
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preHydrationScript }} />
      </head>
      <body className={fontVariables}>
        <Providers>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  )
}
