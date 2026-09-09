import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://terra.example'

const ROUTES = [
  '',
  '/cup-of-the-day',
  '/customize',
  '/shop',
  '/impact',
  '/gifts',
  '/about',
  '/faq',
  '/contact',
  '/cart',
  '/checkout',
  '/track',
  '/gallery',
  '/wishlist',
  '/takeback',
  '/subscribe',
  '/rewards',
  '/policies',
  '/quiz',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === '/cup-of-the-day' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.7,
  }))
}
