"use client"

import Image from "next/image"
import { ShoppingCart, TrendingDown, ChefHat } from "lucide-react"
import { useEffect, useState } from "react"
import { LogoCarousel } from "./LogoCarousel"

interface SupermarketPrice {
    store: string
    price: number
    available: boolean
}

interface EssentialProduct {
    id: string
    name: string
    brand: string
    category: string
    image: string
    prices: SupermarketPrice[]
    unit: string
}

// 9offet Ettounsi ingredients - Tunisian traditional dish
const essentialProducts: EssentialProduct[] = [
    {
        id: "ess-001",
        name: "Tomates Fraîches",
        brand: "Locale",
        category: "Légumes",
        image: "/images/tomates.svg",
        unit: "1kg",
        prices: [
            { store: "Monoprix", price: 3.250, available: true },
            { store: "Carrefour", price: 2.990, available: true },
            { store: "GeantDrive", price: 3.450, available: true },
        ]
    },
    {
        id: "ess-002",
        name: "Oignons Blancs",
        brand: "Locale",
        category: "Légumes",
        image: "/images/oignons.svg",
        unit: "1kg",
        prices: [
            { store: "Monoprix", price: 2.150, available: true },
            { store: "Carrefour", price: 1.990, available: true },
            { store: "GeantDrive", price: 2.250, available: true },
        ]
    },
    {
        id: "ess-003",
        name: "Ail Frais",
        brand: "Locale",
        category: "Légumes",
        image: "/images/ail.svg",
        unit: "250g",
        prices: [
            { store: "Monoprix", price: 4.500, available: true },
            { store: "Carrefour", price: 4.250, available: true },
            { store: "GeantDrive", price: 4.750, available: false },
        ]
    },
    {
        id: "ess-004",
        name: "Huile Végétale",
        brand: "Nejma",
        category: "Huiles",
        image: "/images/huile.svg",
        unit: "1L",
        prices: [
            { store: "Monoprix", price: 4.850, available: true },
            { store: "Carrefour", price: 4.690, available: true },
            { store: "GeantDrive", price: 4.950, available: true },
        ]
    },
    {
        id: "ess-005",
        name: "Œufs Frais",
        brand: "El Mazraa",
        category: "Produits Frais",
        image: "/images/oeufs.svg",
        unit: "6 pcs",
        prices: [
            { store: "Monoprix", price: 3.750, available: true },
            { store: "Carrefour", price: 3.590, available: true },
            { store: "GeantDrive", price: 3.890, available: true },
        ]
    },
    {
        id: "ess-006",
        name: "Concentré de Tomates",
        brand: "Sicam",
        category: "Conserves",
        image: "/images/concentre.svg",
        unit: "400g",
        prices: [
            { store: "Monoprix", price: 1.950, available: true },
            { store: "Carrefour", price: 1.850, available: true },
            { store: "GeantDrive", price: 2.100, available: true },
        ]
    },
    {
        id: "ess-007",
        name: "Harissa",
        brand: "Cap Bon",
        category: "Épices",
        image: "/images/harissa.svg",
        unit: "135g",
        prices: [
            { store: "Monoprix", price: 1.450, available: true },
            { store: "Carrefour", price: 1.350, available: true },
            { store: "GeantDrive", price: 1.550, available: true },
        ]
    },
    {
        id: "ess-008",
        name: "Sel de Table",
        brand: "Cotusal",
        category: "Épices",
        image: "/images/sel.svg",
        unit: "500g",
        prices: [
            { store: "Monoprix", price: 0.850, available: true },
            { store: "Carrefour", price: 0.750, available: true },
            { store: "GeantDrive", price: 0.900, available: true },
        ]
    },
]

const storeColors: Record<string, string> = {
    Monoprix: "bg-red-500",
    Carrefour: "bg-blue-600",
    GeantDrive: "bg-green-600",
}

const productIcons: Record<string, string> = {
    "ess-001": "🍅",
    "ess-002": "🧅",
    "ess-003": "🧄",
    "ess-004": "🫒",
    "ess-005": "🥚",
    "ess-006": "🥫",
    "ess-007": "🌶️",
    "ess-008": "🧂",
}

const getVisibleWidgetCount = (width: number) => {
    if (width >= 1440) return 5
    if (width >= 1200) return 4
    if (width >= 900) return 3
    if (width >= 640) return 2
    return 1
}

export function SupermarketEssentials() {
    const [visibleCount, setVisibleCount] = useState(1)

    const formatPrice = (price: number) => {
        return price.toFixed(3) + " DT"
    }

    const getBestPrice = (prices: SupermarketPrice[]) => {
        const availablePrices = prices.filter(p => p.available)
        if (availablePrices.length === 0) return null
        return availablePrices.reduce((min, p) => p.price < min.price ? p : min)
    }

    useEffect(() => {
        const updateVisibleCount = () => {
            setVisibleCount(getVisibleWidgetCount(window.innerWidth))
        }

        updateVisibleCount()
        window.addEventListener("resize", updateVisibleCount)

        return () => window.removeEventListener("resize", updateVisibleCount)
    }, [])

    // Calculate total cost for the dish
    const totalBestPrice = essentialProducts.reduce((sum, product) => {
        const best = getBestPrice(product.prices)
        return sum + (best?.price || 0)
    }, 0)

    const storeTotals = Object.keys(storeColors).map((store) => {
        const matchingPrices = essentialProducts.map((product) =>
            product.prices.find((price) => price.store === store)
        )
        const isAvailable = matchingPrices.every((price) => price?.available)
        const totalPrice = isAvailable
            ? matchingPrices.reduce((sum, price) => sum + (price?.price || 0), 0)
            : null

        return {
            store,
            isAvailable,
            totalPrice,
        }
    })

    const widgetCards = essentialProducts.map((product) => {
        const bestPrice = getBestPrice(product.prices)
        const sortedPrices = [...product.prices].sort((a, b) => a.price - b.price)

        return (
            <div
                key={product.id}
                className="group flex h-full min-h-72 flex-col rounded-[22px] border border-border bg-card p-4 shadow-sm transition-all hover:border-orange-300 hover:shadow-lg"
            >
                <div className="relative mb-4 flex h-20 w-full items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-orange-50 to-red-50">
                    <div className="text-5xl">{productIcons[product.id]}</div>
                    {bestPrice && (
                        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-green-500 px-2 py-1 text-[10px] font-bold text-white">
                            <TrendingDown className="size-3" />
                            Deal
                        </div>
                    )}
                </div>

                <div className="mb-4 flex min-h-20 flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-600 sm:text-[11px]">
                        {product.brand}
                    </span>
                    <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-tight text-foreground sm:text-base">
                        {product.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-[12px] text-muted-foreground sm:text-sm">
                            {product.unit}
                        </span>
                        <span className="shrink-0 rounded-full bg-orange-50 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-orange-600 sm:text-[10px]">
                            {product.category}
                        </span>
                    </div>
                </div>

                <div className="mt-auto space-y-2">
                    {sortedPrices.map((sp, idx) => (
                        <div
                            key={sp.store}
                            className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 ${idx === 0 && sp.available
                                ? "border border-green-200 bg-green-50"
                                : "bg-muted/50"
                                }`}
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <span className={`size-2 rounded-full ${storeColors[sp.store]}`} />
                                <span className="truncate text-[11px] font-medium text-muted-foreground sm:text-xs">
                                    {sp.store}
                                </span>
                            </div>
                            <span className={`shrink-0 text-[11px] font-bold sm:text-xs ${idx === 0 && sp.available ? "text-green-600" : "text-foreground"
                                } ${!sp.available ? "line-through text-muted-foreground" : ""}`}>
                                {formatPrice(sp.price)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        )
    })

    widgetCards.push(
        <div
            key="summary"
            className="group flex h-full min-h-72 flex-col rounded-[22px] border border-orange-200 bg-card p-4 shadow-sm"
        >
            <div className="relative mb-4 flex h-20 w-full items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-orange-100 via-amber-50 to-red-100">
                <div className="flex items-center justify-center rounded-full bg-white/90 p-3 shadow-sm">
                    <ShoppingCart className="size-6 text-orange-600" />
                </div>
                <div className="absolute right-2 top-2 rounded-full bg-orange-500 px-2 py-1 text-[10px] font-bold text-white">
                    Total
                </div>
            </div>

            <div className="mb-4 flex min-h-20 flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-600 sm:text-[11px]">
                    Panier type
                </span>
                <h3 className="mt-1 text-[15px] font-semibold text-foreground sm:text-base">
                    Coût total estimé
                </h3>
                <span className="mt-2 text-xl font-black text-orange-600 sm:text-2xl">
                    {formatPrice(totalBestPrice)}
                </span>
            </div>

            <div className="mt-auto space-y-2">
                <div className="flex items-center justify-between gap-3 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2">
                    <span className="text-[11px] font-medium text-orange-700 sm:text-xs">
                        Panier optimal
                    </span>
                    <span className="shrink-0 text-[11px] font-bold text-orange-600 sm:text-xs">
                        {formatPrice(totalBestPrice)}
                    </span>
                </div>
                {storeTotals.map(({ store, isAvailable, totalPrice }) => (
                    <div
                        key={store}
                        className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2 ${isAvailable
                            ? "bg-muted/50"
                            : "border border-dashed border-border bg-muted/35"
                            }`}
                    >
                        <div className="flex min-w-0 items-center gap-2">
                            <span className={`size-2 rounded-full ${storeColors[store]}`} />
                            <span className="truncate text-[11px] font-medium text-muted-foreground sm:text-xs">
                                {store}
                            </span>
                        </div>
                        <span className={`shrink-0 text-[11px] font-bold sm:text-xs ${isAvailable ? "text-foreground" : "text-muted-foreground"}`}>
                            {isAvailable && totalPrice !== null ? formatPrice(totalPrice) : "Indispo"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <section className="w-full max-w-340 mx-auto px-4 py-8">
            {/* Section Header */}
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between xl:gap-8">
                <div className="flex max-w-2xl items-start gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-orange-400 to-red-500 text-white shadow-lg">
                        <ChefHat className="size-6" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-xl sm:text-[1.75rem] font-black text-[#2563EB]">
                            🍳 9offet Ettounsi
                        </h2>
                        <p className="mt-1 max-w-xl text-[13px] text-muted-foreground sm:text-sm">
                            Comparez les prix des ingrédients pour préparer ce plat traditionnel tunisien
                        </p>
                    </div>
                </div>

                <div className="flex w-full justify-center lg:max-w-sm lg:justify-end">
                    <div className="relative flex h-24 w-full max-w-xs items-center justify-center overflow-hidden rounded-3xl bg-linear-to-br from-orange-50 via-white to-blue-50 px-4 shadow-sm ring-1 ring-orange-100/70 sm:h-28 sm:max-w-sm">
                        <div className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-200/25 blur-3xl" />
                        <div className="relative animate-float">
                        <Image
                            src="/images/soumaaeja.svg"
                            alt="Soumaaeja"
                            width={250}
                            height={110}
                            className="h-auto w-full max-w-xs object-contain drop-shadow-[0_12px_12px_rgba(0,0,0,0.08)]"
                        />
                        </div>
                    </div>
                </div>
            </div>

            {/* Store Legend */}
            <div className="mb-5 flex flex-wrap gap-3">
                {Object.entries(storeColors).map(([store, color]) => (
                    <div key={store} className="flex items-center gap-2">
                        <span className={`size-2.5 rounded-full ${color}`} />
                        <span className="text-[13px] font-medium text-foreground sm:text-sm">{store}</span>
                    </div>
                ))}
            </div>

            <LogoCarousel
                cards={widgetCards}
                visibleCount={visibleCount}
                label="essential widgets"
                maxWidthClassName="max-w-full"
            />

            {/* Recipe Note */}
            <div className="mt-5 rounded-2xl border border-orange-200 bg-linear-to-r from-orange-50 to-red-50 p-3.5 sm:p-4">
                <p className="text-[13px] text-orange-800 sm:text-sm">
                    <span className="font-bold">🍳 9offet Ettounsi:</span> Plat traditionnel tunisien à base de tomates, oignons, ail, huile d&apos;olive et œufs pochés. Simple, délicieux et économique!
                </p>
            </div>
        </section>
    )
}
