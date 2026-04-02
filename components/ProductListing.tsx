"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { filterProductsAction, getCategoriesAction } from "@/app/actions"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Search, SlidersHorizontal, X, ChevronDown, Check, Grid3X3, List, Loader2 } from "lucide-react"
import { ProductCard } from "@/components/ProductCard"
import { SearchBar } from "@/components/SearchBar"
import { UserMenu } from "@/components/UserMenu"

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

interface ProductListResponse {
    products: Product[]
    total: number
    page: number
    limit: number
    totalPages: number
}

const PRICE_RANGES = [
    { label: "Tous les prix", min: undefined, max: undefined },
    { label: "Moins de 100 DT", min: undefined, max: 100 },
    { label: "100 - 500 DT", min: 100, max: 500 },
    { label: "500 - 1000 DT", min: 500, max: 1000 },
    { label: "1000 - 2000 DT", min: 1000, max: 2000 },
    { label: "2000 - 5000 DT", min: 2000, max: 5000 },
    { label: "Plus de 5000 DT", min: 5000, max: undefined },
]

interface ProductListingProps {
    initialProducts?: Product[]
    initialTotal?: number
    initialTotalPages?: number
    initialCategories?: string[]
}

export function ProductListingContent({
    initialProducts = [],
    initialTotal = 0,
    initialTotalPages = 1,
    initialCategories = []
}: ProductListingProps) {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [products, setProducts] = useState<Product[]>(initialProducts)
    const [loading, setLoading] = useState(initialProducts.length === 0)
    const [totalProducts, setTotalProducts] = useState(initialTotal)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(initialTotalPages)
    const [showFilters, setShowFilters] = useState(false)
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

    // Filters
    const [selectedPriceRange, setSelectedPriceRange] = useState(0)
    const [inStockOnly, setInStockOnly] = useState(false)
    const [categories, setCategories] = useState<string[]>(initialCategories)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    // Get search params
    const searchQuery = searchParams.get("search") || ""
    const categoryParam = searchParams.get("category") || ""
    const categoryType = searchParams.get("type") || "subcategory"

    // First load check to skip initial fetch if data provided
    const [isFirstLoad, setIsFirstLoad] = useState(initialProducts.length > 0)

    // Fetch categories if not provided
    useEffect(() => {
        if (initialCategories.length > 0) return

        const fetchCategories = async () => {
            try {
                const [subcats, lowcats] = await Promise.all([
                    getCategoriesAction("products", "categories"),
                    getCategoriesAction("products", "low-categories")
                ])

                const safeSubcats = Array.isArray(subcats) ? subcats : [];
                const safeLowcats = Array.isArray(lowcats) ? lowcats : [];

                setCategories([...new Set([...safeSubcats, ...safeLowcats])])
            } catch (error) {
                console.error("Error fetching categories:", error)
            }
        }
        fetchCategories()
    }, [initialCategories])

    // Fetch products
    const fetchProducts = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()

            if (searchQuery) params.set("search", searchQuery)
            if (categoryParam) {
                params.set("category", categoryParam)
                params.set("category_type", categoryType)
            } else if (selectedCategory) {
                params.set("category", selectedCategory)
            }

            const priceRange = PRICE_RANGES[selectedPriceRange]
            if (priceRange.min !== undefined) params.set("min_price", priceRange.min.toString())
            if (priceRange.max !== undefined) params.set("max_price", priceRange.max.toString())
            if (inStockOnly) params.set("in_stock", "true")

            params.set("page", currentPage.toString())
            params.set("limit", "20")

            const data = await filterProductsAction("products", params.toString())

            setProducts(Array.isArray(data.products) ? data.products : [])
            setTotalProducts(data.total || 0)
            setTotalPages(data.totalPages || 1)
        } catch (error) {
            console.error("Error fetching products:", error)
        } finally {
            setLoading(false)
        }
    }, [searchQuery, categoryParam, categoryType, selectedCategory, selectedPriceRange, inStockOnly, currentPage])

    useEffect(() => {
        // Skip the first fetch if we have initial data and parameters match expected initial state
        // Simplification: if isFirstLoad is true, we skip. But we must be careful if params change immediately.
        // For now, let's just skip if it's the very first render cycle.
        if (isFirstLoad) {
            setIsFirstLoad(false)
            return
        }
        fetchProducts()
    }, [fetchProducts]) // removing isFirstLoad from dependency to avoid loop

    // Reset page when filters change
    useEffect(() => {
        if (!isFirstLoad) {
            setCurrentPage(1)
        }
    }, [searchQuery, categoryParam, selectedCategory, selectedPriceRange, inStockOnly])

    const clearFilters = () => {
        setSelectedPriceRange(0)
        setInStockOnly(false)
        setSelectedCategory(null)
        router.push("/products")
    }

    const hasActiveFilters = selectedPriceRange > 0 || inStockOnly || selectedCategory || searchQuery || categoryParam

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/images/Logo 1111.svg"
                                alt="1111.tn"
                                width={120}
                                height={40}
                                className="h-10 w-auto object-contain"
                            />
                        </Link>

                        <div className="flex-1 max-w-2xl">
                            <SearchBar variant="header" accentColor="blue" placeholder="Rechercher un produit..." />
                        </div>

                        {/* User Menu */}
                        <div className="flex-shrink-0">
                            <UserMenu />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Page Title & Breadcrumb */}
                <div className="mb-6">
                    <nav className="text-sm text-gray-500 mb-2">
                        <Link href="/" className="hover:text-purple">Accueil</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900">
                            {categoryParam || searchQuery ? (
                                categoryParam || `Résultats pour "${searchQuery}"`
                            ) : (
                                "Tous les produits"
                            )}
                        </span>
                    </nav>
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {categoryParam || (searchQuery ? `Résultats pour "${searchQuery}"` : "Tous les produits")}
                        </h1>
                        <span className="text-sm text-gray-500">
                            {totalProducts} produit{totalProducts > 1 ? "s" : ""} trouvé{totalProducts > 1 ? "s" : ""}
                        </span>
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* Sidebar Filters - Desktop */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-gray-900">Filtres</h2>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs text-purple hover:underline"
                                    >
                                        Réinitialiser
                                    </button>
                                )}
                            </div>

                            {/* Price Filter */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Prix</h3>
                                <div className="space-y-2">
                                    {PRICE_RANGES.map((range, idx) => (
                                        <label
                                            key={idx}
                                            className="flex items-center gap-2 cursor-pointer group"
                                            onClick={() => setSelectedPriceRange(idx)}
                                        >
                                            <div className={`size-4 rounded border-2 flex items-center justify-center transition-colors ${selectedPriceRange === idx
                                                ? "bg-purple border-purple"
                                                : "border-gray-300 group-hover:border-purple-400"
                                                }`}>
                                                {selectedPriceRange === idx && (
                                                    <Check className="size-3 text-white" />
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-600 group-hover:text-gray-900">
                                                {range.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Availability Filter */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Disponibilité</h3>
                                <label
                                    className="flex items-center gap-2 cursor-pointer group"
                                    onClick={() => setInStockOnly(!inStockOnly)}
                                >
                                    <div className={`size-4 rounded border-2 flex items-center justify-center transition-colors ${inStockOnly
                                        ? "bg-purple border-purple"
                                        : "border-gray-300 group-hover:border-purple-400"
                                        }`}>
                                        {inStockOnly && <Check className="size-3 text-white" />}
                                    </div>
                                    <span className="text-sm text-gray-600 group-hover:text-gray-900">
                                        En stock uniquement
                                    </span>
                                </label>
                            </div>

                            {/* Category Filter */}
                            {categories.length > 0 && !categoryParam && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Catégorie</h3>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {categories.slice(0, 15).map((cat) => (
                                            <label
                                                key={cat}
                                                className="flex items-center gap-2 cursor-pointer group"
                                                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                                            >
                                                <div className={`size-4 rounded border-2 flex items-center justify-center transition-colors ${selectedCategory === cat
                                                    ? "bg-purple border-purple"
                                                    : "border-gray-300 group-hover:border-purple-400"
                                                    }`}>
                                                    {selectedCategory === cat && (
                                                        <Check className="size-3 text-white" />
                                                    )}
                                                </div>
                                                <span className="text-sm text-gray-600 group-hover:text-gray-900 truncate">
                                                    {cat}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Mobile Filter Toggle & View Options */}
                        <div className="flex items-center justify-between mb-4 lg:justify-end gap-3">
                            <button
                                onClick={() => setShowFilters(true)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-medium"
                            >
                                <SlidersHorizontal className="size-4" />
                                Filtres
                                {hasActiveFilters && (
                                    <span className="size-5 bg-purple text-white rounded-full text-xs flex items-center justify-center">
                                        !
                                    </span>
                                )}
                            </button>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === "grid"
                                        ? "bg-purple/10 text-purple"
                                        : "bg-white text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    <Grid3X3 className="size-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === "list"
                                        ? "bg-purple/10 text-purple"
                                        : "bg-white text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    <List className="size-5" />
                                </button>
                            </div>
                        </div>

                        {/* Active Filters Pills */}
                        {hasActiveFilters && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {searchQuery && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple/10 text-purple/90 rounded-full text-sm">
                                        Recherche: {searchQuery}
                                        <button onClick={() => router.push("/products")}>
                                            <X className="size-3" />
                                        </button>
                                    </span>
                                )}
                                {categoryParam && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple/10 text-purple/90 rounded-full text-sm">
                                        {categoryParam}
                                        <button onClick={() => router.push("/products")}>
                                            <X className="size-3" />
                                        </button>
                                    </span>
                                )}
                                {selectedPriceRange > 0 && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                                        {PRICE_RANGES[selectedPriceRange].label}
                                        <button onClick={() => setSelectedPriceRange(0)}>
                                            <X className="size-3" />
                                        </button>
                                    </span>
                                )}
                                {inStockOnly && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                        En stock
                                        <button onClick={() => setInStockOnly(false)}>
                                            <X className="size-3" />
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Loading State */}
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="size-8 text-purple animate-spin" />
                            </div>
                        ) : products.length === 0 ? (
                            /* Empty State */
                            <div className="bg-white rounded-2xl p-12 text-center">
                                <div className="size-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="size-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Aucun produit trouvé
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Essayez de modifier vos filtres ou votre recherche
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="px-6 py-2 bg-purple text-white rounded-full font-medium hover:bg-purple/90 transition-colors"
                                >
                                    Réinitialiser les filtres
                                </button>
                            </div>
                        ) : (
                            /* Product Grid */
                            <div className={`grid gap-4 ${viewMode === "grid"
                                ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                                : "grid-cols-1"
                                }`}>
                                {products.map((product) => (
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
                                    />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Précédent
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum: number
                                        if (totalPages <= 5) {
                                            pageNum = i + 1
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i
                                        } else {
                                            pageNum = currentPage - 2 + i
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`size-10 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                                                    ? "bg-purple text-white"
                                                    : "bg-white border border-gray-200 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        )
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Suivant
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Modal */}
            {showFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowFilters(false)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold">Filtres</h2>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        {/* Price Filter */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Prix</h3>
                            <div className="space-y-2">
                                {PRICE_RANGES.map((range, idx) => (
                                    <label
                                        key={idx}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <div className={`size-5 rounded border-2 flex items-center justify-center ${selectedPriceRange === idx
                                            ? "bg-purple border-purple"
                                            : "border-gray-300"
                                            }`}>
                                            {selectedPriceRange === idx && (
                                                <Check className="size-3 text-white" />
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-700">
                                            {range.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Disponibilité</h3>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <div className={`size-5 rounded border-2 flex items-center justify-center ${inStockOnly
                                    ? "bg-purple border-purple"
                                    : "border-gray-300"
                                    }`}>
                                    {inStockOnly && <Check className="size-3 text-white" />}
                                </div>
                                <span className="text-sm text-gray-700">
                                    En stock uniquement
                                </span>
                            </label>
                        </div>

                        {/* Apply Button */}
                        <button
                            onClick={() => setShowFilters(false)}
                            className="w-full py-3 bg-purple text-white rounded-full font-semibold"
                        >
                            Appliquer les filtres
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export function ProductListing({ initialProducts, initialTotal, initialTotalPages, initialCategories }: ProductListingProps) {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="size-8 text-purple animate-spin" />
            </div>
        }>
            <ProductListingContent
                initialProducts={initialProducts}
                initialTotal={initialTotal}
                initialTotalPages={initialTotalPages}
                initialCategories={initialCategories}
            />
        </Suspense>
    )
}
