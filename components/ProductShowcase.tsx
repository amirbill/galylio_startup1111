"use client"

import { ProductCard } from "./ProductCard"
import { CategoryTabs } from "./CategoryTabs"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { API_URL } from "@/lib/api"
import Link from "next/link"
import { fetchProductsAction } from "@/app/actions"

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

interface CategoryConfig {
    id: string
    label: string
    type: "subcategory" | "low_category"
}

interface ProductShowcaseProps {
    /** The default/first category to display */
    defaultCategory: string
    /** Whether to use low_category or subcategory field */
    categoryType?: "subcategory" | "low_category"
    /** List of categories to show in tabs */
    categories: CategoryConfig[]
    initialProducts?: Product[]
    /** Optional banner image */
    bannerImage?: string
    /** Optional banner text */
    bannerText?: string
    /** Whether to show the decorative "Tendances" and "e-commerce" headers */
    showDecorativeHeaders?: boolean
    /** Accent color for the section (purple, blue, teal, orange) */
    accentColor?: string
}

// Category-specific banner images (Curated Unsplash URLs for premium look)
const categoryBannerImages: Record<string, string> = {
    "PC de Bureau": "https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=800&auto=format&fit=crop",
    "Pc Portable": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop",
    "Imprimante": "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=800&auto=format&fit=crop",
    "Refrigerateur": "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?q=80&w=800&auto=format&fit=crop",
    "Machine à Laver": "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=800&auto=format&fit=crop",
    "Lave Vaisselle": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
    "Maman et bébé": "https://images.unsplash.com/photo-1555252332-902e08e64c8d?q=80&w=800&auto=format&fit=crop",
    "Solaire": "https://images.unsplash.com/photo-1524316886470-760771804f32?q=80&w=800&auto=format&fit=crop",
    "Hygiène": "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=800&auto=format&fit=crop",
    "Visage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop",
}

// Category-specific banner texts (fallback to category label)
const categoryBannerTexts: Record<string, string> = {
    "PC de Bureau": "PC de Bureau",
    "Pc Portable": "Pc Portables",
    "Imprimante": "Imprimantes",
    "Refrigerateur": "Réfrigérateurs",
    "Machine à Laver": "Lavage",
    "Lave Vaisselle": "Cuisine",
}

export default function ProductShowcase({
    defaultCategory,
    categoryType = "subcategory",
    categories,
    bannerImage,
    bannerText = "Jusqu'à -40%",
    initialProducts,
    showDecorativeHeaders = false,
    accentColor = "purple"
}: ProductShowcaseProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts || [])
    const [loading, setLoading] = useState(!initialProducts)
    const [activeCategory, setActiveCategory] = useState(defaultCategory)
    const [activeCategoryType, setActiveCategoryType] = useState<"subcategory" | "low_category">(categoryType)
    const [isFirstLoad, setIsFirstLoad] = useState(!!initialProducts)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Get the appropriate banner image/text for the current category
    const currentBannerImage = categoryBannerImages[activeCategory] || bannerImage || "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400&h=600&fit=crop"
    
    // Find the category label to show on the banner
    const activeCategoryLabel = categories.find(c => c.id === activeCategory)?.label || activeCategory
    const currentBannerText = categoryBannerTexts[activeCategory] || activeCategoryLabel

    // Fetch products when category changes (max 10)
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
                // Use Server Action instead of direct fetch
                const data = await fetchProductsAction(activeCategory, activeCategoryType, 10)
                setProducts(data)
            } catch (error) {
                console.error("Error fetching products:", error)
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
            {/* Decorative Headers */}
            {showDecorativeHeaders && (
                <div className="flex flex-col sm:flex-row justify-between items-center mb-10 px-4 gap-4">
                    <div className="relative w-48 h-20 sm:w-72 sm:h-32 md:w-96 md:h-40">
                        <img
                            src="/images/Gemini_Generated_Image_uzbygwuzbygwuzby 1.svg"
                            alt="Tendances"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="relative w-48 h-20 sm:w-72 sm:h-32 md:w-96 md:h-40">
                        <img
                            src="/images/Gemini_Generated_Image_vju61pvju61pvju6 1.svg"
                            alt="e-commerce"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">

                {/* Left Side Banner */}
                <div className="lg:w-[320px] shrink-0 hidden lg:block">
                    <div className="h-full w-full relative group overflow-hidden rounded-[2.5rem] bg-[#f8f6f3]">
                        <img
                            src={currentBannerImage}
                            key={activeCategory} // Ensure image transitions on category change
                            alt="Banner"
                            className="h-full w-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-110 animate-in fade-in zoom-in-95"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <span className={`text-white text-sm font-bold uppercase tracking-wider opacity-80 underline underline-offset-4 ${
                                accentColor === "blue" ? "decoration-blue-500" :
                                accentColor === "teal" ? "decoration-teal-500" :
                                accentColor === "orange" ? "decoration-orange-500" :
                                "decoration-purple"
                            }`}>Promo</span>
                            <h3 className="text-white text-2xl font-black mt-2 drop-shadow-md">
                                {currentBannerText}
                            </h3>
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
                            accentColor={accentColor}
                        />
                    </div>

                    {/* Horizontal Scrolling Product Container */}
                    <div className="relative group/scroll">
                        {/* Left Scroll Button */}
                        <button
                            onClick={scrollLeft}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full flex items-center justify-center opacity-100 border-2 -translate-x-1/2 shadow-lg animate-red-white"
                        >
                            <ChevronLeft className="size-6 stroke-[3px]" />
                        </button>

                        {/* Right Scroll Button */}
                        <button
                            onClick={scrollRight}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full flex items-center justify-center opacity-100 border-2 translate-x-1/2 -mr-2 shadow-lg animate-red-white"
                        >
                            <ChevronRight className="size-6 stroke-[3px]" />
                        </button>

                        {/* Gradient Fades */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-[5] pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-[5] pointer-events-none" />

                        {/* Scrollable Product Row */}
                        <div
                            ref={scrollContainerRef}
                            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth sm:grid sm:grid-cols-2 lg:grid lg:grid-cols-3 xl:flex"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            {loading ? (
                                // Loading skeletons
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
                                    <ProductCard key={product.id} {...product} accentColor={accentColor} />
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
                    href={`/products?category=${encodeURIComponent(activeCategory)}&type=${activeCategoryType}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-8 py-4 text-base font-bold text-foreground shadow-sm transition-all hover:shadow-md hover:bg-muted group"
                >
                    Voir plus de produits
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-white transition-transform group-hover:rotate-45 ${
                        accentColor === "blue" ? "bg-blue-600" :
                        accentColor === "teal" ? "bg-teal-600" :
                        accentColor === "orange" ? "bg-orange-600" :
                        "bg-purple"
                    }`}>
                        <ArrowRight className="h-5 w-5" />
                    </div>
                </Link>
            </div>
        </section>
    )
}
