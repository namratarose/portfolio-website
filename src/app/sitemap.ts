import type { MetadataRoute } from 'next'

const BASE_URL = 'https://namrata.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Section anchors — helpful for SEO but treated as page variants
  const sectionRoutes: MetadataRoute.Sitemap = [
    'about',
    'experience',
    'skills',
    'projects',
    'system-design',
    'fun',
    'contact',
  ].map(section => ({
    url: `${BASE_URL}/#${section}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...sectionRoutes]
}
