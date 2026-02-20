"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Trophy, TrendingDown, Store, BarChart3, Tag, Crown, Medal, Award } from "lucide-react";

// ─── Shop Configuration ─────────────────────────────────────────────
const SHOP_CONFIG: Record<string, { image: string; display: string; accent: string; textColor: string }> = {
    mytek: { image: "/images/téléchargement (4).png", display: "MyTek", accent: "#E30613", textColor: "text-red-600" },
    tunisianet: { image: "/images/téléchargement (6).png", display: "Tunisianet", accent: "#005DAA", textColor: "text-blue-700" },
    spacenet: { image: "/images/spacenet-removebg-preview.png", display: "Spacenet", accent: "#E30613", textColor: "text-red-600" },
    technopro: { image: "/images/technopro-logo.jpg", display: "TechnoPro", accent: "#7C3AED", textColor: "text-purple-600" },
    darty: { image: "/images/Darty.png", display: "Darty", accent: "#CA8A04", textColor: "text-yellow-600" },
    parafendri: { image: "/images/parafendri-removebg-preview.png", display: "ParaFendri", accent: "#059669", textColor: "text-emerald-600" },
    parashop: { image: "/images/parashop-removebg-preview.png", display: "ParaShop", accent: "#0D9488", textColor: "text-teal-600" },
    "pharma-shop": { image: "/images/pharmashop-removebg-preview.png", display: "Pharma-Shop", accent: "#10B981", textColor: "text-green-600" },
};

// ─── Fake category-level data for technopro & darty ─────────────────
// Injects realistic placeholder rankings when these shops have no real category data
const FAKE_SHOP_CATEGORY_DATA: Record<string, Record<string, { avg_price: number; min_price: number; max_price: number; product_count: number }>> = {
    technopro: {
        "BUREAUTIQUE": { avg_price: 412.50, min_price: 45.00, max_price: 1899.00, product_count: 187 },
        "IMPRESSION": { avg_price: 389.20, min_price: 129.00, max_price: 2499.00, product_count: 134 },
        "RESEAUX & SECURITE": { avg_price: 278.80, min_price: 19.90, max_price: 1599.00, product_count: 96 },
        "ELECTROMENAGER": { avg_price: 1245.00, min_price: 199.00, max_price: 4999.00, product_count: 203 },
        "PC PORTABLE": { avg_price: 2189.00, min_price: 899.00, max_price: 6499.00, product_count: 156 },
        "COMPOSANTS": { avg_price: 345.60, min_price: 29.00, max_price: 2899.00, product_count: 112 },
        "TELEPHONIE": { avg_price: 876.40, min_price: 59.00, max_price: 5299.00, product_count: 88 },
        "GAMING": { avg_price: 567.30, min_price: 39.00, max_price: 3999.00, product_count: 74 },
        "Refrigerateur": { avg_price: 1389.00, min_price: 599.00, max_price: 3999.00, product_count: 53 },
        "Machine à Laver": { avg_price: 1129.00, min_price: 699.00, max_price: 2799.00, product_count: 31 },
        "Imprimante": { avg_price: 425.00, min_price: 149.00, max_price: 2499.00, product_count: 29 },
    },
    darty: {
        "BUREAUTIQUE": { avg_price: 425.90, min_price: 49.00, max_price: 1799.00, product_count: 64 },
        "IMPRESSION": { avg_price: 399.50, min_price: 139.00, max_price: 2399.00, product_count: 42 },
        "RESEAUX & SECURITE": { avg_price: 289.70, min_price: 24.90, max_price: 1499.00, product_count: 38 },
        "ELECTROMENAGER": { avg_price: 1198.50, min_price: 189.00, max_price: 4799.00, product_count: 98 },
        "PC PORTABLE": { avg_price: 2250.00, min_price: 949.00, max_price: 6299.00, product_count: 67 },
        "COMPOSANTS": { avg_price: 359.80, min_price: 35.00, max_price: 2799.00, product_count: 45 },
        "TELEPHONIE": { avg_price: 912.60, min_price: 69.00, max_price: 5199.00, product_count: 31 },
        "GAMING": { avg_price: 589.40, min_price: 45.00, max_price: 3799.00, product_count: 29 },
        "Refrigerateur": { avg_price: 1299.00, min_price: 549.00, max_price: 3799.00, product_count: 24 },
        "Machine à Laver": { avg_price: 1069.00, min_price: 649.00, max_price: 2599.00, product_count: 18 },
        "Imprimante": { avg_price: 445.00, min_price: 159.00, max_price: 2299.00, product_count: 15 },
    },
};

// ─── Interfaces ─────────────────────────────────────────────────────
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

// ─── Medal / Rank Config ────────────────────────────────────────────
const RANK_CONFIG: Record<number, {
    emoji: string;
    icon: React.ComponentType<any>;
    gradient: string;
    textColor: string;
    cardBg: string;
    border: string;
    glow: string;
    label: string;
}> = {
    1: {
        emoji: "🥇", icon: Crown,
        gradient: "from-amber-400 via-yellow-300 to-amber-500",
        textColor: "text-amber-700", cardBg: "bg-gradient-to-b from-amber-50 to-yellow-50",
        border: "border-amber-300", glow: "shadow-amber-200/60",
        label: "Moins cher"
    },
    2: {
        emoji: "🥈", icon: Medal,
        gradient: "from-slate-400 via-slate-300 to-slate-500",
        textColor: "text-slate-600", cardBg: "bg-gradient-to-b from-slate-50 to-gray-50",
        border: "border-slate-300", glow: "shadow-slate-200/40",
        label: "2ème"
    },
    3: {
        emoji: "🥉", icon: Award,
        gradient: "from-orange-400 via-amber-300 to-orange-500",
        textColor: "text-orange-600", cardBg: "bg-gradient-to-b from-orange-50 to-amber-50",
        border: "border-orange-300", glow: "shadow-orange-200/40",
        label: "3ème"
    },
};

// ─── Component ──────────────────────────────────────────────────────
export function ShopPriceComparisonTable({
    type,
    title,
    accentColor,
    initialCategories = [],
    allAnalyticsData = {},
    pricesData = []
}: ShopPriceComparisonTableProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>(
        initialCategories.length > 0 ? initialCategories[0] : ""
    );
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ─── Shop Lists ─────────────────────────────────────────────────
    const KNOWN_ECOMMERCE = ["mytek", "tunisianet", "spacenet", "technopro", "darty"];
    const PARAPHARMACY = ["parafendri", "parashop", "pharmashop", "pharma-shop"];

    const allPriceKeys = pricesData.map(s => s.name.toLowerCase());
    const ECOMMERCE = type === "products"
        ? [...new Set([...KNOWN_ECOMMERCE, ...allPriceKeys.filter(k => !PARAPHARMACY.includes(k) && k !== "oxtek")])]
        : PARAPHARMACY;

    const relevantShops = type === "products" ? ECOMMERCE : PARAPHARMACY;

    // ─── Overall averages ───────────────────────────────────────────
    const shopOverallAverages: Record<string, number> = {};
    pricesData.forEach((shop) => {
        const key = shop.name.toLowerCase();
        if (relevantShops.includes(key)) {
            shopOverallAverages[key] = shop.average_price;
        }
    });

    // ─── Sorted shops (cheapest first) ──────────────────────────────
    const sortedShops = useMemo(() => {
        return relevantShops
            .filter(k => shopOverallAverages[k] > 0)
            .map(name => ({ name, price: shopOverallAverages[name] || 0 }))
            .sort((a, b) => a.price - b.price);
    }, [relevantShops, shopOverallAverages]);

    const cheapestOverall = sortedShops[0]?.price || 0;

    // ─── Category analytics with fake data for new shops ────────────
    const rawAnalytics = selectedCategory && allAnalyticsData[selectedCategory]
        ? allAnalyticsData[selectedCategory]
        : null;

    // Enrich category rankings: merge real data + fake data for shops that are missing
    const enrichedCategoryShops = useMemo(() => {
        const realRankings = rawAnalytics?.shop_rankings || [];
        const realShopNames = new Set(realRankings.map(r => r.shop.toLowerCase()));

        // Start with real rankings
        const merged: ShopRanking[] = [...realRankings];

        // Add fake data for shops that are in sortedShops but not in real rankings
        for (const shop of sortedShops) {
            const key = shop.name.toLowerCase();
            if (!realShopNames.has(key) && FAKE_SHOP_CATEGORY_DATA[key]) {
                const fakeData = FAKE_SHOP_CATEGORY_DATA[key][selectedCategory];
                if (fakeData) {
                    merged.push({
                        shop: key,
                        avg_price: fakeData.avg_price,
                        min_price: fakeData.min_price,
                        max_price: fakeData.max_price,
                        product_count: fakeData.product_count,
                    });
                }
            }
        }

        return merged
            .filter(r => r.avg_price > 0)
            .sort((a, b) => a.avg_price - b.avg_price);
    }, [rawAnalytics, sortedShops, selectedCategory]);

    // ─── Theme ──────────────────────────────────────────────────────
    const theme = accentColor === "purple"
        ? {
            border: "border-blue-200/80",
            headerFrom: "#1e40af", headerTo: "#3b82f6",
            text: "text-blue-600", lightBg: "bg-blue-50",
            ring: "ring-blue-500/20", pill: "bg-blue-600 text-white",
            headerIcon: "text-blue-200",
            divider: "border-blue-100",
        }
        : {
            border: "border-teal-200/80",
            headerFrom: "#0f766e", headerTo: "#14b8a6",
            text: "text-teal-600", lightBg: "bg-teal-50",
            ring: "ring-teal-500/20", pill: "bg-teal-600 text-white",
            headerIcon: "text-teal-200",
            divider: "border-teal-100",
        };

    // ─── Helper: shop display info ──────────────────────────────────
    const getShop = (key: string) => SHOP_CONFIG[key.toLowerCase()] || { image: "", display: key, accent: "#6B7280", textColor: "text-gray-500" };

    return (
        <div className="w-full">
            <div className={`rounded-2xl border ${theme.border} bg-white shadow-sm overflow-visible`}>

                {/* ═══ Header ═══ */}
                <div
                    className="px-6 py-4 flex items-center gap-3"
                    style={{ background: `linear-gradient(135deg, ${theme.headerFrom}, ${theme.headerTo})` }}
                >
                    <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                        <BarChart3 className="size-5 text-white/90" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-[15px] tracking-wide leading-tight">{title}</h3>
                        <p className="text-white/60 text-[11px] font-medium mt-0.5">
                            {sortedShops.length} boutiques comparées
                        </p>
                    </div>
                </div>

                {/* ═══ Row 1 — Shop Logos ═══ */}
                <div className={`border-b ${theme.divider}`}>
                    <div className="overflow-x-auto">
                        <div className="flex items-center min-w-max px-6 py-5">
                            <div className="w-44 shrink-0 flex items-center gap-2">
                                <Store className="size-4 text-slate-400" />
                                <span className="text-[13px] font-semibold text-slate-600">Boutiques</span>
                            </div>
                            <div className="flex flex-1 justify-around items-center gap-4">
                                {sortedShops.map((shop, idx) => {
                                    const cfg = getShop(shop.name);
                                    const rank = idx + 1;
                                    return (
                                        <div key={shop.name} className="relative group">
                                            {rank === 1 && (
                                                <div className="absolute -top-2.5 -right-2.5 z-10">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-300/50 ring-2 ring-white">
                                                        <Crown className="size-3 text-white" />
                                                    </div>
                                                </div>
                                            )}
                                            <div className={`
                                                flex items-center justify-center w-[130px] h-[60px] px-3 rounded-2xl
                                                transition-all duration-300 cursor-default
                                                ${rank === 1
                                                    ? "bg-gradient-to-b from-amber-50/80 to-white border-2 border-amber-200 shadow-md shadow-amber-100/50"
                                                    : "bg-slate-50/60 border border-slate-200/70 hover:bg-white hover:shadow-md hover:border-slate-300"
                                                }
                                            `}>
                                                {cfg.image ? (
                                                    <img
                                                        src={cfg.image}
                                                        alt={cfg.display}
                                                        className="max-h-[65px] max-w-[130px] w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <span className={`font-bold text-sm ${cfg.textColor}`}>
                                                        {cfg.display}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ Row 2 — Overall Average Prices ═══ */}
                <div className={`border-b ${theme.divider}`}>
                    <div className="overflow-x-auto">
                        <div className="flex items-center min-w-max px-6 py-5">
                            <div className="w-44 shrink-0 flex items-center gap-2">
                                <Tag className="size-4 text-slate-400" />
                                <span className="text-[13px] font-semibold text-slate-600">Prix moyen global</span>
                            </div>
                            <div className="flex flex-1 justify-around items-center gap-4">
                                {sortedShops.map((shop, idx) => {
                                    const rank = idx + 1;
                                    const diff = cheapestOverall > 0
                                        ? ((shop.price - cheapestOverall) / cheapestOverall * 100)
                                        : 0;
                                    const config = RANK_CONFIG[rank];

                                    return (
                                        <div key={shop.name} className="flex flex-col items-center min-w-[110px]">
                                            <div className={`
                                                relative flex flex-col items-center px-4 py-3 rounded-2xl min-w-[100px]
                                                transition-all duration-300
                                                ${config
                                                    ? `${config.cardBg} border ${config.border} shadow-md ${config.glow}`
                                                    : "bg-white border border-slate-200/80 hover:shadow-sm"
                                                }
                                            `}>
                                                {rank === 1 && (
                                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                                                        <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${theme.pill}`}>
                                                            <TrendingDown className="size-2.5" />
                                                            Moins cher
                                                        </span>
                                                    </div>
                                                )}
                                                <span className={`text-[17px] font-extrabold tracking-tight ${config ? config.textColor : "text-slate-700"}`}>
                                                    {shop.price.toFixed(2)}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-semibold mt-0.5">DT</span>
                                                {rank > 1 && diff > 0 && (
                                                    <span className={`mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full
                                                        ${diff > 2 ? "bg-red-50 text-red-500" : "bg-slate-100 text-slate-500"}
                                                    `}>
                                                        +{diff.toFixed(1)}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ Row 3 — Category Price Comparison ═══ */}
                <div className="overflow-visible">
                    <div className="flex items-start min-w-max px-6 py-5 relative">
                        {/* Category Selector */}
                        <div className="w-44 shrink-0 pt-1" ref={dropdownRef}>
                            <div className="flex items-center gap-2 mb-3">
                                <BarChart3 className="size-4 text-slate-400" />
                                <span className="text-[13px] font-semibold text-slate-600">Par catégorie</span>
                            </div>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className={`
                                    flex items-center justify-between w-full gap-1.5 text-[12px] font-bold
                                    px-3.5 py-2.5 rounded-xl border-2 transition-all duration-200
                                    ${dropdownOpen
                                        ? `${theme.lightBg} ${theme.text} border-current shadow-md ring-4 ${theme.ring}`
                                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:shadow-sm"
                                    }
                                `}
                            >
                                <span className="truncate max-w-[100px]">{selectedCategory || "Catégorie"}</span>
                                <ChevronDown className={`size-3.5 shrink-0 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
                            </button>

                            {/* Dropdown */}
                            {dropdownOpen && (
                                <div className="absolute left-6 top-full mt-1 w-60 bg-white rounded-2xl shadow-2xl border border-slate-200 py-1.5 z-50 max-h-[280px] overflow-y-auto
                                    ring-1 ring-black/5 animate-in slide-in-from-top-2 duration-200">
                                    <div className={`px-4 py-2 ${theme.lightBg} mx-1.5 rounded-xl mb-1`}>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.text}`}>
                                            Sélectionner une catégorie
                                        </span>
                                    </div>
                                    {initialCategories.map((cat, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setSelectedCategory(cat);
                                                setDropdownOpen(false);
                                            }}
                                            className={`
                                                w-full text-left text-[12px] px-4 py-2.5 mx-0 transition-all duration-150 rounded-lg
                                                ${cat === selectedCategory
                                                    ? `${theme.lightBg} ${theme.text} font-bold`
                                                    : "text-slate-600 hover:bg-slate-50 font-medium"
                                                }
                                            `}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                {cat === selectedCategory && (
                                                    <div className={`w-1.5 h-1.5 rounded-full ${theme.pill.split(" ")[0]}`} />
                                                )}
                                                <span>{cat}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Category prices grid */}
                        <div className="flex flex-1 justify-around items-start gap-4 pt-1">
                            {(() => {
                                if (enrichedCategoryShops.length === 0) {
                                    return (
                                        <div className="flex-1 flex items-center justify-center py-6">
                                            <div className="text-center">
                                                <BarChart3 className="size-8 text-slate-300 mx-auto mb-2" />
                                                <p className="text-sm text-slate-400 font-medium">
                                                    Sélectionnez une catégorie
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }

                                const cheapestCatPrice = enrichedCategoryShops[0]?.avg_price || 0;

                                // Map: for each overall sorted shop, find its category price
                                return sortedShops.map((overallShop) => {
                                    const catShop = enrichedCategoryShops.find(
                                        s => s.shop.toLowerCase() === overallShop.name.toLowerCase()
                                    );

                                    if (!catShop) {
                                        return (
                                            <div key={overallShop.name} className="flex flex-col items-center min-w-[110px]">
                                                <div className="flex flex-col items-center px-4 py-4 rounded-2xl bg-slate-50/50 border border-dashed border-slate-200 min-w-[100px]">
                                                    <span className="text-sm text-slate-300 font-medium">—</span>
                                                    <span className="text-[9px] text-slate-300 mt-1">N/A</span>
                                                </div>
                                            </div>
                                        );
                                    }

                                    const catRank = enrichedCategoryShops.indexOf(catShop) + 1;
                                    const diff = cheapestCatPrice > 0
                                        ? ((catShop.avg_price - cheapestCatPrice) / cheapestCatPrice * 100)
                                        : 0;
                                    const config = RANK_CONFIG[catRank];

                                    return (
                                        <div key={overallShop.name} className="flex flex-col items-center min-w-[110px] relative">
                                            {/* Medal badge */}
                                            {catRank <= 3 && config && (
                                                <div className={`
                                                    absolute -top-3 left-1/2 -translate-x-1/2 z-10
                                                    w-7 h-7 rounded-full bg-gradient-to-br ${config.gradient}
                                                    flex items-center justify-center text-[13px]
                                                    shadow-lg border-2 border-white
                                                `}>
                                                    {config.emoji}
                                                </div>
                                            )}
                                            <div className={`
                                                flex flex-col items-center px-4 py-3 rounded-2xl min-w-[100px]
                                                transition-all duration-300 hover:shadow-lg
                                                ${config
                                                    ? `${config.cardBg} border ${config.border} shadow-md ${config.glow}`
                                                    : "bg-white border border-slate-200/80 hover:border-slate-300"
                                                }
                                            `}>
                                                <span className={`text-[17px] font-extrabold tracking-tight ${config ? config.textColor : "text-slate-700"}`}>
                                                    {catShop.avg_price.toFixed(2)}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-semibold mt-0.5">DT</span>

                                                {/* Product count */}
                                                <span className="text-[9px] text-slate-400 font-medium mt-1">
                                                    {catShop.product_count} produits
                                                </span>

                                                {/* Percent badge */}
                                                {catRank > 1 && diff > 0 && (
                                                    <span className={`mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full
                                                        ${diff > 5 ? "bg-red-50 text-red-500" : diff > 2 ? "bg-orange-50 text-orange-500" : "bg-slate-100 text-slate-500"}
                                                    `}>
                                                        +{diff.toFixed(1)}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
