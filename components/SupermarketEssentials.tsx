"use client"

import Image from "next/image"
import { ShoppingCart, TrendingDown, ChefHat } from "lucide-react"

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

export function SupermarketEssentials() {
    const formatPrice = (price: number) => {
        return price.toFixed(3) + " DT"
    }

    const getBestPrice = (prices: SupermarketPrice[]) => {
        const availablePrices = prices.filter(p => p.available)
        if (availablePrices.length === 0) return null
        return availablePrices.reduce((min, p) => p.price < min.price ? p : min)
    }

    // Calculate total cost for the dish
    const totalBestPrice = essentialProducts.reduce((sum, product) => {
        const best = getBestPrice(product.prices)
        return sum + (best?.price || 0)
    }, 0)

    return (
        <section className="w-full max-w-[1400px] mx-auto px-4 py-10">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8 relative">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-14 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg">
                        <ChefHat className="size-7" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-[#2563EB]">
                            🍳 9offet Ettounsi
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Comparez les prix des ingrédients pour préparer ce plat traditionnel tunisien
                        </p>
                    </div>
                </div>

                {/* Tunisian Essentials Image - Enhanced Design */}
                <div className="absolute left-[60%] top-[35%] -translate-x-1/2 -translate-y-1/2 hidden xl:flex items-center justify-center pointer-events-none z-0">
                    {/* Glowing Decorative Backgrounds */}
                    <div className="absolute size-40 bg-orange-300/20 rounded-full blur-[50px] animate-pulse" />

                    {/* Animated Image Wrapper */}
                    <div className="relative animate-float">
                        <Image
                            src="/images/soumaaeja.svg"
                            alt="Soumaaeja"
                            width={240}
                            height={120}
                            className="object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.08)]"
                        />
                    </div>
                </div>

                <div className="hidden md:block bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl px-6 py-3 border border-orange-200">
                    <p className="text-xs text-orange-600 font-medium">Coût total estimé</p>
                    <p className="text-2xl font-black text-orange-600">{formatPrice(totalBestPrice)}</p>
                </div>
            </div>

            {/* Store Legend */}
            <div className="flex flex-wrap gap-4 mb-6">
                {Object.entries(storeColors).map(([store, color]) => (
                    <div key={store} className="flex items-center gap-2">
                        <span className={`size-3 rounded-full ${color}`} />
                        <span className="text-sm font-medium text-foreground">{store}</span>
                    </div>
                ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {essentialProducts.map((product) => {
                    const bestPrice = getBestPrice(product.prices)
                    const sortedPrices = [...product.prices].sort((a, b) => a.price - b.price)

                    return (
                        <div
                            key={product.id}
                            className="bg-card rounded-2xl border border-border p-3 shadow-sm hover:shadow-lg transition-all hover:border-orange-300 group"
                        >
                            {/* Product Image */}
                            <div className="relative h-16 w-full mb-2 rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
                                <div className="text-4xl">
                                    {product.id === "ess-001" && "🍅"}
                                    {product.id === "ess-002" && "🧅"}
                                    {product.id === "ess-003" && "🧄"}
                                    {product.id === "ess-004" && "🫒"}
                                    {product.id === "ess-005" && "🥚"}
                                    {product.id === "ess-006" && "🥫"}
                                    {product.id === "ess-007" && "🌶️"}
                                    {product.id === "ess-008" && "🧂"}
                                </div>
                                {bestPrice && (
                                    <div className="absolute top-1 right-1 bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                        <TrendingDown className="size-2" />
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="mb-2">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-orange-600">
                                    {product.brand}
                                </span>
                                <h3 className="text-[11px] font-semibold text-foreground line-clamp-1">
                                    {product.name}
                                </h3>
                                <span className="text-[9px] text-muted-foreground">
                                    {product.unit}
                                </span>
                            </div>

                            {/* Price Comparison */}
                            <div className="space-y-1">
                                {sortedPrices.map((sp, idx) => (
                                    <div
                                        key={sp.store}
                                        className={`flex items-center justify-between rounded-md px-1.5 py-1 ${idx === 0 && sp.available
                                            ? "bg-green-50 border border-green-200"
                                            : "bg-muted/50"
                                            }`}
                                    >
                                        <div className="flex items-center gap-1">
                                            <span className={`size-1.5 rounded-full ${storeColors[sp.store]}`} />
                                        </div>
                                        <span className={`text-[10px] font-bold ${idx === 0 && sp.available ? "text-green-600" : "text-foreground"
                                            } ${!sp.available ? "line-through text-muted-foreground" : ""}`}>
                                            {formatPrice(sp.price)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Recipe Note */}
            <div className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-200">
                <p className="text-sm text-orange-800">
                    <span className="font-bold">🍳 9offet Ettounsi:</span> Plat traditionnel tunisien à base de tomates, oignons, ail, huile d&apos;olive et œufs pochés. Simple, délicieux et économique!
                </p>
            </div>
        </section>
    )
}
