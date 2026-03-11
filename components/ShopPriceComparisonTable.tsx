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
    batam: { image: "/images/logo-batam.jpg", display: "Batam", accent: "#E53E3E", textColor: "text-red-500" },
    graiet: { image: "/images/logo-graiet.png", display: "Graiet", accent: "#2B6CB0", textColor: "text-blue-600" },
    jumbo: { image: "/images/logo-jambo.png", display: "Jumbo", accent: "#D69E2E", textColor: "text-yellow-600" },
    zoom: { image: "/images/logo-zoom.jpg", display: "Zoom", accent: "#38A169", textColor: "text-green-600" },
    parafendri: { image: "/images/parafendri-removebg-preview.png", display: "ParaFendri", accent: "#059669", textColor: "text-emerald-600" },
    parashop: { image: "/images/parashop-removebg-preview.png", display: "ParaShop", accent: "#0D9488", textColor: "text-teal-600" },
    "pharma-shop": { image: "/images/pharmashop-removebg-preview.png", display: "Pharma-Shop", accent: "#10B981", textColor: "text-green-600" },
};

// ─── Static overall average prices for E-commerce shops ─────────────
const STATIC_ECOMMERCE_PRICES: Record<string, number> = {
    spacenet: 800.45,
    tunisianet: 815.72,
    batam: 828.38,
    mytek: 842.16,
    technopro: 855.93,
    darty: 867.54,
    graiet: 878.27,
    jumbo: 889.61,
    zoom: 900.85,
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
    batam: {
        "BUREAUTIQUE": { avg_price: 257.63, min_price: 35.00, max_price: 1650.00, product_count: 15 },
        "IMPRESSION": { avg_price: 375.40, min_price: 119.00, max_price: 2199.00, product_count: 22 },
        "RESEAUX & SECURITE": { avg_price: 265.30, min_price: 18.00, max_price: 1399.00, product_count: 41 },
        "ELECTROMENAGER": { avg_price: 1150.00, min_price: 179.00, max_price: 4599.00, product_count: 85 },
        "PC PORTABLE": { avg_price: 2050.00, min_price: 849.00, max_price: 5999.00, product_count: 62 },
        "COMPOSANTS": { avg_price: 320.40, min_price: 25.00, max_price: 2599.00, product_count: 38 },
        "TELEPHONIE": { avg_price: 820.50, min_price: 49.00, max_price: 4999.00, product_count: 45 },
        "GAMING": { avg_price: 530.20, min_price: 35.00, max_price: 3599.00, product_count: 31 },
        "Refrigerateur": { avg_price: 1280.00, min_price: 529.00, max_price: 3699.00, product_count: 19 },
        "Machine à Laver": { avg_price: 1020.00, min_price: 619.00, max_price: 2499.00, product_count: 14 },
        "Imprimante": { avg_price: 410.00, min_price: 139.00, max_price: 2199.00, product_count: 12 },
    },
    graiet: {
        "BUREAUTIQUE": { avg_price: 440.20, min_price: 52.00, max_price: 1850.00, product_count: 48 },
        "IMPRESSION": { avg_price: 410.80, min_price: 145.00, max_price: 2550.00, product_count: 36 },
        "RESEAUX & SECURITE": { avg_price: 295.60, min_price: 28.00, max_price: 1550.00, product_count: 29 },
        "ELECTROMENAGER": { avg_price: 1265.00, min_price: 205.00, max_price: 4850.00, product_count: 72 },
        "PC PORTABLE": { avg_price: 2310.00, min_price: 975.00, max_price: 6450.00, product_count: 51 },
        "COMPOSANTS": { avg_price: 370.50, min_price: 38.00, max_price: 2850.00, product_count: 33 },
        "TELEPHONIE": { avg_price: 935.70, min_price: 75.00, max_price: 5350.00, product_count: 27 },
        "GAMING": { avg_price: 605.80, min_price: 48.00, max_price: 3850.00, product_count: 22 },
        "Refrigerateur": { avg_price: 1420.00, min_price: 575.00, max_price: 3850.00, product_count: 16 },
        "Machine à Laver": { avg_price: 1150.00, min_price: 675.00, max_price: 2650.00, product_count: 11 },
        "Imprimante": { avg_price: 460.00, min_price: 165.00, max_price: 2450.00, product_count: 10 },
    },
    jumbo: {
        "BUREAUTIQUE": { avg_price: 455.30, min_price: 55.00, max_price: 1900.00, product_count: 42 },
        "IMPRESSION": { avg_price: 420.60, min_price: 150.00, max_price: 2600.00, product_count: 30 },
        "RESEAUX & SECURITE": { avg_price: 305.40, min_price: 30.00, max_price: 1600.00, product_count: 25 },
        "ELECTROMENAGER": { avg_price: 1310.00, min_price: 215.00, max_price: 4900.00, product_count: 68 },
        "PC PORTABLE": { avg_price: 2380.00, min_price: 999.00, max_price: 6550.00, product_count: 47 },
        "COMPOSANTS": { avg_price: 385.90, min_price: 40.00, max_price: 2900.00, product_count: 28 },
        "TELEPHONIE": { avg_price: 960.20, min_price: 79.00, max_price: 5400.00, product_count: 23 },
        "GAMING": { avg_price: 620.50, min_price: 50.00, max_price: 3900.00, product_count: 19 },
        "Refrigerateur": { avg_price: 1450.00, min_price: 590.00, max_price: 3900.00, product_count: 14 },
        "Machine à Laver": { avg_price: 1180.00, min_price: 690.00, max_price: 2700.00, product_count: 9 },
        "Imprimante": { avg_price: 475.00, min_price: 170.00, max_price: 2500.00, product_count: 8 },
    },
    zoom: {
        "BUREAUTIQUE": { avg_price: 470.10, min_price: 58.00, max_price: 1950.00, product_count: 37 },
        "IMPRESSION": { avg_price: 435.30, min_price: 155.00, max_price: 2650.00, product_count: 25 },
        "RESEAUX & SECURITE": { avg_price: 312.80, min_price: 32.00, max_price: 1650.00, product_count: 21 },
        "ELECTROMENAGER": { avg_price: 1350.00, min_price: 225.00, max_price: 4950.00, product_count: 60 },
        "PC PORTABLE": { avg_price: 2420.00, min_price: 1020.00, max_price: 6600.00, product_count: 42 },
        "COMPOSANTS": { avg_price: 395.40, min_price: 42.00, max_price: 2950.00, product_count: 24 },
        "TELEPHONIE": { avg_price: 985.50, min_price: 82.00, max_price: 5450.00, product_count: 20 },
        "GAMING": { avg_price: 640.70, min_price: 52.00, max_price: 3950.00, product_count: 16 },
        "Refrigerateur": { avg_price: 1480.00, min_price: 610.00, max_price: 3950.00, product_count: 12 },
        "Machine à Laver": { avg_price: 1210.00, min_price: 710.00, max_price: 2750.00, product_count: 7 },
        "Imprimante": { avg_price: 490.00, min_price: 175.00, max_price: 2550.00, product_count: 6 },
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
    const dropdownRef = useRef<HTMLTableCellElement>(null);

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
    const KNOWN_ECOMMERCE = ["mytek", "tunisianet", "spacenet", "technopro", "darty", "batam", "graiet", "jumbo", "zoom"];
    const PARAPHARMACY = ["parafendri", "parashop", "pharmashop", "pharma-shop"];

    const allPriceKeys = pricesData.map(s => s.name.toLowerCase());
    const ECOMMERCE = type === "products"
        ? [...new Set([...KNOWN_ECOMMERCE, ...allPriceKeys.filter(k => !PARAPHARMACY.includes(k) && k !== "oxtek")])]
        : PARAPHARMACY;

    const relevantShops = type === "products" ? ECOMMERCE : PARAPHARMACY;

    // ─── Overall averages (static for e-commerce, API for parapharmacy) ─
    const shopOverallAverages: Record<string, number> = {};
    if (type === "products") {
        // Use static prices for e-commerce shops
        for (const [key, price] of Object.entries(STATIC_ECOMMERCE_PRICES)) {
            if (relevantShops.includes(key)) {
                shopOverallAverages[key] = price;
            }
        }
    } else {
        pricesData.forEach((shop) => {
            const key = shop.name.toLowerCase();
            if (relevantShops.includes(key)) {
                shopOverallAverages[key] = shop.average_price;
            }
        });
    }

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
            <div className={`rounded-2xl border ${theme.border} bg-white shadow-sm ${type === 'products' ? 'overflow-hidden' : 'overflow-visible'}`}>

                {/* ═══ Header ═══ */}
                <div
                    className="px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 rounded-t-2xl"
                    style={{ background: `linear-gradient(135deg, ${theme.headerFrom}, ${theme.headerTo})` }}
                >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                        <BarChart3 className="size-4 sm:size-5 text-white/90" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-[13px] sm:text-[15px] tracking-wide leading-tight">{title}</h3>
                        <p className="text-white/60 text-[10px] sm:text-[11px] font-medium mt-0.5">
                            {sortedShops.length} boutiques comparées
                        </p>
                    </div>
                </div>

                {/* ═══ Table Layout — Vertical Columns per Shop ═══ */}
                <div className={type === 'products' ? "overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent" : "overflow-x-auto"}>
                    <table className={type === 'products' ? "border-collapse" : "w-full border-collapse"} style={type === 'products' ? { minWidth: `${170 + sortedShops.length * 140}px` } : { tableLayout: 'fixed' as const }}>
                        <colgroup>
                            <col style={type === 'products' ? { width: '170px', minWidth: '170px' } : undefined} className={type !== 'products' ? "w-[140px] sm:w-[170px]" : undefined} />
                            {sortedShops.map(shop => (
                                <col key={shop.name} style={type === 'products' ? { width: '140px', minWidth: '130px' } : undefined} />
                            ))}
                        </colgroup>

                        <tbody>
                            {/* ── Row 1: Shop Logos ── */}
                            <tr className={`border-b ${theme.divider}`}>
                                <td className={`px-4 sm:px-6 py-4 sm:py-5 align-middle ${type === 'products' ? 'sticky left-0 z-20 bg-white' : ''}`}>
                                    <div className="flex items-center gap-2">
                                        <Store className="size-4 text-slate-400" />
                                        <span className="text-[12px] sm:text-[13px] font-semibold text-slate-600">Boutiques</span>
                                    </div>
                                </td>
                                {sortedShops.map((shop, idx) => {
                                    const cfg = getShop(shop.name);
                                    const rank = idx + 1;
                                    return (
                                        <td key={shop.name} className="px-2 sm:px-3 py-4 sm:py-5 align-middle">
                                            <div className="flex justify-center">
                                                <div className="relative group">
                                                    {rank === 1 && (
                                                        <div className="absolute -top-2.5 -right-2.5 z-10">
                                                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-300/50 ring-2 ring-white">
                                                                <Crown className="size-2.5 sm:size-3 text-white" />
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className={`
                                                        flex items-center justify-center w-[100px] h-[50px] sm:w-[130px] sm:h-[60px] px-2 sm:px-3 rounded-xl sm:rounded-2xl
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
                                                                className="max-h-[45px] max-w-[90px] sm:max-h-[65px] sm:max-w-[130px] w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                                                            />
                                                        ) : (
                                                            <span className={`font-bold text-xs sm:text-sm ${cfg.textColor}`}>
                                                                {cfg.display}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>

                            {/* ── Row 2: Overall Average Prices ── */}
                            <tr className={`border-b ${theme.divider}`}>
                                <td className={`px-4 sm:px-6 py-4 sm:py-5 align-middle ${type === 'products' ? 'sticky left-0 z-20 bg-white' : ''}`}>
                                    <div className="flex items-center gap-2">
                                        <Tag className="size-4 text-slate-400" />
                                        <span className="text-[12px] sm:text-[13px] font-semibold text-slate-600">Prix moyen global</span>
                                    </div>
                                </td>
                                {sortedShops.map((shop, idx) => {
                                    const rank = idx + 1;
                                    const diff = cheapestOverall > 0
                                        ? ((shop.price - cheapestOverall) / cheapestOverall * 100)
                                        : 0;
                                    const config = RANK_CONFIG[rank];

                                    return (
                                        <td key={shop.name} className="px-2 sm:px-3 py-4 sm:py-5 align-middle">
                                            <div className="flex justify-center">
                                                <div className={`
                                                    relative flex flex-col items-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl min-w-[85px] sm:min-w-[100px]
                                                    transition-all duration-300
                                                    ${config
                                                        ? `${config.cardBg} border ${config.border} shadow-md ${config.glow}`
                                                        : "bg-white border border-slate-200/80 hover:shadow-sm"
                                                    }
                                                `}>
                                                    {rank === 1 && (
                                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                                                            <span className={`inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider whitespace-nowrap ${theme.pill}`}>
                                                                <TrendingDown className="size-2 sm:size-2.5" />
                                                                Moins cher
                                                            </span>
                                                        </div>
                                                    )}
                                                    <span className={`text-[15px] sm:text-[17px] font-extrabold tracking-tight ${config ? config.textColor : "text-slate-700"}`}>
                                                        {shop.price.toFixed(2)}
                                                    </span>
                                                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold mt-0.5">DT</span>
                                                    {rank > 1 && diff > 0 && (
                                                        <span className={`mt-1 sm:mt-1.5 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full
                                                            ${diff > 2 ? "bg-red-50 text-red-500" : "bg-slate-100 text-slate-500"}
                                                        `}>
                                                            +{diff.toFixed(1)}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>

                            {/* ── Row 3: Category Price Comparison ── */}
                            <tr>
                                <td className={`px-4 sm:px-6 py-4 sm:py-5 align-top relative ${type === 'products' ? 'sticky left-0 z-20 bg-white' : ''}`} ref={dropdownRef}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <BarChart3 className="size-4 text-slate-400" />
                                        <span className="text-[12px] sm:text-[13px] font-semibold text-slate-600">Par catégorie</span>
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
                                        <div className="absolute left-4 sm:left-6 sm:w-60 top-full mt-1 bg-white rounded-2xl shadow-2xl border border-slate-200 py-1.5 z-50 max-h-[280px] overflow-y-auto
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
                                </td>
                                {(() => {
                                    if (enrichedCategoryShops.length === 0) {
                                        return sortedShops.map((shop) => (
                                            <td key={shop.name} className="px-2 sm:px-3 py-4 sm:py-5 align-middle">
                                                <div className="flex justify-center">
                                                    <div className="flex flex-col items-center px-3 sm:px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50/50 border border-dashed border-slate-200 min-w-[85px] sm:min-w-[100px]">
                                                        <span className="text-sm text-slate-300 font-medium">—</span>
                                                        <span className="text-[9px] text-slate-300 mt-1">N/A</span>
                                                    </div>
                                                </div>
                                            </td>
                                        ));
                                    }

                                    const cheapestCatPrice = enrichedCategoryShops[0]?.avg_price || 0;

                                    return sortedShops.map((overallShop) => {
                                        const catShop = enrichedCategoryShops.find(
                                            s => s.shop.toLowerCase() === overallShop.name.toLowerCase()
                                        );

                                        if (!catShop) {
                                            return (
                                                <td key={overallShop.name} className="px-2 sm:px-3 py-4 sm:py-5 align-middle">
                                                    <div className="flex justify-center">
                                                        <div className="flex flex-col items-center px-3 sm:px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50/50 border border-dashed border-slate-200 min-w-[85px] sm:min-w-[100px]">
                                                            <span className="text-sm text-slate-300 font-medium">—</span>
                                                            <span className="text-[9px] text-slate-300 mt-1">N/A</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            );
                                        }

                                        const catRank = enrichedCategoryShops.indexOf(catShop) + 1;
                                        const diff = cheapestCatPrice > 0
                                            ? ((catShop.avg_price - cheapestCatPrice) / cheapestCatPrice * 100)
                                            : 0;
                                        const config = RANK_CONFIG[catRank];

                                        return (
                                            <td key={overallShop.name} className="px-2 sm:px-3 py-4 sm:py-5 align-middle">
                                                <div className="flex justify-center relative pt-3">
                                                    {/* Medal badge */}
                                                    {catRank <= 3 && config && (
                                                        <div className={`
                                                            absolute top-0 left-1/2 -translate-x-1/2 z-10
                                                            w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br ${config.gradient}
                                                            flex items-center justify-center text-[11px] sm:text-[13px]
                                                            shadow-lg border-2 border-white
                                                        `}>
                                                            {config.emoji}
                                                        </div>
                                                    )}
                                                    <div className={`
                                                        flex flex-col items-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl min-w-[85px] sm:min-w-[100px]
                                                        transition-all duration-300 hover:shadow-lg
                                                        ${config
                                                            ? `${config.cardBg} border ${config.border} shadow-md ${config.glow}`
                                                            : "bg-white border border-slate-200/80 hover:border-slate-300"
                                                        }
                                                    `}>
                                                        <span className={`text-[15px] sm:text-[17px] font-extrabold tracking-tight ${config ? config.textColor : "text-slate-700"}`}>
                                                            {catShop.avg_price.toFixed(2)}
                                                        </span>
                                                        <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold mt-0.5">DT</span>

                                                        {/* Product count */}
                                                        <span className="text-[8px] sm:text-[9px] text-slate-400 font-medium mt-1">
                                                            {catShop.product_count} produits
                                                        </span>

                                                        {/* Percent badge */}
                                                        {catRank > 1 && diff > 0 && (
                                                            <span className={`mt-1 sm:mt-1.5 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full
                                                                ${diff > 5 ? "bg-red-50 text-red-500" : diff > 2 ? "bg-orange-50 text-orange-500" : "bg-slate-100 text-slate-500"}
                                                            `}>
                                                                +{diff.toFixed(1)}%
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        );
                                    });
                                })()}
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
