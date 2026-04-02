"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "@/components/ProductCard"
import { Sparkles } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://back-27em.onrender.com/api/v1"
const normalizedBase = API_BASE_URL.replace(/\/+$/, '')
const API_URL = normalizedBase.endsWith('/api/v1') ? normalizedBase : `${normalizedBase}/api/v1`

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
}

interface RecommendedProductsProps {
    category: string
    currentProductId: string
    currentPrice: number
    type?: "products" | "para"
    categoryType?: string
}

export function RecommendedProducts({ category, currentProductId, currentPrice, type = "products", categoryType }: RecommendedProductsProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchRecommendations() {
            try {
                const endpoint = type === "para" ? "para" : "products"
                // Fetch 20 products to have enough candidates for price filtering
                const catTypeParam = categoryType ? `&category_type=${encodeURIComponent(categoryType)}` : ""
                const res = await fetch(
                    `${API_URL}/${endpoint}/random?category=${encodeURIComponent(category)}&limit=20${catTypeParam}`
                )
                if (!res.ok) return
                const data: Product[] = await res.json()

                // Define price range: ±30% of the current product's price
                const minPrice = currentPrice * 0.7
                const maxPrice = currentPrice * 1.3

                // Filter: exclude current product, keep only products in the same price interval
                const filtered = data
                    .filter(p => p.id !== currentProductId)
                    .filter(p => p.bestPrice >= minPrice && p.bestPrice <= maxPrice)
                    // Sort by closest price to the current product
                    .sort((a, b) => Math.abs(a.bestPrice - currentPrice) - Math.abs(b.bestPrice - currentPrice))
                    .slice(0, 5)

                setProducts(filtered)
            } catch (err) {
                console.error("Failed to fetch recommendations:", err)
            } finally {
                setLoading(false)
            }
        }

        if (category && currentPrice > 0) {
            fetchRecommendations()
        } else {
            setLoading(false)
        }
    }, [category, currentProductId, currentPrice, type, categoryType])

    if (loading) {
        return (
            <div className="mt-12 mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                        <Sparkles className="size-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Produits recommandés</h2>
                        <p className="text-xs text-muted-foreground">Produits similaires dans la même catégorie</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="aspect-[3/4] rounded-2xl bg-muted/50 animate-pulse w-full" />
                    ))}
                </div>
            </div>
        )
    }

    if (products.length === 0) return null

    const linkPrefix = type === "para" ? "/para" : "/products"

    return (
        <div className="mt-12 mb-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <Sparkles className="size-4 text-white" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-foreground">Produits recommandés</h2>
                    <p className="text-xs text-muted-foreground">Produits similaires dans la catégorie <span className="font-semibold text-blue-600">{category}</span></p>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        brand={product.brand}
                        bestPrice={product.bestPrice}
                        originalPrice={product.originalPrice}
                        image={product.image}
                        description={product.description}
                        inStock={product.inStock}
                        shopPrices={product.shopPrices}
                        linkPrefix={linkPrefix}
                    />
                ))}
            </div>
        </div>
    )
}
