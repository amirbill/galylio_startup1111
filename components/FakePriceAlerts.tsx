"use client"

import Image from "next/image"
import { AlertTriangle, Eye, TrendingUp, BadgePercent } from "lucide-react"

interface FakeDiscountProduct {
    id: string
    name: string
    brand: string
    shop: string
    image: string
    currentPrice: number
    claimedOriginalPrice: number
    realOriginalPrice: number
    discountClaimed: number
    realDiscount: number
    detectionDate: string
}

// Fake but realistic products with suspicious discount patterns
const fakeDiscountProducts: FakeDiscountProduct[] = [
    {
        id: "fake-001",
        name: "Sérum Vitamine C 30ml",
        brand: "L'Oréal Paris",
        shop: "Parashop",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200",
        currentPrice: 45.900,
        claimedOriginalPrice: 89.900,
        realOriginalPrice: 52.500,
        discountClaimed: 49,
        realDiscount: 13,
        detectionDate: "Il y a 2 jours"
    },
    {
        id: "fake-002",
        name: "Crème Anti-Âge Nuit 50ml",
        brand: "Vichy",
        shop: "Pharma-Shop",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200",
        currentPrice: 78.500,
        claimedOriginalPrice: 145.000,
        realOriginalPrice: 89.900,
        discountClaimed: 46,
        realDiscount: 13,
        detectionDate: "Hier"
    },
    {
        id: "fake-003",
        name: "Huile de Coco Bio 200ml",
        brand: "SO'BiO étic",
        shop: "Parafendri",
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200",
        currentPrice: 22.900,
        claimedOriginalPrice: 42.000,
        realOriginalPrice: 26.500,
        discountClaimed: 45,
        realDiscount: 14,
        detectionDate: "Aujourd'hui"
    },
    {
        id: "fake-004",
        name: "Shampooing Réparateur 250ml",
        brand: "Ducray",
        shop: "Parashop",
        image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=200",
        currentPrice: 19.900,
        claimedOriginalPrice: 35.900,
        realOriginalPrice: 23.500,
        discountClaimed: 45,
        realDiscount: 15,
        detectionDate: "Il y a 3 jours"
    },
    {
        id: "fake-005",
        name: "Gel Douche Surgras 500ml",
        brand: "Bioderma",
        shop: "Pharma-Shop",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200",
        currentPrice: 15.500,
        claimedOriginalPrice: 28.000,
        realOriginalPrice: 17.900,
        discountClaimed: 45,
        realDiscount: 13,
        detectionDate: "Hier"
    },
    {
        id: "fake-006",
        name: "Protection Solaire SPF50 100ml",
        brand: "La Roche-Posay",
        shop: "Parafendri",
        image: "https://images.unsplash.com/photo-1556227834-09f1de7a7d14?w=200",
        currentPrice: 55.000,
        claimedOriginalPrice: 99.000,
        realOriginalPrice: 62.900,
        discountClaimed: 44,
        realDiscount: 13,
        detectionDate: "Aujourd'hui"
    },
]

const shopColors: Record<string, string> = {
    Parashop: "bg-teal-500",
    "Pharma-Shop": "bg-emerald-500",
    Parafendri: "bg-cyan-500",
}

export function FakePriceAlerts() {
    const formatPrice = (price: number) => {
        return price.toFixed(3) + " DT"
    }

    return (
        <section className="w-full max-w-[1400px] mx-auto px-4 py-10">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-14 rounded-2xl bg-gradient-to-br from-red-400 to-orange-600 text-white shadow-lg">
                        <AlertTriangle className="size-7" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-4xl font-black text-[#2563EB] tracking-tight">
                            Attention aux Prix Mensongers!
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Nous détectons les fausses promotions avec des prix d&apos;origine gonflés artificiellement
                        </p>
                    </div>
                </div>
                <div className="relative w-72 h-32 md:w-[450px] md:h-48 shrink-0">
                    <img
                        src="/images/Gemini_Generated_Image_om8hf4om8hf4om8h 1.svg"
                        alt="Alert Logo"
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            {/* Alert Banner */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-4">
                <div className="flex-shrink-0">
                    <Eye className="size-6 text-red-500" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-red-800">
                        Notre algorithme analyse l&apos;historique des prix pour détecter les promotions trompeuses
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                        {fakeDiscountProducts.length} produits suspects détectés cette semaine
                    </p>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {fakeDiscountProducts.map((product) => (
                    <div
                        key={product.id}
                        className="bg-card rounded-2xl border-2 border-red-200 p-3 shadow-sm hover:shadow-lg transition-all hover:border-red-400"
                    >
                        {/* Product Image with Warning Badge */}
                        <div className="relative h-24 w-full mb-3 rounded-xl overflow-hidden bg-muted/30">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-[9px] font-bold py-1 text-center flex items-center justify-center gap-1">
                                <AlertTriangle className="size-3" />
                                PRIX MENSONGER
                            </div>
                            <div className={`absolute bottom-2 left-2 ${shopColors[product.shop] || "bg-gray-500"} text-white text-[8px] font-bold px-2 py-0.5 rounded-full`}>
                                {product.shop}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="mb-3">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                                {product.brand}
                            </span>
                            <h3 className="text-[11px] font-semibold text-foreground line-clamp-2 leading-tight">
                                {product.name}
                            </h3>
                        </div>

                        {/* Price Analysis */}
                        <div className="space-y-2 p-2 bg-red-50 rounded-lg">
                            {/* Claimed Discount */}
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] text-red-600 font-medium">
                                    Réduction affichée:
                                </span>
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] line-through text-red-400">
                                        {formatPrice(product.claimedOriginalPrice)}
                                    </span>
                                    <span className="bg-red-500 text-white text-[8px] font-bold px-1 rounded">
                                        -{product.discountClaimed}%
                                    </span>
                                </div>
                            </div>

                            {/* Real Price History */}
                            <div className="flex items-center justify-between border-t border-red-200 pt-2">
                                <span className="text-[9px] text-green-700 font-medium">
                                    Vrai prix d&apos;origine:
                                </span>
                                <span className="text-[10px] font-bold text-green-600">
                                    {formatPrice(product.realOriginalPrice)}
                                </span>
                            </div>

                            {/* Current Price */}
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] text-foreground font-medium">
                                    Prix actuel:
                                </span>
                                <span className="text-sm font-black text-foreground">
                                    {formatPrice(product.currentPrice)}
                                </span>
                            </div>

                            {/* Real Discount */}
                            <div className="flex items-center justify-between bg-green-100 rounded px-2 py-1">
                                <span className="text-[9px] text-green-700 font-semibold">
                                    Vraie réduction:
                                </span>
                                <span className="text-[11px] font-bold text-green-600">
                                    -{product.realDiscount}%
                                </span>
                            </div>
                        </div>

                        {/* Detection Date */}
                        <div className="mt-2 text-center">
                            <span className="text-[8px] text-muted-foreground">
                                Détecté: {product.detectionDate}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
