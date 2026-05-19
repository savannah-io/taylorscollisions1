import type { MetadataRoute } from 'next'

const SITE_URL = 'https://taylorscollision.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const routes = [
    { path: '', priority: 1.0, frequency: 'weekly' as const },
    { path: '/services', priority: 0.9, frequency: 'monthly' as const },
    { path: '/reviews', priority: 0.8, frequency: 'weekly' as const },
    { path: '/contact', priority: 0.8, frequency: 'monthly' as const },
    { path: '/schedule', priority: 0.9, frequency: 'monthly' as const },
    { path: '/careers', priority: 0.6, frequency: 'monthly' as const },
    { path: '/blog', priority: 0.7, frequency: 'weekly' as const },
  ]

  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.frequency,
    priority: r.priority,
  }))
}
