import Image from "next/image"
import { Bell, ExternalLink, Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PriceEvolutionChart } from "./price-evolution-chart"

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

export function ProductHero({ product, accentColor = "purple" }: ProductHeroProps) {
    const formatPrice = (value: number) => {
        return value.toFixed(3) + " DT"
    }

    const discountPercent = product.originalPrice
        ? Math.round((1 - product.bestPrice / product.originalPrice) * 100)
        : 0

    const bestShop = product.shopPrices[0]

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* 1. Left - Product Image */}
            <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-2xl bg-white p-4 border border-slate-100 shadow-sm shrink-0">
                <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    priority
                    className="object-contain p-2"
                />
                <div className="absolute top-2 right-2 bg-[#22C55E] text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
                    En stock
                </div>
            </div>

            {/* 2. Middle - Product Details & Shop List */}
            <div className="flex-1 min-w-0 space-y-6">
                <div>
                    <span className={`text-xs font-bold uppercase tracking-widest ${accentColor === "teal" ? "text-teal-600" : "text-purple"
                        }`}>
                        {product.brand}
                    </span>
                    <h1 className="text-2xl font-black text-[#1E293B] mt-1 leading-tight line-clamp-2">
                        {product.name}
                    </h1>
                    <p className="text-[10px] text-slate-400 mt-1">
                        Réf: {product.id}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-[#F97316]">
                        {formatPrice(product.bestPrice)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.bestPrice && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300 line-through">
                                {formatPrice(product.originalPrice)}
                            </span>
                            <span className="rounded-lg bg-[#EF4444] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                                -{discountPercent}%
                            </span>
                        </div>
                    )}
                </div>

                {/* Shop Comparison List */}
                <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        COMPARER LES PRIX
                    </h3>
                    <div className="space-y-2">
                        {product.shopPrices.slice(0, 3).map((item, idx) => (
                            <div 
                                key={item.shop}
                                className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                                    idx === 0 
                                    ? "bg-[#F0FDF4] border-[#BBF7D0]" 
                                    : "bg-[#F8FAFC] border-slate-100"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="w-1.5 h-1.5 rounded-full" 
                                        style={{ backgroundColor: getShopColor(item.shop) }}
                                    />
                                    <span className="text-sm font-bold text-[#334155]">{item.shop}</span>
                                    {idx === 0 && (
                                        <span className="bg-[#22C55E] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                                            MEILLEUR PRIX
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-sm font-bold ${idx === 0 ? "text-[#22C55E]" : "text-[#334155]"}`}>
                                        {formatPrice(item.price)}
                                    </span>
                                    <Check className="size-4 text-[#22C55E]" />
                                    <a 
                                        href={item.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={`text-[11px] font-medium text-slate-400 flex items-center gap-1 transition-colors ${accentColor === "teal" ? "hover:text-teal-600" : "hover:text-purple"
                                            }`}
                                    >
                                        Voir
                                        <ArrowRight className="size-3" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-2">
                    <Button
                        variant="outline"
                        className="flex-1 gap-2 rounded-2xl border-[#F97316] text-[#F97316] hover:bg-[#FFF7ED] h-12 text-sm font-bold shadow-sm"
                    >
                        Activer alerte
                        <Bell className="size-4" />
                    </Button>
                    {bestShop?.url && (
                        <a href={bestShop.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button className={`w-full gap-2 rounded-2xl text-white h-12 text-sm font-bold shadow-md ${accentColor === "teal"
                                    ? "bg-teal-600 hover:bg-teal-700"
                                    : "bg-purple hover:bg-purple/90"
                                }`}>
                                Voir l&apos;offre
                                <ExternalLink className="size-4" />
                            </Button>
                        </a>
                    )}
                </div>
            </div>

            {/* 3. Right - Price Chart */}
            <div className="w-full lg:w-[350px] shrink-0 self-stretch">
                <PriceEvolutionChart currentPrice={product.bestPrice} />
            </div>
        </div>
    )
}
