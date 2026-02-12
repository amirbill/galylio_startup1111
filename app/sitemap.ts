import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://1111.tn'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://back-27em.onrender.com/api/v1'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static pages ──────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/para`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/solutions`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/coming-soon`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // ── Dynamic product pages ─────────────────────────────────────
  let productPages: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${API_URL}/products/sitemap`, {
      next: { revalidate: 3600 }, // revalidate every hour
    })
    if (res.ok) {
      const products: { id: string; updated_at?: string }[] = await res.json()
      productPages = products.map((product) => ({
        url: `${BASE_URL}/products/${product.id}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error)
  }

  // ── Dynamic para-pharmacy pages ───────────────────────────────
  let paraPages: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${API_URL}/para/sitemap`, {
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const paraProducts: { id: string; updated_at?: string }[] = await res.json()
      paraPages = paraProducts.map((product) => ({
        url: `${BASE_URL}/para/${product.id}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('Error fetching para products for sitemap:', error)
  }

  return [...staticPages, ...productPages, ...paraPages]
}
