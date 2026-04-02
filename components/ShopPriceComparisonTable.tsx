"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useMemo } from "react";
import type { ComponentType } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, TrendingDown, Store, BarChart3, Tag, Crown, Medal, Award } from "lucide-react";

// ─── Shop Configuration ─────────────────────────────────────────────
const SHOP_CONFIG: Record<string, { image: string; display: string; accent: string; textColor: string }> = {
    mytek: { image: "/images/téléchargement (4).png", display: "MyTek", accent: "#E30613", textColor: "text-red-600" },
    tunisianet: { image: "/images/téléchargement (6).png", display: "Tunisianet", accent: "#005DAA", textColor: "text-blue-700" },
    spacenet: { image: "/images/spacenet-removebg-preview.png", display: "Spacenet", accent: "#E30613", textColor: "text-red-600" },
    technopro: { image: "/images/technopro-logo.jpg", display: "TechnoPro", accent: "#7C3AED", textColor: "text-blue-600" },
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

const KNOWN_ECOMMERCE = ["mytek", "tunisianet", "spacenet", "technopro", "darty", "batam", "graiet", "jumbo", "zoom"];
const PARAPHARMACY = ["parafendri", "parashop", "pharmashop", "pharma-shop"];

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
    icon: ComponentType<{ className?: string }>;
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
};

function getVisibleCount(viewportWidth: number): number {
    if (viewportWidth < 640) {
        return 2;
    }

    if (viewportWidth < 1024) {
        return 3;
    }

    return 5;
}

function RowLabel({
    icon: Icon,
    title,
    subtitle,
    minHeight,
}: {
    icon: ComponentType<{ className?: string }>;
    title: string;
    subtitle?: string;
    minHeight: string;
}) {
    return (
        <div className={`hidden rounded-3xl border border-slate-200/80 bg-linear-to-br from-white to-slate-50 px-4 py-4 text-left shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:flex md:flex-col md:justify-center ${minHeight}`}>
            <div className="flex items-center gap-2 text-slate-500">
                <div className="flex size-8 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                    <Icon className="size-4" />
                </div>
                <span className="text-[12px] font-semibold sm:text-[13px]">{title}</span>
            </div>
            {subtitle && (
                <span className="mt-3 line-clamp-2 text-xs font-bold text-slate-700">{subtitle}</span>
            )}
        </div>
    );
}

function MobileRowLabel({
    icon: Icon,
    title,
    subtitle,
}: {
    icon: ComponentType<{ className?: string }>;
    title: string;
    subtitle?: string;
}) {
    return (
        <div className="mb-3 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-linear-to-r from-white to-slate-50 px-3.5 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)] md:hidden">
            <div className="flex items-center gap-2 text-slate-500">
                <div className="flex size-7 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    <Icon className="size-4" />
                </div>
                <span className="text-[12px] font-semibold">{title}</span>
            </div>
            {subtitle && <span className="truncate text-[11px] font-bold text-slate-700">{subtitle}</span>}
        </div>
    );
}

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
    const [startIndex, setStartIndex] = useState(0);
    const [viewportWidth, setViewportWidth] = useState<number>(() => {
        if (typeof window === "undefined") {
            return 1280;
        }

        return window.innerWidth;
    });
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

    useEffect(() => {
        const handleResize = () => setViewportWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const relevantShops = useMemo(() => {
        const allPriceKeys = pricesData.map((shop) => shop.name.toLowerCase());

        if (type === "products") {
            return [...new Set([...KNOWN_ECOMMERCE, ...allPriceKeys.filter((key) => !PARAPHARMACY.includes(key) && key !== "oxtek")])];
        }

        return PARAPHARMACY;
    }, [pricesData, type]);

    // ─── Overall averages (static for e-commerce, API for parapharmacy) ─
    const shopOverallAverages = useMemo(() => {
        const averages: Record<string, number> = {};

        if (type === "products") {
            for (const [key, price] of Object.entries(STATIC_ECOMMERCE_PRICES)) {
                if (relevantShops.includes(key)) {
                    averages[key] = price;
                }
            }
        } else {
            pricesData.forEach((shop) => {
                const key = shop.name.toLowerCase();
                if (relevantShops.includes(key)) {
                    averages[key] = shop.average_price;
                }
            });
        }

        return averages;
    }, [pricesData, relevantShops, type]);

    // ─── Sorted shops (cheapest first) ──────────────────────────────
    const sortedShops = useMemo(() => {
        return relevantShops
            .filter((key) => shopOverallAverages[key] > 0)
            .map((name) => ({ name, price: shopOverallAverages[name] || 0 }))
            .sort((a, b) => a.price - b.price);
    }, [relevantShops, shopOverallAverages]);

    const cheapestOverall = sortedShops[0]?.price || 0;
    const visibleCount = getVisibleCount(viewportWidth);
    const maxStartIndex = Math.max(0, sortedShops.length - visibleCount);
    const safeStartIndex = Math.min(startIndex, maxStartIndex);
    const visibleShops = useMemo(
        () => sortedShops.slice(safeStartIndex, safeStartIndex + visibleCount),
        [safeStartIndex, sortedShops, visibleCount]
    );

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

    const categoryShopMap = useMemo(() => {
        return new Map(enrichedCategoryShops.map((shop) => [shop.shop.toLowerCase(), shop]));
    }, [enrichedCategoryShops]);

    const cheapestCategoryPrice = enrichedCategoryShops[0]?.avg_price || 0;
    const showControls = sortedShops.length > visibleCount;
    const visibleRangeLabel = sortedShops.length === 0
        ? "0 / 0"
        : `${safeStartIndex + 1}-${Math.min(sortedShops.length, safeStartIndex + visibleCount)} / ${sortedShops.length}`;

    const renderLogoCard = (shopName: string) => {
        const cfg = getShop(shopName);
        const rank = sortedShops.findIndex((shop) => shop.name === shopName) + 1;

        return (
            <div className="flex justify-center">
                <div className="relative group w-full">
                    {rank === 1 && (
                        <div className="absolute -right-2.5 -top-2.5 z-10">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-linear-to-br from-amber-400 to-yellow-500 shadow-lg shadow-amber-300/50 sm:h-7 sm:w-7">
                                <Crown className="size-3 text-white" />
                            </div>
                        </div>
                    )}

                    <div
                        className={`flex min-h-23 w-full items-center justify-center rounded-3xl px-3 py-4 transition-all duration-300 ${
                            rank === 1
                                ? "border-2 border-amber-200 bg-linear-to-b from-amber-50 via-white to-yellow-50 shadow-[0_18px_35px_rgba(251,191,36,0.18)]"
                                : "border border-slate-200/70 bg-linear-to-b from-white to-slate-50 hover:border-slate-300 hover:bg-white hover:shadow-[0_16px_30px_rgba(15,23,42,0.08)]"
                        }`}
                    >
                        {cfg.image ? (
                            <Image
                                src={cfg.image}
                                alt={cfg.display}
                                width={130}
                                height={65}
                                className="max-h-12 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-110 sm:max-h-16"
                            />
                        ) : (
                            <span className={`text-center text-xs font-bold sm:text-sm ${cfg.textColor}`}>
                                {cfg.display}
                            </span>
                        )}
                    </div>

                    <div className="mt-2 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:text-[11px]">
                            {cfg.display}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const renderOverallCard = (shopName: string) => {
        const overallShop = sortedShops.find((shop) => shop.name === shopName);

        if (!overallShop) {
            return null;
        }

        const rank = sortedShops.findIndex((shop) => shop.name === shopName) + 1;
        const diff = cheapestOverall > 0
            ? ((overallShop.price - cheapestOverall) / cheapestOverall * 100)
            : 0;
        const config = RANK_CONFIG[rank];

        return (
            <div className="flex justify-center">
                <div
                    className={`relative flex min-h-30 w-full flex-col items-center justify-center rounded-3xl px-3 py-3 transition-all duration-300 ${
                        config
                            ? `${config.cardBg} border ${config.border} shadow-[0_18px_35px_rgba(15,23,42,0.08)] ${config.glow}`
                            : "border border-slate-200/80 bg-linear-to-b from-white to-slate-50 hover:shadow-[0_14px_28px_rgba(15,23,42,0.08)]"
                    }`}
                >
                    {rank === 1 && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                            <span className={`inline-flex items-center gap-0.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-sm ${theme.pill}`}>
                                <TrendingDown className="size-2.5" />
                                Moins cher
                            </span>
                        </div>
                    )}
                    <span className={`mt-2 text-[16px] font-extrabold tracking-tight sm:text-[18px] ${config ? config.textColor : "text-slate-700"}`}>
                        {overallShop.price.toFixed(2)}
                    </span>
                    <span className="mt-0.5 text-[10px] font-semibold text-slate-400">DT</span>
                    {rank > 1 && diff > 0 && (
                        <span className={`mt-3 rounded-full px-2.5 py-1 text-[10px] font-bold ${diff > 2 ? "bg-red-50 text-red-500" : "bg-slate-100 text-slate-500"}`}>
                            +{diff.toFixed(1)}%
                        </span>
                    )}
                </div>
            </div>
        );
    };

    const renderCategoryCard = (shopName: string) => {
        const catShop = categoryShopMap.get(shopName.toLowerCase());

        if (!catShop) {
            return (
                <div className="flex justify-center">
                    <div className="flex min-h-33 w-full flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-linear-to-b from-slate-50 to-white px-3 py-4 text-center">
                        <span className="text-sm font-medium text-slate-300">—</span>
                        <span className="mt-1 text-[10px] text-slate-300">N/A</span>
                    </div>
                </div>
            );
        }

        const catRank = enrichedCategoryShops.findIndex((shop) => shop.shop.toLowerCase() === shopName.toLowerCase()) + 1;
        const diff = cheapestCategoryPrice > 0
            ? ((catShop.avg_price - cheapestCategoryPrice) / cheapestCategoryPrice * 100)
            : 0;
        const config = RANK_CONFIG[catRank];

        return (
            <div className="flex justify-center">
                <div className="relative w-full pt-3">
                    {catRank === 1 && config && (
                        <div className={`absolute left-1/2 top-0 z-10 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-linear-to-br ${config.gradient} text-[13px] shadow-lg sm:h-8 sm:w-8`}>
                            {config.emoji}
                        </div>
                    )}
                    <div
                        className={`flex min-h-33 w-full flex-col items-center justify-center rounded-3xl px-3 py-3 transition-all duration-300 hover:shadow-lg ${
                            config
                                ? `${config.cardBg} border ${config.border} shadow-[0_18px_35px_rgba(15,23,42,0.08)] ${config.glow}`
                                : "border border-slate-200/80 bg-linear-to-b from-white to-slate-50 hover:border-slate-300"
                        }`}
                    >
                        <span className={`mt-2 text-[16px] font-extrabold tracking-tight sm:text-[18px] ${config ? config.textColor : "text-slate-700"}`}>
                            {catShop.avg_price.toFixed(2)}
                        </span>
                        <span className="mt-0.5 text-[10px] font-semibold text-slate-400">DT</span>
                        <span className="mt-2 rounded-full bg-white/70 px-2.5 py-1 text-[9px] font-semibold text-slate-500 shadow-sm">
                            {catShop.product_count} produits
                        </span>
                        {catRank > 1 && diff > 0 && (
                            <span className={`mt-3 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                diff > 5 ? "bg-red-50 text-red-500" : diff > 2 ? "bg-orange-50 text-orange-500" : "bg-slate-100 text-slate-500"
                            }`}>
                                +{diff.toFixed(1)}%
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full">
            <div className={`overflow-hidden rounded-2xl border ${theme.border} bg-white shadow-sm`}>

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

                <div className="p-4 sm:p-5 lg:p-6">
                    <div className={`mb-5 flex flex-col gap-3 border-b pb-4 ${theme.divider} lg:flex-row lg:items-end lg:justify-between`}>
                        <div ref={dropdownRef} className="relative w-full max-w-sm">
                            <div className="mb-2 flex items-center gap-2">
                                <BarChart3 className="size-4 text-slate-400" />
                                <span className="text-[12px] font-semibold text-slate-600 sm:text-[13px]">Par catégorie</span>
                            </div>
                            <button
                                onClick={() => setDropdownOpen((open) => !open)}
                                className={`flex w-full items-center justify-between gap-2 rounded-2xl border-2 px-4 py-3 text-[12px] font-bold shadow-sm transition-all duration-200 ${
                                    dropdownOpen
                                        ? `${theme.lightBg} ${theme.text} border-current shadow-md ring-4 ${theme.ring}`
                                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:shadow-sm"
                                }`}
                            >
                                <span className="truncate">{selectedCategory || "Catégorie"}</span>
                                <ChevronDown className={`size-3.5 shrink-0 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute left-0 top-full z-50 mt-2 max-h-70 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white py-1.5 shadow-2xl ring-1 ring-black/5 animate-in slide-in-from-top-2 duration-200 sm:w-72">
                                    <div className={`mx-1.5 mb-1 rounded-xl px-4 py-2 ${theme.lightBg}`}>
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
                                            className={`mx-0 w-full rounded-lg px-4 py-2.5 text-left text-[12px] transition-all duration-150 ${
                                                cat === selectedCategory
                                                    ? `${theme.lightBg} ${theme.text} font-bold`
                                                    : "font-medium text-slate-600 hover:bg-slate-50"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                {cat === selectedCategory && (
                                                    <div className={`h-1.5 w-1.5 rounded-full ${theme.pill.split(" ")[0]}`} />
                                                )}
                                                <span>{cat}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between gap-3 lg:justify-end">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                {visibleRangeLabel}
                            </span>
                            {showControls && (
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        aria-label="Voir les boutiques precedentes"
                                        onClick={() => setStartIndex((current) => Math.max(0, current - 5))}
                                        disabled={safeStartIndex === 0}
                                        className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-35 enabled:hover:border-slate-300 enabled:hover:bg-slate-50 enabled:hover:text-slate-900"
                                    >
                                        <ChevronLeft className="size-4" />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Voir les boutiques suivantes"
                                        onClick={() => setStartIndex((current) => Math.min(maxStartIndex, current + 5))}
                                        disabled={safeStartIndex >= maxStartIndex}
                                        className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-35 enabled:hover:border-slate-300 enabled:hover:bg-slate-50 enabled:hover:text-slate-900"
                                    >
                                        <ChevronRight className="size-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[150px_minmax(0,1fr)] xl:grid-cols-[170px_minmax(0,1fr)]">
                        <div className="hidden gap-4 md:grid">
                            <RowLabel icon={Store} title="Boutiques" minHeight="min-h-[108px]" />
                            <RowLabel icon={Tag} title={type === "products" ? "Prix moyen global" : "Prix moyen"} minHeight="min-h-[118px]" />
                            <RowLabel icon={BarChart3} title="Par catégorie" subtitle={selectedCategory || "Catégorie"} minHeight="min-h-[132px]" />
                        </div>

                        <div className="space-y-4">
                            <div className={`rounded-3xl border ${theme.divider} bg-linear-to-b from-slate-50/70 to-white p-3 sm:p-4 shadow-[0_14px_34px_rgba(15,23,42,0.04)]`}>
                                <MobileRowLabel icon={Store} title="Boutiques" />
                                <div className="flex justify-between">
                                    {visibleShops.map((shop) => (
                                        <div 
                                            key={`logo-${shop.name}`} 
                                            className="min-w-0"
                                            style={{ width: `calc((100% - (${visibleCount - 1} * ${viewportWidth < 640 ? 12 : 16}px)) / ${visibleCount})` }}
                                        >
                                            {renderLogoCard(shop.name)}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={`rounded-3xl border ${theme.divider} bg-linear-to-b from-slate-50/70 to-white p-3 sm:p-4 shadow-[0_14px_34px_rgba(15,23,42,0.04)]`}>
                                <MobileRowLabel icon={Tag} title={type === "products" ? "Prix moyen global" : "Prix moyen"} />
                                <div className="flex justify-between">
                                    {visibleShops.map((shop) => (
                                        <div 
                                            key={`overall-${shop.name}`} 
                                            className="min-w-0"
                                            style={{ width: `calc((100% - (${visibleCount - 1} * ${viewportWidth < 640 ? 12 : 16}px)) / ${visibleCount})` }}
                                        >
                                            {renderOverallCard(shop.name)}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={`rounded-3xl border ${theme.divider} bg-linear-to-b from-slate-50/70 to-white p-3 sm:p-4 shadow-[0_14px_34px_rgba(15,23,42,0.04)]`}>
                                <MobileRowLabel icon={BarChart3} title="Par catégorie" subtitle={selectedCategory || "Catégorie"} />
                                <div className="flex justify-between">
                                    {visibleShops.map((shop) => (
                                        <div 
                                            key={`category-${shop.name}`} 
                                            className="min-w-0"
                                            style={{ width: `calc((100% - (${visibleCount - 1} * ${viewportWidth < 640 ? 12 : 16}px)) / ${visibleCount})` }}
                                        >
                                            {renderCategoryCard(shop.name)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
