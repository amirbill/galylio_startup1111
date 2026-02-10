"use client"

import { ProductCard } from "./ProductCard"
import { CategoryTabs } from "./CategoryTabs"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { API_URL } from "@/lib/api"
import Link from "next/link"

interface ShopPrice {
    shop: string
    price: number
    oldPrice?: number
    available: boolean
    url?: string
}

interface ParaProduct {
    id: string
    name: string
    brand: string
    bestPrice: number
    originalPrice?: number
    image: string
    description: string
    inStock: boolean
    category?: string
    topCategory?: string
    shopPrices: ShopPrice[]
}

interface CategoryConfig {
    id: string
    label: string
    type: "top" | "low" | "top_category" | "low_category" | "subcategory"
}

// Default PARA categories
const defaultParaCategories: CategoryConfig[] = [
    { id: "Maman et bébé", label: "Maman & Bébé", type: "top" },
    { id: "Solaire", label: "Solaire", type: "top" },
    { id: "Hygiène", label: "Hygiène", type: "top" },
    { id: "Visage", label: "Visage", type: "low" },
]

interface ParaProductShowcaseProps {
    defaultCategory: string
    categoryType?: "top" | "low" | "top_category" | "low_category" | "subcategory"
    categories?: CategoryConfig[]
    initialProducts?: ParaProduct[]
    bannerImage?: string
    bannerText?: string
    title?: string
}

// Category-specific banner images for PARA products
const paraBannerImages: Record<string, string> = {
    "Maman et bébé": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=600&fit=crop",
    "Solaire": "https://images.unsplash.com/photo-1526758097130-bab247274f58?w=400&h=600&fit=crop",
    "Hygiène": "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=600&fit=crop",
    "Visage": "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=600&fit=crop",
    "Cheveux": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=600&fit=crop",
    "Corps": "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=600&fit=crop",
}

export function ParaProductShowcase({
    defaultCategory,
    categoryType = "top",
    categories = defaultParaCategories,
    initialProducts,
    bannerImage,
    bannerText = "Parapharmacie",
    title = "Produits Parapharmacie"
}: ParaProductShowcaseProps) {
    const [products, setProducts] = useState<ParaProduct[]>(initialProducts || [])
    const [loading, setLoading] = useState(!initialProducts)
    const [activeCategory, setActiveCategory] = useState(defaultCategory)
    const [activeCategoryType, setActiveCategoryType] = useState<"top" | "low" | "top_category" | "low_category" | "subcategory">(categoryType)
    const [isFirstLoad, setIsFirstLoad] = useState(!!initialProducts)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Get the appropriate banner image for the current category
    const currentBannerImage = bannerImage || paraBannerImages[activeCategory] || "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=600&fit=crop"

    useEffect(() => {
        if (!activeCategory) return

        // Skip fetch on first load if we have initial products
        if (isFirstLoad && products.length > 0) {
            setIsFirstLoad(false)
            return
        }

        const fetchProducts = async () => {
            setLoading(true)
            try {
                const res = await fetch(
                    `${API_URL}/para/random?category=${encodeURIComponent(activeCategory)}&category_type=${activeCategoryType}&limit=10`
                )
                if (!res.ok) throw new Error("Failed to fetch PARA products")
                const data = await res.json()
                setProducts(data)
            } catch (error) {
                console.error("Error fetching PARA products:", error)
                setProducts([])
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [activeCategory, activeCategoryType])

    const handleCategoryChange = (categoryId: string) => {
        const selectedCat = categories.find(c => c.id === categoryId)
        if (selectedCat) {
            setActiveCategory(categoryId)
            setActiveCategoryType(selectedCat.type)
        }
    }

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -240, behavior: "smooth" })
        }
    }

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 240, behavior: "smooth" })
        }
    }

    return (
        <section className="w-full max-w-[1400px] mx-auto px-4 py-8">
            {/* Section Title */}
            <div className="mb-6">
                <h2 className="text-2xl font-black text-foreground">{title}</h2>
                <p className="text-sm text-muted-foreground mt-1">Comparez les prix des parapharmacies tunisiennes</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Side Banner */}
                <div className="lg:w-[280px] shrink-0 hidden lg:block">
                    <div className="h-full w-full relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-teal-400 to-emerald-500">
                        <img
                            src={currentBannerImage}
                            alt="Banner"
                            className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <span className="text-white text-sm font-bold uppercase tracking-wider">Para</span>
                            <h3 className="text-white text-xl font-black mt-1">{bannerText}</h3>
                        </div>
                    </div>
                </div>

                {/* Right Side Content */}
                <div className="flex-1 flex flex-col gap-6 min-w-0">
                    {/* Header/Tabs */}
                    <div className="flex items-center justify-between gap-4">
                        <CategoryTabs
                            categories={categories}
                            activeCategory={activeCategory}
                            onCategoryChange={handleCategoryChange}
                        />
                    </div>

                    {/* Horizontal Scrolling Product Container */}
                    <div className="relative group/scroll">
                        <button
                            onClick={scrollLeft}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-white shadow-lg border border-border flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity hover:bg-muted -translate-x-1/2"
                        >
                            <ChevronLeft className="size-5" />
                        </button>

                        <button
                            onClick={scrollRight}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-white shadow-lg border border-border flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-opacity hover:bg-muted translate-x-1/2"
                        >
                            <ChevronRight className="size-5" />
                        </button>

                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-[5] pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-[5] pointer-events-none" />

                        <div
                            ref={scrollContainerRef}
                            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="w-[220px] shrink-0 animate-pulse flex flex-col gap-3 p-3 rounded-2xl border border-border bg-card">
                                        <div className="bg-gray-200 h-32 w-full rounded-xl" />
                                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                                        <div className="h-4 bg-gray-200 rounded w-full" />
                                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                                        <div className="h-6 bg-gray-200 rounded w-1/2" />
                                        <div className="h-8 bg-gray-200 rounded-full w-full mt-auto" />
                                    </div>
                                ))
                            ) : (
                                products.map((product) => (
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
                                        linkPrefix="/para"
                                    />
                                ))
                            )}
                            {!loading && products.length === 0 && (
                                <div className="w-full text-center py-10 text-gray-500">
                                    Aucun produit trouvé pour cette catégorie.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer "View More" Button */}
            <div className="mt-8 flex justify-center">
                <Link
                    href={`/para?category=${encodeURIComponent(activeCategory)}&type=${activeCategoryType}`}
                    className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-8 py-4 text-base font-bold text-teal-700 shadow-sm transition-all hover:shadow-md hover:bg-teal-100 group"
                >
                    Voir plus de produits parapharmacie
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-white transition-transform group-hover:rotate-45">
                        <ArrowRight className="h-5 w-5" />
                    </div>
                </Link>
            </div>
        </section>
    )
}

