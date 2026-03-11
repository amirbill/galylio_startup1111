"use client"

import { AlertTriangle, Eye, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"

// Shop logo mapping
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
    parafendri: "/images/parafendri-removebg-preview.png",
    parashop: "/images/parashop-removebg-preview.png",
    "pharma-shop": "/images/pharmashop-removebg-preview.png",
    pharmashop: "/images/pharmashop-removebg-preview.png",
}

// API data shape from fake_promos collection
interface FakePromoFromAPI {
    id: string
    title: string
    brand: string
    shop: string
    image: string
    url: string
    old_scrap_old_price: number | null   // real old price
    old_scrap_price: number | null        // old promo/sale price
    new_scrap_price: number | null       // current promo price
    new_scrap_old_price: number | null   // fake "old price" they claim
    old_price_inflated_by: number | null
    old_price_inflated_by_pct: number | null
    advertised_discount: number | null
    advertised_discount_pct: number | null
    real_increase_pct: number | null
    category: string | null
}

interface FakePriceAlertsProps {
    initialData?: FakePromoFromAPI[]
}

export function FakePriceAlerts({ initialData = [] }: FakePriceAlertsProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)
    const [products, setProducts] = useState<FakePromoFromAPI[]>(initialData || [])
    const [loading, setLoading] = useState(false)

    // Client-side fallback: fetch from remote API if no server-side data
    useEffect(() => {
        if (products.length > 0) return
        setLoading(true)
        const REMOTE_API = "https://back-27em.onrender.com/api/v1"
        fetch(`${REMOTE_API}/products/fake-promos/list?limit=10`)
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setProducts(data)
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    const formatPrice = (price: number | null | undefined) => {
        if (price == null || isNaN(price)) return "—"
        return price.toFixed(3) + " DT"
    }

    const safeNum = (val: number | null | undefined) => {
        if (val == null || isNaN(val)) return 0
        return val
    }

    const getShopLogo = (shop: string) => {
        return SHOP_LOGOS[shop.toLowerCase()] || ""
    }

    const checkScroll = () => {
        if (!scrollRef.current) return
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        setCanScrollLeft(scrollLeft > 0)
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
    }

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return
        const scrollAmount = 340
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        })
        setTimeout(checkScroll, 350)
    }

    return (
        <section className="w-full max-w-[1400px] mx-auto px-4 py-10">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 text-white shadow-lg">
                        <AlertTriangle className="size-7" />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-[#2563EB] tracking-tight">
                            Attention aux Faux Prix!
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Nous détectons les fausses promotions avec des prix d&apos;origine gonflés artificiellement
                        </p>
                    </div>
                </div>
                <div className="relative w-48 h-24 md:w-[350px] md:h-40 shrink-0 hidden sm:block">
                    <img
                        src="/images/Gemini_Generated_Image_om8hf4om8hf4om8h 1.svg"
                        alt="Alert Logo"
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            {/* Alert Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center gap-4">
                <div className="flex-shrink-0">
                    <Eye className="size-6 text-blue-500" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-blue-800">
                        Notre algorithme analyse l&apos;historique des prix pour détecter les promotions trompeuses
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                        {products.length} produits suspects détectés cette semaine
                    </p>
                </div>
            </div>

            {/* Products Horizontal Scroll */}
            <div className="relative">
                {/* Left Arrow */}
                {canScrollLeft && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border-2 border-blue-200 shadow-lg flex items-center justify-center hover:bg-blue-50 hover:border-blue-400 transition-all -ml-2"
                    >
                        <ChevronLeft className="size-5 text-blue-600" />
                    </button>
                )}

                {/* Right Arrow */}
                {canScrollRight && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border-2 border-blue-200 shadow-lg flex items-center justify-center hover:bg-blue-50 hover:border-blue-400 transition-all -mr-2"
                    >
                        <ChevronRight className="size-5 text-blue-600" />
                    </button>
                )}

                {/* Scroll Container */}
                <div
                    ref={scrollRef}
                    onScroll={checkScroll}
                    className="flex gap-5 overflow-x-auto scrollbar-hide pb-2 px-1 snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                {products.map((product) => {
                    const shopLogo = getShopLogo(product.shop)

                    return (
                    <div
                        key={product.id}
                        className="bg-white rounded-2xl border-2 border-blue-200 shadow-sm hover:shadow-xl transition-all hover:border-blue-400 min-w-[340px] w-[340px] flex-shrink-0 snap-start overflow-hidden"
                    >
                        {/* Top: FAUX PRIX banner */}
                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-black py-2 text-center flex items-center justify-center gap-1.5">
                            <AlertTriangle className="size-4" />
                            FAUX PRIX DÉTECTÉ
                        </div>

                        <div className="p-5">
                            {/* Product Image + Shop Logo + Info */}
                            <div className="flex items-start gap-3 mb-4">
                                {/* Product image */}
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
                                        <div className="w-8 h-8 rounded-lg border border-slate-100 bg-white flex items-center justify-center p-0.5 shadow-sm flex-shrink-0">
                                            {shopLogo ? (
                                                <img
                                                    src={shopLogo}
                                                    alt={product.shop}
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            ) : (
                                                <span className="text-[8px] font-black text-slate-600 uppercase">{product.shop}</span>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-semibold text-slate-400 capitalize">{product.shop}</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{product.brand}</p>
                                    <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-tight">{product.title}</h3>
                                    {product.category && <p className="text-[10px] text-slate-400 mt-0.5">{product.category}</p>}
                                </div>
                            </div>

                            {/* Price Comparison — old promo vs new promo */}
                            <div className="rounded-xl overflow-hidden border border-slate-200">
                                {/* Row 1: Ancienne promo — old_scrap_old_price → old_scrap_price */}
                                <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100">
                                    <p className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wide mb-2">Ancienne promo (réelle)</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="text-center">
                                            <p className="text-[9px] text-emerald-500 mb-0.5">Prix barré</p>
                                            <span className="text-base font-black text-emerald-600 line-through decoration-1">
                                                {formatPrice(product.old_scrap_old_price)}
                                            </span>
                                        </div>
                                        <span className="text-emerald-400 font-black text-lg">→</span>
                                        <div className="text-center">
                                            <p className="text-[9px] text-emerald-500 mb-0.5">Prix promo</p>
                                            <span className="text-base font-black text-emerald-700">
                                                {formatPrice(product.old_scrap_price)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Row 2: Nouvelle promo — new_scrap_old_price → new_scrap_price */}
                                <div className="bg-red-50 px-4 py-3">
                                    <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wide mb-2">Nouvelle promo (suspecte)</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="text-center">
                                            <p className="text-[9px] text-red-400 mb-0.5">Prix barré</p>
                                            <span className="text-base font-black text-red-400 line-through decoration-1">
                                                {formatPrice(product.new_scrap_old_price)}
                                            </span>
                                        </div>
                                        <span className="text-red-400 font-black text-lg">→</span>
                                        <div className="text-center">
                                            <p className="text-[9px] text-red-400 mb-0.5">Prix promo</p>
                                            <span className="text-base font-black text-red-600">
                                                {formatPrice(product.new_scrap_price)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats badges */}
                            <div className="flex gap-3 mt-4">
                                <div className="flex-1 bg-red-50 border border-red-200 rounded-xl p-2.5 text-center">
                                    <p className="text-[9px] font-bold text-red-400 uppercase">Réduction affichée</p>
                                    <p className="text-lg font-black text-red-500">-{safeNum(product.advertised_discount_pct).toFixed(1)}%</p>
                                    <p className="text-[8px] text-red-300 font-semibold">FAUX</p>
                                </div>
                                <div className="flex-1 bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-center">
                                    <p className="text-[9px] font-bold text-amber-600 uppercase">Prix gonflé de</p>
                                    <p className="text-lg font-black text-amber-600">+{safeNum(product.old_price_inflated_by_pct).toFixed(1)}%</p>
                                    <p className="text-[8px] text-amber-400 font-semibold">{formatPrice(product.old_price_inflated_by)}</p>
                                </div>
                                <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-2.5 text-center">
                                    <p className="text-[9px] font-bold text-blue-600 uppercase">Hausse réelle</p>
                                    <p className="text-lg font-black text-blue-600">+{safeNum(product.real_increase_pct).toFixed(1)}%</p>
                                    <p className="text-[8px] text-blue-400 font-semibold">ÉCART</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    )
                })}
                </div>
            </div>

            {/* See All Button */}
            <div className="flex justify-center mt-8">
                <Link
                    href="/products/faux-prix"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-sm rounded-full shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 group"
                >
                    Voir tous les faux prix
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </section>
    )
}
