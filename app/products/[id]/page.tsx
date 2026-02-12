import type { Metadata } from "next"
import { ProductHero } from "@/components/product-detail/product-hero"
import { ProductSpecs } from "@/components/product-detail/product-specs"
import { PriceComparisonTable } from "@/components/product-detail/price-comparison-table"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import Link from "next/link"
import { API_URL } from "@/lib/api"

interface ShopPrice {
    shop: string
    price: number
    oldPrice?: number
    available: boolean
    url?: string
}

interface Product {
    id: string
    name: string
    brand: string
    bestPrice: number
    originalPrice?: number
    image: string
    description: string
    inStock: boolean
    category?: string
    shopPrices: ShopPrice[]
    specifications?: Record<string, string | number | boolean>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    return {
      title: "Produit non trouvé",
      description: "Ce produit n'existe pas ou a été supprimé.",
    }
  }

  const title = `${product.name} — Prix à partir de ${product.bestPrice} TND`
  const description = `Comparez les prix de ${product.name} (${product.brand}) en Tunisie. Meilleur prix: ${product.bestPrice} TND. Trouvez le meilleur deal sur 1111.tn.`

  return {
    title,
    description,
    alternates: {
      canonical: `/products/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `/products/${id}`,
      images: product.image ? [{ url: product.image, alt: product.name }] : [],
    },
  }
}

async function getProduct(id: string): Promise<Product | null> {
    try {
        const res = await fetch(`${API_URL}/products/${encodeURIComponent(id)}`, {
            cache: 'no-store'
        })
        if (!res.ok) return null
        return res.json()
    } catch {
        return null
    }
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const product = await getProduct(id)

    if (!product) {
        return (
            <main className="min-h-screen bg-background">
                <Header />
                <div className="mx-auto max-w-6xl px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold text-foreground">Produit non trouvé</h1>
                    <p className="mt-2 text-muted-foreground">Le produit avec la référence &quot;{id}&quot; n&apos;existe pas.</p>
                    <Link
                        href="/products"
                        className="mt-4 inline-block px-6 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700"
                    >
                        Voir tous les produits
                    </Link>
                </div>
                <Footer />
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background">
            <Header />
            <div className="mx-auto max-w-6xl px-4 py-8">
                {/* Breadcrumb */}
                <nav className="text-sm text-muted-foreground mb-6">
                    <Link href="/" className="hover:text-purple-600">Accueil</Link>
                    <span className="mx-2">/</span>
                    <Link href="/products" className="hover:text-purple-600">Produits</Link>
                    {product.category && (
                        <>
                            <span className="mx-2">/</span>
                            <Link
                                href={`/products?category=${encodeURIComponent(product.category)}`}
                                className="hover:text-purple-600"
                            >
                                {product.category}
                            </Link>
                        </>
                    )}
                    <span className="mx-2">/</span>
                    <span className="text-foreground">{product.brand}</span>
                </nav>

                {/* Product Hero Section */}
                <ProductHero product={product} />

                {/* Specifications Section */}
                <div className="mt-8">
                    <ProductSpecs product={product} />
                </div>

                {/* Price Comparison Table */}
                <div className="mt-8">
                    <PriceComparisonTable product={product} />
                </div>
            </div>
            <Footer />
        </main>
    )
}
