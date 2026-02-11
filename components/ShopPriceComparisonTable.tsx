"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { ChevronRight } from "lucide-react";

// Shop logo mapping
const SHOP_IMAGES: { [key: string]: string } = {
    "mytek": "/images/téléchargement (4).png",
    "tunisianet": "/images/téléchargement (6).png",
    "spacenet": "/images/spacenet-removebg-preview.png",
    "parafendri": "/images/parafendri-removebg-preview.png",
    "parashop": "/images/parashop-removebg-preview.png",
    "pharma-shop": "/images/pharmashop-removebg-preview.png",
};

// Display names for shops
const SHOP_DISPLAY_NAMES: { [key: string]: string } = {
    "mytek": "MyTek",
    "tunisianet": "Tunisianet",
    "spacenet": "Spacenet",
    "parafendri": "ParaFendri",
    "parashop": "ParaShop",
    "pharma-shop": "Pharma-Shop",
};

interface ShopRanking {
    shop: string;
    avg_price: number;
    min_price: number;
    max_price: number;
    product_count: number;
}

interface CategoryAnalytics {
    category: string;
    cheapest_shop: string;
    cheapest_avg_price: number;
    shop_rankings: ShopRanking[];
    only_available: boolean;
}

interface ShopPrice {
    name: string;
    average_price: number;
}

interface ShopPriceComparisonTableProps {
    type: "para" | "products";
    title: string;
    accentColor: string;
    initialCategories?: string[];
    allAnalyticsData?: Record<string, CategoryAnalytics>;
    pricesData?: ShopPrice[];
}

export function ShopPriceComparisonTable({
    type,
    title,
    accentColor,
    initialCategories = [],
    allAnalyticsData = {},
    pricesData = []
}: ShopPriceComparisonTableProps) {
    const [categories] = useState<string[]>(initialCategories);
    const [selectedCategory, setSelectedCategory] = useState<string>(
        initialCategories.length > 0 ? initialCategories[0] : ""
    );
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Derived state — same logic as before
    const analytics = selectedCategory && allAnalyticsData[selectedCategory]
        ? allAnalyticsData[selectedCategory]
        : null;

    const shops = analytics?.shop_rankings || [];

    // Define shop categories
    const ECOMMERCE_SHOPS = ["mytek", "tunisianet", "spacenet"];
    const PARAPHARMACY_SHOPS = ["parafendri", "parashop", "pharmashop", "pharma-shop"];

    // Filter prices based on type
    const relevantShops = type === "products" ? ECOMMERCE_SHOPS : PARAPHARMACY_SHOPS;
    const shopOverallAverages: Record<string, number> = {};
    
    pricesData.forEach((shop) => {
        const shopKey = shop.name.toLowerCase();
        if (relevantShops.includes(shopKey)) {
            shopOverallAverages[shopKey] = shop.average_price;
        }
    });

    // Get all shops from category data, or fall back to shops with price data
    const allShopNames = shops.length > 0
        ? shops.map(s => s.shop)
        : relevantShops.filter(shopKey => shopOverallAverages[shopKey] > 0);

    // Sort shops by average price for ranking (cheapest first)
    const sortedShops = [...allShopNames]
        .map(shopName => ({
            name: shopName,
            price: shopOverallAverages[shopName.toLowerCase()] || 0
        }))
        .filter(shop => shop.price > 0)
        .sort((a, b) => a.price - b.price);

    const cheapestPrice = sortedShops[0]?.price || 0;

    // Create ranking map
    const shopRankMap: Record<string, number> = {};
    sortedShops.forEach((shop, idx) => {
        shopRankMap[shop.name.toLowerCase()] = idx + 1;
    });

    // Accent color mapping
    const accent = accentColor === "purple"
        ? { border: "border-[#2563EB]", headerBg: "bg-gradient-to-r from-[#2563EB] to-[#3B82F6]", text: "text-[#2563EB]", lightBg: "bg-blue-50", pill: "bg-[#2563EB] text-white" }
        : { border: "border-[#0D9488]", headerBg: "bg-gradient-to-r from-[#0D9488] to-[#14B8A6]", text: "text-[#0D9488]", lightBg: "bg-teal-50", pill: "bg-[#0D9488] text-white" };

    return (
        <div className="w-full space-y-5">
            {/* ─── BLOCK 1: Boutiques (Shop Logos) ─── */}
            <div className={`rounded-[20px] border-2 ${accent.border} overflow-hidden`}>
                {/* Header */}
                <div className={`${accent.headerBg} px-6 py-3.5`}>
                    <h3 className="text-white font-bold text-base tracking-wide">{title}</h3>
                </div>

                {/* Shop logos row */}
                <div className="overflow-x-auto">
                    <div className="flex items-center min-w-max px-6 py-6">
                        <span className="text-sm font-bold text-slate-700 w-40 shrink-0">Boutiques</span>
                        <div className="flex flex-1 justify-around items-center gap-6">
                            {sortedShops.map((shop, idx) => (
                                <div key={idx} className="flex flex-col items-center justify-center min-w-[100px] px-3 py-2 rounded-xl bg-white hover:bg-slate-50 transition-all duration-200 shadow-sm hover:shadow-md border border-slate-100">
                                    {SHOP_IMAGES[shop.name.toLowerCase()] ? (
                                        <img
                                            src={SHOP_IMAGES[shop.name.toLowerCase()]}
                                            alt={shop.name}
                                            className="h-10 w-auto object-contain filter brightness-90 hover:brightness-100 transition-all duration-300"
                                        />
                                    ) : (
                                        <span className="font-bold text-sm text-slate-700">
                                            {SHOP_DISPLAY_NAMES[shop.name.toLowerCase()] || shop.name}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <ChevronRight className="size-5 text-slate-300 ml-2 shrink-0" />
                    </div>
                </div>
            </div>

            {/* ─── BLOCK 2: Prix moyen par site ─── */}
            <div className={`rounded-[20px] border-2 ${accent.border} overflow-hidden`}>
                <div className="overflow-x-auto">
                    <div className="flex items-center min-w-max px-6 py-6">
                        <span className="text-sm font-bold text-slate-700 w-40 shrink-0">Prix moyen par site</span>
                        <div className="flex flex-1 justify-around items-center gap-6">
                            {sortedShops.map((shop, idx) => {
                                return (
                                    <div key={idx} className="flex flex-col items-center justify-center min-w-[100px]">
                                        <div className="flex flex-col items-center justify-center px-4 py-3 min-w-[90px]">
                                            <span className="text-lg font-bold text-slate-800 tracking-tight">
                                                {shop.price > 0 ? `${shop.price.toFixed(2)}` : "—"}
                                            </span>
                                            <span className="text-xs text-slate-500 font-medium mt-0.5">DT</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="w-5 ml-2 shrink-0" />
                    </div>
                </div>
            </div>

            {/* ─── BLOCK 3: Prix moyen par catégorie ─── */}
            <div className={`rounded-[20px] border-2 ${accent.border} overflow-visible`}>
                <div className="overflow-visible">
                    <div className="flex items-center min-w-max px-6 py-6 relative">
                        {/* Left: Category dropdown selector */}
                        <div className="w-40 shrink-0 relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className={`flex items-center justify-between w-full gap-2 text-sm font-bold px-4 py-3 rounded-xl border-2 transition-all duration-200 shadow-sm hover:shadow-md ${dropdownOpen
                                    ? `${accent.lightBg} ${accent.text} border-current`
                                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                                    }`}
                            >
                                <span className="truncate">{selectedCategory || "Catégorie"}</span>
                                <ChevronDown className={`size-4 shrink-0 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                            </button>

                            {/* Dropdown list */}
                            {dropdownOpen && (
                                <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border-2 border-slate-200 py-2 z-50 max-h-[240px] overflow-y-auto">
                                    {categories.map((cat, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setSelectedCategory(cat);
                                                setDropdownOpen(false);
                                            }}
                                            className={`w-full text-left text-sm px-4 py-2.5 transition-all duration-150 ${cat === selectedCategory
                                                ? `${accent.lightBg} ${accent.text} font-bold border-l-4 ${accent.border}`
                                                : "text-slate-600 hover:bg-slate-50 font-medium border-l-4 border-transparent"
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Per-category prices for each shop */}
                        <div className="flex flex-1 justify-around items-center gap-6">
                            {(() => {
                                // Sort shops by category price
                                const sortedCategoryShops = sortedShops
                                    .map(shop => {
                                        const shopData = shops.find(s => s.shop === shop.name);
                                        return { name: shop.name, price: shopData?.avg_price || 0 };
                                    })
                                    .filter(shop => shop.price > 0)
                                    .sort((a, b) => a.price - b.price);

                                const cheapestCategoryPrice = sortedCategoryShops[0]?.price || 0;

                                return sortedCategoryShops.map((shop, idx) => {
                                    const rank = idx + 1;
                                    const percentIncrease = cheapestCategoryPrice > 0
                                        ? ((shop.price - cheapestCategoryPrice) / cheapestCategoryPrice) * 100
                                        : 0;

                                    const medalConfig = {
                                        1: { 
                                            emoji: "🥇", 
                                            gradient: "from-yellow-400 via-yellow-300 to-yellow-500", 
                                            textColor: "text-yellow-700",
                                            cardBg: "bg-yellow-50",
                                            border: "border-yellow-400"
                                        },
                                        2: { 
                                            emoji: "🥈", 
                                            gradient: "from-gray-400 via-gray-300 to-gray-500", 
                                            textColor: "text-gray-700",
                                            cardBg: "bg-gray-50",
                                            border: "border-gray-400"
                                        },
                                        3: { 
                                            emoji: "🥉", 
                                            gradient: "from-orange-400 via-orange-300 to-orange-500", 
                                            textColor: "text-orange-700",
                                            cardBg: "bg-orange-50",
                                            border: "border-orange-400"
                                        }
                                    };

                                    const config = medalConfig[rank as 1 | 2 | 3];

                                    return (
                                        <div key={idx} className="flex flex-col items-center justify-center min-w-[100px] relative">
                                            {rank <= 3 && config && (
                                                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center text-sm shadow-lg border-2 border-white z-10`}>
                                                    {config.emoji}
                                                </div>
                                            )}
                                            <div className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl ${rank <= 3 && config ? `${config.cardBg} border-2 ${config.border}` : 'bg-slate-50'} min-w-[90px] transition-all duration-200 hover:shadow-md`}>
                                                <span className={`text-lg font-bold ${rank <= 3 && config ? config.textColor : "text-slate-800"} tracking-tight`}>
                                                    {shop.price.toFixed(2)}
                                                </span>
                                                <span className="text-xs text-slate-500 font-medium mt-0.5">DT</span>
                                                {rank > 1 && rank <= 3 && percentIncrease > 0 && config && (
                                                    <span className={`text-xs font-bold mt-2 px-2 py-0.5 rounded-full ${config.cardBg} ${config.textColor}`}>
                                                        +{percentIncrease.toFixed(1)}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                        <div className="w-5 ml-2 shrink-0" />
                    </div>
                </div>
            </div>
        </div>
    );
}
