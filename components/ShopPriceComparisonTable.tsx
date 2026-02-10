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

interface ShopPriceComparisonTableProps {
    type: "para" | "products";
    title: string;
    accentColor: string;
    initialCategories?: string[];
    allAnalyticsData?: Record<string, CategoryAnalytics>;
    /**
     * @deprecated Use allAnalyticsData instead
     */
    initialAnalytics?: CategoryAnalytics;
}

export function ShopPriceComparisonTable({
    type,
    title,
    accentColor,
    initialCategories = [],
    allAnalyticsData = {}
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

    // Compute overall average per shop across ALL categories
    const shopOverallAverages: Record<string, { total: number; count: number }> = {};
    Object.values(allAnalyticsData).forEach((catData) => {
        catData.shop_rankings.forEach((sr) => {
            if (!shopOverallAverages[sr.shop]) {
                shopOverallAverages[sr.shop] = { total: 0, count: 0 };
            }
            shopOverallAverages[sr.shop].total += sr.avg_price;
            shopOverallAverages[sr.shop].count += 1;
        });
    });

    // Get a stable list of all shops from the first category's data (or current)
    const allShopNames = shops.length > 0
        ? shops.map(s => s.shop)
        : Object.keys(shopOverallAverages);

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
                    <div className="flex items-center min-w-max px-6 py-5">
                        <span className="text-sm font-semibold text-slate-600 w-40 shrink-0">Boutiques</span>
                        <div className="flex flex-1 justify-around items-center gap-4">
                            {allShopNames.map((shopName, idx) => (
                                <div key={idx} className="flex flex-col items-center justify-center min-w-[90px]">
                                    {SHOP_IMAGES[shopName.toLowerCase()] ? (
                                        <img
                                            src={SHOP_IMAGES[shopName.toLowerCase()]}
                                            alt={shopName}
                                            className="h-9 w-auto object-contain grayscale-[30%] hover:grayscale-0 transition-all duration-300"
                                        />
                                    ) : (
                                        <span className="font-bold text-sm text-slate-700">
                                            {SHOP_DISPLAY_NAMES[shopName.toLowerCase()] || shopName}
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
                    <div className="flex items-center min-w-max px-6 py-5">
                        <span className="text-sm font-semibold text-slate-600 w-40 shrink-0">Prix moyen par site</span>
                        <div className="flex flex-1 justify-around items-center gap-4">
                            {allShopNames.map((shopName, idx) => {
                                const data = shopOverallAverages[shopName];
                                const avg = data ? (data.total / data.count) : 0;
                                return (
                                    <div key={idx} className="flex flex-col items-center justify-center min-w-[90px]">
                                        <span className="font-bold text-sm text-slate-800">
                                            {avg > 0 ? `${avg.toFixed(2)} DT` : "—"}
                                        </span>
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
                    <div className="flex items-center min-w-max px-6 py-5 relative">
                        {/* Left: Category dropdown selector */}
                        <div className="w-40 shrink-0 relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className={`flex items-center justify-between w-full gap-2 text-sm font-semibold px-3 py-2.5 rounded-xl border transition-all duration-200 ${dropdownOpen
                                    ? `${accent.lightBg} ${accent.text} border-current`
                                    : "text-slate-700 border-slate-200 hover:border-slate-300"
                                    }`}
                            >
                                <span className="truncate">{selectedCategory || "Catégorie"}</span>
                                <ChevronDown className={`size-4 shrink-0 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                            </button>

                            {/* Dropdown list */}
                            {dropdownOpen && (
                                <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 max-h-[220px] overflow-y-auto">
                                    {categories.map((cat, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setSelectedCategory(cat);
                                                setDropdownOpen(false);
                                            }}
                                            className={`w-full text-left text-sm px-4 py-2 transition-colors ${cat === selectedCategory
                                                ? `${accent.lightBg} ${accent.text} font-bold`
                                                : "text-slate-600 hover:bg-slate-50 font-medium"
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Per-category prices for each shop */}
                        <div className="flex flex-1 justify-around items-center gap-4">
                            {allShopNames.map((shopName, idx) => {
                                const shopData = shops.find(s => s.shop === shopName);
                                const price = shopData?.avg_price;
                                const isCheapest = shopName === analytics?.cheapest_shop;
                                return (
                                    <div key={idx} className="flex flex-col items-center justify-center min-w-[90px]">
                                        <span className={`font-bold text-sm ${isCheapest ? accent.text : "text-slate-800"}`}>
                                            {price ? `${price.toFixed(2)} DT` : "—"}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="w-5 ml-2 shrink-0" />
                    </div>
                </div>
            </div>
        </div>
    );
}
