"use client"

import Image from "next/image"
import { TrendingUp, Star, Clock, ShoppingCart } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

interface ShopDataWidgetProps {
    shopName: string
    shopLogo: string
    location: string
    revenue: string
    traffic: string
    dataPoints: string
    demographics: string
    rating: number
    reviewCount: number
    lastUpdated: string
    price: string
    chartData: { value: number }[]
    trending?: boolean
}

export function ShopDataWidget({
    shopName,
    shopLogo,
    location,
    revenue,
    traffic,
    dataPoints,
    demographics,
    rating,
    reviewCount,
    lastUpdated,
    price,
    chartData,
    trending = false,
}: ShopDataWidgetProps) {
    return (
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:shadow-lg">
            {/* Content - blurs on hover */}
            <div className="transition-all duration-300 group-hover:blur-sm">
            {/* Header with Logo and Info */}
            <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-lg border border-border bg-background p-2">
                        <Image
                            src={shopLogo}
                            alt={shopName}
                            width={40}
                            height={40}
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-foreground">{shopName}</h3>
                        <p className="text-xs text-muted-foreground">{location}</p>
                    </div>
                </div>
                {trending && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500">
                        <TrendingUp className="size-3" />
                        Trending
                    </span>
                )}
            </div>

            {/* Chart */}
            <div className="mb-4 h-20">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id={`gradient-${shopName}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="oklch(0.75 0.15 165)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="oklch(0.75 0.15 165)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="oklch(0.75 0.15 165)"
                            strokeWidth={2}
                            fill={`url(#gradient-${shopName})`}
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Metrics Grid */}
            <div className="mb-4 grid grid-cols-2 gap-3">
                <div>
                    <p className="text-xs text-muted-foreground">REVENUE</p>
                    <p className="text-lg font-semibold text-foreground">{revenue}</p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">TRAFFIC</p>
                    <p className="text-lg font-semibold text-foreground">{traffic}</p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">DATA POINTS</p>
                    <p className="text-lg font-semibold text-foreground">{dataPoints}</p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">DEMOGRAPHICS</p>
                    <p className="text-sm font-medium text-foreground">{demographics}</p>
                </div>
            </div>

            {/* Footer with Rating and Price */}
            <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <Star className="size-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-semibold text-foreground">{rating}</span>
                        <span className="text-xs text-muted-foreground">({reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        {lastUpdated}
                    </div>
                </div>
                <div className="text-2xl font-bold text-emerald-500">{price}</div>
            </div>
            </div>

            {/* Overlay with Buy Data Button - appears on hover */}
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                <button className="flex items-center gap-2 rounded-full bg-purple px-6 py-3 text-sm font-semibold text-purple-foreground shadow-lg transition-transform hover:scale-105">
                    <ShoppingCart className="size-5" />
                    Buy Data
                </button>
            </div>
        </div>
    )
}
