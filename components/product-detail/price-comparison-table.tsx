"use client"

import { Truck, ExternalLink, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"

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

interface PriceComparisonTableProps {
    product: Product
    accentColor?: "purple" | "teal"
}

const shopColorsMap: Record<string, string> = {
    mytek: "#DC2626",
    spacenet: "#2563EB",
    tunisianet: "#F97316",
    parashop: "#14B8A6",
    "pharma-shop": "#10B981",
    parafendri: "#06B6D4",
    technopro: "#7C3AED",
    darty: "#CA8A04",
}

function getShopColor(shop: string): string {
    return shopColorsMap[shop.toLowerCase()] || "#6B7280";
}

export function PriceComparisonTable({ product, accentColor = "purple" }: PriceComparisonTableProps) {
    const formatPrice = (value: number) => {
        return value.toFixed(3) + " DT"
    }

    return (
        <div className="rounded-2xl bg-card p-6 shadow-sm border border-border">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className={`text-xl font-bold italic ${
                    accentColor === "teal" ? "text-teal-600" : "text-purple"
                }`}>
                    Comparer les prix
                </h2>
                <span className="text-sm text-muted-foreground">
                    {product.shopPrices.length} boutique{product.shopPrices.length > 1 ? "s" : ""}
                </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Boutique</th>
                            <th className="py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Prix</th>
                            <th className="py-3 text-left text-xs font-semibold uppercase text-muted-foreground">Ancien prix</th>
                            <th className="py-3 text-center text-xs font-semibold uppercase text-muted-foreground">Stock</th>
                            <th className="py-3 text-center text-xs font-semibold uppercase text-muted-foreground">Livraison</th>
                            <th className="py-3 text-right text-xs font-semibold uppercase text-muted-foreground">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {product.shopPrices.map((item, idx) => (
                            <tr
                                key={item.shop}
                                className={`transition-colors hover:bg-muted/30 ${
                                    idx === 0 ? "bg-green-50/50" : ""
                                }`}
                            >
                                {/* Store */}
                                <td className="py-4 pr-4">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: getShopColor(item.shop) }}
                                        />
                                        <span
                                            className="text-sm font-bold"
                                            style={{ color: getShopColor(item.shop) }}
                                        >
                                            {item.shop}
                                        </span>
                                        {idx === 0 && (
                                            <span className="text-[10px] font-bold uppercase bg-green-500 text-white px-2 py-0.5 rounded-full">
                                                Meilleur prix
                                            </span>
                                        )}
                                    </div>
                                </td>

                                {/* Price */}
                                <td className="px-4 py-4">
                                    <span className={`text-sm font-bold ${
                                        idx === 0 ? "text-green-600" : (accentColor === "teal" ? "text-teal-600" : "text-purple")
                                    }`}>
                                        {formatPrice(item.price)}
                                    </span>
                                </td>

                                {/* Old Price */}
                                <td className="px-4 py-4">
                                    {item.oldPrice && item.oldPrice > item.price ? (
                                        <span className="text-sm text-muted-foreground line-through">
                                            {formatPrice(item.oldPrice)}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">-</span>
                                    )}
                                </td>

                                {/* Stock Status */}
                                <td className="px-4 py-4 text-center">
                                    <span
                                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                                            item.available
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {item.available ? (
                                            <>
                                                <Check className="size-3" />
                                                En stock
                                            </>
                                        ) : (
                                            <>
                                                <X className="size-3" />
                                                Rupture
                                            </>
                                        )}
                                    </span>
                                </td>

                                {/* Delivery */}
                                <td className="px-4 py-4 text-center">
                                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                                        <Truck className="size-3" />
                                        Livraison
                                    </div>
                                </td>

                                {/* Action */}
                                <td className="py-4 pl-4 text-right">
                                    {item.url ? (
                                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                                            <Button
                                                size="sm"
                                                className={`gap-1 rounded-full text-xs ${
                                                    accentColor === "teal"
                                                        ? "bg-teal-600 text-white hover:bg-teal-700"
                                                        : "bg-purple text-purple-foreground hover:bg-purple/90"
                                                }`}
                                            >
                                                Voir l&apos;offre
                                                <ExternalLink className="size-3" />
                                            </Button>
                                        </a>
                                    ) : (
                                        <Button
                                            size="sm"
                                            disabled
                                            className="gap-1 rounded-full text-xs"
                                        >
                                            Non disponible
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {product.shopPrices.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                    Aucune offre disponible pour ce produit.
                </div>
            )}
        </div>
    )
}
