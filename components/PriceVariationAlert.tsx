"use client"

import Image from "next/image"
import { AlertCircle, TrendingUp, Check, ExternalLink, Star } from "lucide-react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts'

import { useState, useEffect } from "react"

interface PriceVariationAlertProps {
    product: any
}

// Generate some fake but realistic historical data for the chart
const generateChartData = (basePrice: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months.map((month, index) => {
        // Create a trend that goes up towards the end
        const variation = Math.sin(index / 2) * (basePrice * 0.1) + (index * (basePrice * 0.02))
        const price = basePrice + variation
        return {
            name: month,
            price: parseFloat(price.toFixed(3)),
            prediction: index > 8 ? price + (basePrice * 0.05) : null
        }
    })
}

const FALLBACK_PRODUCT = {
    name: "Smartphone Galaxy S24 Ultra",
    brand: "SAMSUNG",
    image: "/placeholder.svg",
    description: "Le Galaxy S24 Ultra est le fleuron de Samsung, offrant des performances exceptionnelles et un écran magnifique. Profitez de la meilleure technologie mobile avec AI intégrée.",
    bestPrice: 4299.000,
    originalPrice: 4899.000,
    inStock: true,
    shopPrices: [{ shop: "Tunisianet", price: 4299.000 }]
}

export function PriceVariationAlert({ product: initialProduct }: PriceVariationAlertProps) {
    const [isMounted, setIsMounted] = useState(false)
    const product = initialProduct || FALLBACK_PRODUCT

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Removed early return to allow partial SSR of header and product card
    // Only the interactive chart remains deferred to client mount

    // Calculate best price if not present
    const sortedPrices = [...(product.shopPrices || [])].sort((a, b) => a.price - b.price);
    const bestPrice = product.bestPrice || sortedPrices[0]?.price || 0;
    const cheapestShopName = sortedPrices[0]?.shop || "Boutique";

    const chartData = generateChartData(bestPrice)
    const formatPrice = (price: number | undefined | null) => {
        if (price === undefined || price === null) return "0.000 TND"
        return price.toFixed(3) + " TND"
    }

    return (
        <section className="w-full max-w-[1400px] mx-auto px-4 py-16 mb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16 px-4">
                <div className="text-center md:text-right max-w-4xl">
                    <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-[#2563EB] tracking-tight mb-2 leading-tight">
                        Alerte prédictive de variation de prix
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base font-semibold leading-relaxed">
                        Notre IA prédit les hausses de prix imminentes. Achetez maintenant avant que les prix augmentent
                    </p>
                </div>
                <div className="relative w-24 h-24 md:w-40 md:h-40 shrink-0">
                    <img
                        src="/images/Gemini_Generated_Image_om8hf4om8hf4om8h 1.svg"
                        alt="ALERTE"
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-stretch gap-12">

                {/* Middle: Product Card */}
                <div className="w-full lg:w-5/12">
                    <div className="bg-white rounded-[3rem] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col h-full relative overflow-hidden group">
                        {/* Image */}
                        <div className="bg-white rounded-[2rem] p-6 flex items-center justify-center relative aspect-square w-full mb-8">
                            <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 line-clamp-1">{product.name}</h3>
                                <p className="text-base font-bold text-slate-400 uppercase tracking-widest mt-0.5">{product.brand}</p>
                            </div>

                            <div className="flex items-center justify-between">
                                {(product.inStock || product.availability !== "Out of Stock") && (
                                    <div className="flex items-center gap-1.5 bg-[#22C55E]/10 text-[#22C55E] px-3 py-1 rounded-full text-xs font-black">
                                        <Check className="size-3 stroke-[3]" />
                                        En stock
                                    </div>
                                )}
                                <div className="flex items-center gap-1 text-amber-400">
                                    <Star className="size-4 fill-current" />
                                    <Star className="size-4 fill-current" />
                                    <Star className="size-4 fill-current" />
                                    <Star className="size-4 fill-current" />
                                    <Star className="size-4 fill-current" />
                                    <span className="text-xs font-bold text-slate-400 ml-1">
                                        <span className="text-slate-800 font-black mr-1">4.3</span>
                                        (11.6k Total Review)
                                    </span>
                                </div>
                            </div>

                            <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed font-medium">
                                {product.description || `Le ${product.name} est un produit de qualité supérieure disponible chez ${cheapestShopName} avec le meilleur prix garanti.`}
                            </p>
                        </div>

                        {/* Price & Action */}
                        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-end gap-1">
                            <div className="flex flex-col items-end">
                                <span className="text-3xl font-black text-[#ED1C24]">{formatPrice(bestPrice)}</span>
                                {product.originalPrice ? (
                                    <span className="text-lg text-slate-300 line-through font-bold">{formatPrice(product.originalPrice)}</span>
                                ) : (
                                    <span className="text-lg text-slate-300 line-through font-bold">{formatPrice(bestPrice * 1.3)}</span>
                                )}
                            </div>

                            <button className="mt-6 w-full bg-white text-slate-900 border border-slate-100 px-6 py-4 rounded-3xl font-black flex items-center justify-between hover:bg-slate-50 transition-all shadow-sm group/btn">
                                <span className="text-sm">Voir l&apos;offre</span>
                                <div className="size-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white transition-transform group-hover/btn:translate-x-1">
                                    <TrendingUp className="size-4" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Notification Box & Chart */}
                <div className="w-full lg:w-7/12 flex flex-col gap-8">
                    {/* Alert Box */}
                    <div className="bg-[#F8F9FA]/60 border border-slate-100 rounded-[2.5rem] p-8 flex items-center gap-6">
                        <div className="size-16 rounded-3xl bg-white flex items-center justify-center text-[#EF4444] shrink-0 border border-red-50 shadow-sm">
                            <AlertCircle className="size-8" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-slate-800">Alerte de Prix</h4>
                            <p className="text-slate-500 font-semibold mt-0.5">Soyez notifié quand le prix baisse</p>
                        </div>
                    </div>

                    {/* Chart Container */}
                    <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-10 border border-slate-100 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.05)] flex flex-col h-full min-h-[300px] sm:min-h-[450px]">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <div className="flex items-center gap-2">
                                    <div className="size-2 rounded-full bg-[#0D9488]"></div>
                                    <span>Part 1</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="size-2 rounded-full bg-[#2DD4BF]"></div>
                                    <span>Part 2</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="size-2 rounded-full bg-[#1E293B]"></div>
                                    <span>Part 3</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full relative">
                            {isMounted ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorTeal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0.01} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 700 }}
                                            dy={15}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 700 }}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '12px' }}
                                            labelStyle={{ fontWeight: 800, marginBottom: '4px', color: '#1E293B' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="price"
                                            stroke="#2DD4BF"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorTeal)"
                                            activeDot={{ r: 6, strokeWidth: 0, fill: '#2DD4BF' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="prediction"
                                            stroke="#1E293B"
                                            strokeWidth={4}
                                            dot={{ r: 4, strokeWidth: 2, fill: '#1E293B', stroke: '#fff' }}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/50 rounded-[2rem] gap-4">
                                    <div className="w-12 h-12 border-4 border-slate-200 border-t-[#2DD4BF] rounded-full animate-spin" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
                                        Analyse des tendances...
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="text-center mt-6">
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Month</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
