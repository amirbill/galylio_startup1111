"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, X } from "lucide-react"
import { getProductFallbackImage } from "@/lib/product-fallback-image"

interface ShopPrice {
    shop: string
    price: number
    oldPrice?: number
    available: boolean
    url?: string
}

interface ProductCardProps {
    id?: string
    name: string
    brand: string
    bestPrice: number
    originalPrice?: number
    image: string
    description: string
    inStock?: boolean
    shopPrices?: ShopPrice[]
    linkPrefix?: string
}

// Shop colors for visual distinction (case-insensitive lookup)
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

export function ProductCard({
    id = "product",
    name,
    brand,
    bestPrice,
    originalPrice,
    image,
    description,
    inStock = false,
    shopPrices = [],
    linkPrefix = "/products",
}: ProductCardProps) {
    const formatPrice = (value: number) => {
        return value.toFixed(3) + " DT"
    }

    const productLink = `${linkPrefix}/${id}`

    return (
        <div className="flex w-[220px] shrink-0 flex-col rounded-2xl border border-border bg-card p-3 shadow-sm transition-all hover:shadow-lg">
            {/* Image Container */}
            <Link
                href={productLink}
                className="relative mb-3 h-32 w-full overflow-hidden rounded-xl bg-muted/30 block"
            >
                <Image
                    src={image || getProductFallbackImage(name)}
                    alt={name}
                    fill
                    sizes="(max-width: 220px) 100vw, 220px"
                    className="object-contain p-2 transition-transform duration-300 hover:scale-105"
                />
                {/* Availability Badge */}
                <span className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold ${inStock
                    ? "bg-green-500 text-white"
                    : "bg-red-100 text-red-600"
                    }`}>
                    {inStock ? "En stock" : "Épuisé"}
                </span>
            </Link>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-2">
                {/* Brand */}
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple">
                    {brand}
                </span>

                {/* Product Name */}
                <Link
                    href={productLink}
                    className="text-xs font-semibold leading-tight text-card-foreground hover:text-purple transition-colors line-clamp-2 min-h-[32px]"
                >
                    {name}
                </Link>

                {/* Best Price */}
                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-orange">
                        {formatPrice(bestPrice)}
                    </span>
                    {originalPrice && originalPrice > bestPrice && (
                        <span className="text-[10px] text-muted-foreground line-through">
                            {formatPrice(originalPrice)}
                        </span>
                    )}
                </div>

                {/* Shop Prices Comparison */}
                {shopPrices.length > 0 && (
                    <div className="mt-1 flex flex-col gap-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                            Comparer les prix
                        </span>
                        <div className="flex flex-col gap-1">
                            {shopPrices.slice(0, 3).map((sp, idx) => (
                                <div
                                    key={sp.shop}
                                    className={`flex items-center justify-between rounded-lg px-2 py-1 ${idx === 0
                                        ? "bg-green-50 border border-green-200"
                                        : "bg-muted/50"
                                        }`}
                                >
                                    <div className="flex items-center gap-1.5">
                                        <span className={`w-1.5 h-1.5 rounded-full ${getShopColor(sp.shop)}`} />
                                        <span className="text-[10px] font-medium text-foreground">
                                            {sp.shop}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className={`text-[10px] font-bold ${idx === 0 ? "text-green-600" : "text-foreground"
                                            }`}>
                                            {formatPrice(sp.price)}
                                        </span>
                                        {sp.available ? (
                                            <Check className="size-3 text-green-500" />
                                        ) : (
                                            <X className="size-3 text-red-400" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <Link
                    href={productLink}
                    className="mt-auto flex items-center justify-center gap-1.5 rounded-full bg-purple py-2 text-[11px] font-bold text-purple-foreground transition-colors hover:bg-purple/90"
                >
                    Voir les offres
                    <ArrowRight className="size-3.5" />
                </Link>
            </div>
        </div>
    )
}
