import type { MetadataRoute } from 'next'
import { SERVICE_CITIES } from '@/lib/service-cities'

const SITE_URL = 'https://taylorscollision.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const routes = [
    { path: '', priority: 1.0, frequency: 'weekly' as const },
    { path: '/services', priority: 0.9, frequency: 'monthly' as const },
    { path: '/reviews', priority: 0.8, frequency: 'weekly' as const },
    { path: '/contact', priority: 0.8, frequency: 'monthly' as const },
    { path: '/schedule', priority: 0.9, frequency: 'monthly' as const },
    { path: '/schedule-now', priority: 0.9, frequency: 'monthly' as const },
    { path: '/careers', priority: 0.6, frequency: 'monthly' as const },
    { path: '/blog', priority: 0.7, frequency: 'weekly' as const },
    // City landing pages — local SEO for "collision repair {city}" searches
    ...SERVICE_CITIES.map((c) => ({
      path: `/collision-repair/${c.slug}`,
      priority: 0.85,
      frequency: 'monthly' as const,
    })),
  ]

  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.frequency,
    priority: r.priority,
  }))
}
