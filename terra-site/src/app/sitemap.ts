import type { MetadataRoute } from 'next'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://terra.example'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return ['', '/shop', '/customize', '/story', '/cart'].map((route) => ({
    url: `${SITE}${route}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.7,
  }))
}
