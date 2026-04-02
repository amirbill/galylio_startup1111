"use client"

import { AlertTriangle, Eye, ArrowLeft, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_URL
    ? (process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '').endsWith('/api/v1')
        ? process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '')
        : `${process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '')}/api/v1`)
    : "https://back-27em.onrender.com/api/v1"

const SHOP_LOGOS: Record<string, string> = {
    mytek: "/images/téléchargement (4).png",
    tunisianet: "/images/téléchargement (6).png",
    spacenet: "/images/spacenet-removebg-preview.png",
    technopro: "/images/technopro-logo.jpg",
    darty: "/images/Darty.png",
    batam: "/images/logo-batam.jpg",
    graiet: "/images/logo-graiet.png",
    jumbo: "/images/logo-jambo.png",
    zoom: "/images/logo-zoom.jpg",
}

interface FakePromo {
    id: string
    title: string
    brand: string
    shop: string
    image: string
    url: string
    old_scrap_old_price: number | null
    old_scrap_price: number | null
    new_scrap_price: number | null
    new_scrap_old_price: number | null
    old_price_inflated_by: number | null
    old_price_inflated_by_pct: number | null
    advertised_discount: number | null
    advertised_discount_pct: number | null
    real_increase_pct: number | null
    category: string | null
}

export default function FauxPrixPage() {
    const [products, setProducts] = useState<FakePromo[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedShop, setSelectedShop] = useState<string>("all")
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 16

    useEffect(() => {
        setLoading(true)
        fetch(`${API_URL}/products/fake-promos/list?limit=200`)
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                if (Array.isArray(data)) setProducts(data)
            })
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const shops = useMemo(() => {
        const s = new Set(products.map(p => p.shop))
        return Array.from(s).sort()
    }, [products])

    const filtered = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = !searchQuery ||
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesShop = selectedShop === "all" || p.shop === selectedShop
            return matchesSearch && matchesShop
        })
    }, [products, searchQuery, selectedShop])

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, selectedShop])

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
    const paginatedItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)))
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const formatPrice = (price: number | null | undefined) => {
        if (price == null || isNaN(price)) return "—"
        return price.toFixed(3) + " DT"
    }

    const safeNum = (val: number | null | undefined) => {
        if (val == null || isNaN(val)) return 0
        return val
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="max-w-[1400px] mx-auto px-4 py-8">
                    <Link href="/#alertes-prix" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-4 transition-colors">
                        <ArrowLeft className="size-4" />
                        Retour à l&apos;accueil
                    </Link>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center justify-center size-14 rounded-2xl bg-white/20 backdrop-blur-sm">
                            <AlertTriangle className="size-7" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                                Tous les Faux Prix Détectés
                            </h1>
                            <p className="text-blue-200 text-sm mt-1">
                                {filtered.length} produits avec des promotions suspectes
                            </p>
                        </div>
                    </div>

                    {/* Alert info */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-4 flex items-center gap-3">
                        <Eye className="size-5 text-blue-200 flex-shrink-0" />
                        <p className="text-sm text-blue-100">
                            Notre algorithme analyse l&apos;historique des prix pour détecter les promotions trompeuses.
                            Les prix barrés ont été artificiellement gonflés pour simuler une fausse réduction.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-[1400px] mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un produit..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        />
                    </div>

                    {/* Shop filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <select
                            value={selectedShop}
                            onChange={(e) => setSelectedShop(e.target.value)}
                            className="pl-10 pr-8 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none cursor-pointer min-w-[180px]"
                        >
                            <option value="all">Tous les magasins</option>
                            {shops.map(shop => (
                                <option key={shop} value={shop} className="capitalize">{shop.charAt(0).toUpperCase() + shop.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {/* No results */}
                {!loading && filtered.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <AlertTriangle className="size-12 mx-auto mb-4 text-slate-300" />
                        <p className="text-lg font-semibold">Aucun produit trouvé</p>
                        <p className="text-sm mt-1">Essayez de modifier vos filtres</p>
                    </div>
                )}

                {/* Product grid — 4 per row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {paginatedItems.map((product) => {
                        const shopLogo = SHOP_LOGOS[product.shop?.toLowerCase()] || ""

                        return (
                            <div
                                key={product.id}
                                className="bg-white rounded-2xl border-2 border-blue-200 shadow-sm hover:shadow-xl transition-all hover:border-blue-400 overflow-hidden group"
                            >
                                {/* FAUX PRIX banner */}
                                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-black py-2 text-center flex items-center justify-center gap-1.5">
                                    <AlertTriangle className="size-3.5" />
                                    FAUX PRIX DÉTECTÉ
                                </div>

                                <div className="p-4">
                                    {/* Product image + info */}
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-20 h-20 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {product.image && product.image !== "/placeholder.svg" ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-full h-full object-contain p-1"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg" }}
                                                />
                                            ) : (
                                                <div className="text-slate-300 text-xs text-center">No image</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-7 h-7 rounded-lg border border-slate-100 bg-white flex items-center justify-center p-0.5 shadow-sm flex-shrink-0">
                                                    {shopLogo ? (
                                                        <img src={shopLogo} alt={product.shop} className="max-h-full max-w-full object-contain" />
                                                    ) : (
                                                        <span className="text-[7px] font-black text-slate-600 uppercase">{product.shop}</span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-semibold text-slate-400 capitalize">{product.shop}</span>
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.brand}</p>
                                            <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight">{product.title}</h3>
                                            {product.category && <p className="text-[10px] text-slate-400 mt-0.5">{product.category}</p>}
                                        </div>
                                    </div>

                                    {/* Price rows: old promo → new promo */}
                                    <div className="rounded-xl overflow-hidden border border-slate-200">
                                        {/* Row 1: Ancienne promo */}
                                        <div className="bg-emerald-50 px-3 py-2.5 border-b border-emerald-100">
                                            <p className="text-[9px] font-semibold text-emerald-700 uppercase tracking-wide mb-1.5">Ancienne promo (réelle)</p>
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="text-center">
                                                    <p className="text-[8px] text-emerald-500 mb-0.5">Prix barré</p>
                                                    <span className="text-sm font-black text-emerald-600 line-through decoration-1">
                                                        {formatPrice(product.old_scrap_old_price)}
                                                    </span>
                                                </div>
                                                <span className="text-emerald-400 font-black text-base">→</span>
                                                <div className="text-center">
                                                    <p className="text-[8px] text-emerald-500 mb-0.5">Prix promo</p>
                                                    <span className="text-sm font-black text-emerald-700">
                                                        {formatPrice(product.old_scrap_price)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Row 2: Nouvelle promo (suspecte) */}
                                        <div className="bg-red-50 px-3 py-2.5">
                                            <p className="text-[9px] font-semibold text-red-500 uppercase tracking-wide mb-1.5">Nouvelle promo (suspecte)</p>
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="text-center">
                                                    <p className="text-[8px] text-red-400 mb-0.5">Prix barré</p>
                                                    <span className="text-sm font-black text-red-400 line-through decoration-1">
                                                        {formatPrice(product.new_scrap_old_price)}
                                                    </span>
                                                </div>
                                                <span className="text-red-400 font-black text-base">→</span>
                                                <div className="text-center">
                                                    <p className="text-[8px] text-red-400 mb-0.5">Prix promo</p>
                                                    <span className="text-sm font-black text-red-600">
                                                        {formatPrice(product.new_scrap_price)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats badges */}
                                    <div className="flex gap-2 mt-3">
                                        <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-2 text-center">
                                            <p className="text-[8px] font-bold text-red-400 uppercase">Réduc. affichée</p>
                                            <p className="text-sm font-black text-red-500">-{safeNum(product.advertised_discount_pct).toFixed(1)}%</p>
                                        </div>
                                        <div className="flex-1 bg-amber-50 border border-amber-200 rounded-lg p-2 text-center">
                                            <p className="text-[8px] font-bold text-amber-600 uppercase">Prix gonflé</p>
                                            <p className="text-sm font-black text-amber-600">+{safeNum(product.old_price_inflated_by_pct).toFixed(1)}%</p>
                                        </div>
                                        <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
                                            <p className="text-[8px] font-bold text-blue-600 uppercase">Hausse</p>
                                            <p className="text-sm font-black text-blue-600">+{safeNum(product.real_increase_pct).toFixed(1)}%</p>
                                        </div>
                                    </div>

                                    {/* Link to product */}
                                    {product.url && (
                                        <a
                                            href={product.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block mt-3 text-center text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            Voir sur {product.shop} →
                                        </a>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10 mb-6">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="size-5" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => {
                                if (totalPages <= 7) return true
                                if (page === 1 || page === totalPages) return true
                                if (Math.abs(page - currentPage) <= 1) return true
                                return false
                            })
                            .reduce<(number | string)[]>((acc, page, idx, arr) => {
                                if (idx > 0 && typeof arr[idx - 1] === 'number' && (page as number) - (arr[idx - 1] as number) > 1) {
                                    acc.push('...')
                                }
                                acc.push(page)
                                return acc
                            }, [])
                            .map((item, idx) =>
                                typeof item === 'string' ? (
                                    <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-slate-400 text-sm">...</span>
                                ) : (
                                    <button
                                        key={item}
                                        onClick={() => goToPage(item)}
                                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${currentPage === item
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:border-blue-300'
                                            }`}
                                    >
                                        {item}
                                    </button>
                                )
                            )}

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight className="size-5" />
                        </button>

                        <span className="ml-4 text-sm text-slate-500">
                            Page {currentPage} / {totalPages}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
