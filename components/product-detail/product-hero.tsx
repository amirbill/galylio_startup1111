"use client"

import Image from "next/image"
import { useState } from "react"
import { Bell, ExternalLink, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts"

// Placeholder price history data
const priceHistoryData = [
    { month: "Jan", price: 65 },
    { month: "Fév", price: 70 },
    { month: "Mar", price: 68 },
    { month: "Avr", price: 72 },
    { month: "Mai", price: 75 },
    { month: "Juin", price: 78 },
    { month: "Juil", price: 82 },
    { month: "Août", price: 80 },
    { month: "Sep", price: 85 },
    { month: "Oct", price: 88 },
]

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

interface ProductHeroProps {
    product: Product
    accentColor?: "purple" | "teal"
}

const shopColorsMap: Record<string, string> = {
    mytek: "bg-red-500",
    spacenet: "bg-blue-600",
    tunisianet: "bg-orange-500",
    parashop: "bg-teal-500",
    "pharma-shop": "bg-emerald-500",
    parafendri: "bg-cyan-500",
    monoprix: "bg-red-600",
    carrefour: "bg-blue-500",
    geantdrive: "bg-green-600",
    technopro: "bg-purple-500",
    darty: "bg-yellow-600",
}

function getShopColor(shop: string): string {
    return shopColorsMap[shop.toLowerCase()] || "bg-gray-400";
}

export function ProductHero({ product, accentColor = "purple" }: ProductHeroProps) {
    const [selectedImage] = useState(0)

    const formatPrice = (value: number) => {
        return value.toFixed(3) + " DT"
    }

    // Calculate discount percentage
    const discountPercent = product.originalPrice 
        ? Math.round((1 - product.bestPrice / product.originalPrice) * 100)
        : 0

    // Get best shop (first in sorted list)
    const bestShop = product.shopPrices[0]

    return (
        <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
            {/* Left Section - Product Info */}
            <div className="grid gap-8 md:grid-cols-[200px_1fr]">
                {/* Image Gallery */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-xl bg-card p-4 border border-border">
                        <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-contain"
                        />
                        {/* Availability badge */}
                        <span className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            product.inStock 
                                ? "bg-green-500 text-white" 
                                : "bg-red-100 text-red-600"
                        }`}>
                            {product.inStock ? "En stock" : "Épuisé"}
                        </span>
                    </div>
                </div>

                {/* Product Details */}
                <div className="flex flex-col gap-4">
                    <div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                            accentColor === "teal" ? "text-teal-600" : "text-purple"
                        }`}>
                            {product.brand}
                        </span>
                        <h1 className="text-2xl font-bold text-foreground mt-1">{product.name}</h1>
                        <p className="text-xs text-muted-foreground mt-1">
                            Réf: {product.id}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className={`text-3xl font-black ${
                            accentColor === "teal" ? "text-teal-600" : "text-orange"
                        }`}>
                            {formatPrice(product.bestPrice)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.bestPrice && (
                            <>
                                <span className="text-sm text-muted-foreground line-through">
                                    {formatPrice(product.originalPrice)}
                                </span>
                                <span className="rounded bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                                    -{discountPercent}%
                                </span>
                            </>
                        )}
                    </div>

                    {/* Shop Prices Comparison */}
                    {product.shopPrices.length > 0 && (
                        <div className="mt-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Comparer les prix
                            </span>
                            <div className="mt-2 flex flex-col gap-2">
                                {product.shopPrices.map((sp, idx) => (
                                    <div 
                                        key={sp.shop} 
                                        className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                                            idx === 0 
                                                ? "bg-green-50 border-2 border-green-300" 
                                                : "bg-muted/50 border border-border"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`w-2 h-2 rounded-full ${getShopColor(sp.shop)}`} />
                                            <span className="text-sm font-semibold text-foreground">
                                                {sp.shop}
                                            </span>
                                            {idx === 0 && (
                                                <span className="text-[10px] font-bold uppercase bg-green-500 text-white px-2 py-0.5 rounded-full">
                                                    Meilleur prix
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-sm font-bold ${
                                                idx === 0 ? "text-green-600" : "text-foreground"
                                            }`}>
                                                {formatPrice(sp.price)}
                                            </span>
                                            {sp.available ? (
                                                <Check className="size-4 text-green-500" />
                                            ) : (
                                                <X className="size-4 text-red-400" />
                                            )}
                                            {sp.url && (
                                                <a 
                                                    href={sp.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-purple hover:underline text-xs font-medium"
                                                >
                                                    Voir →
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                        <Button
                            variant="outline"
                            className={`gap-2 rounded-full bg-transparent ${
                                accentColor === "teal" 
                                    ? "border-teal-500 text-teal-600 hover:bg-teal-50" 
                                    : "border-orange text-orange hover:bg-orange/10"
                            }`}
                        >
                            Activer alerte
                            <Bell className="size-4" />
                        </Button>
                        {bestShop?.url && (
                            <a href={bestShop.url} target="_blank" rel="noopener noreferrer">
                                <Button className={`gap-2 rounded-full ${
                                    accentColor === "teal"
                                        ? "bg-teal-600 text-white hover:bg-teal-700"
                                        : "bg-purple text-purple-foreground hover:bg-purple/90"
                                }`}>
                                    Voir l&apos;offre
                                    <ExternalLink className="size-4" />
                                </Button>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Section - Price Chart */}
            <div className="w-full rounded-2xl bg-card p-4 shadow-sm lg:w-[320px] border border-border">
                <h3 className="mb-4 text-center text-sm font-semibold text-muted-foreground">
                    ÉVOLUTION DU PRIX
                </h3>
                <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={priceHistoryData}>
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                                axisLine={false}
                                tickLine={false}
                                width={30}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#0D9488"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
