"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { LogoCarousel } from "@/components/LogoCarousel";

const SHOP_IMAGES: Record<string, string> = {
    "mytek": "/images/téléchargement (4).png",
    "tunisianet": "/images/téléchargement (6).png",
    "ac space": "/images/file.svg",
    "wamia": "/images/vercel.svg",
    "tdiscount": "/images/globe.svg",
    "parafendri": "/images/parafendri-removebg-preview.png",
    "parashop": "/images/parashop-removebg-preview.png",
    "pharmashop": "/images/pharmashop-removebg-preview.png",
    "spacenet": "/images/spacenet-removebg-preview.png",
    "pharma-shop": "/images/pharmashop-removebg-preview.png",
    "technopro": "/images/technopro-logo.jpg",
    "darty": "/images/Darty.png",
    "batam": "/images/logo-batam.jpg",
    "graiet": "/images/logo-graiet.png",
    "jumbo": "/images/logo-jambo.png",
    "zoom": "/images/logo-zoom.jpg",
};

const DEFAULT_SHOPS = [
    { name: "Spacenet", logo: "Spacenet", color: "text-[#E30613]", price: "800.45 DT" },
    { name: "Tunisianet", logo: "Tunisianet", color: "text-[#005DAA]", price: "815.72 DT" },
    { name: "Batam", logo: "Batam", color: "text-[#E53E3E]", price: "828.38 DT" },
    { name: "MyTek", logo: "MyTEK", color: "text-[#E30613]", price: "842.16 DT" },
    { name: "TechnoPro", logo: "TechnoPro", color: "text-[#7C3AED]", price: "855.93 DT" },
    { name: "Darty", logo: "Darty", color: "text-[#CA8A04]", price: "867.54 DT" },
    { name: "Graiet", logo: "Graiet", color: "text-[#2B6CB0]", price: "878.27 DT" },
    { name: "Jumbo", logo: "Jumbo", color: "text-[#D69E2E]", price: "889.61 DT" },
    { name: "Zoom", logo: "Zoom", color: "text-[#38A169]", price: "900.85 DT" },
    { name: "Parafendri", logo: "Parafendri", color: "text-green-600", price: "45 DT" },
    { name: "Parashop", logo: "Parashop", color: "text-green-600", price: "42 DT" },
    { name: "Pharma-shop", logo: "Pharma-shop", color: "text-green-600", price: "48 DT" },
];

const ECOMMERCE_SHOPS = ["mytek", "tunisianet", "spacenet", "technopro", "darty", "batam", "graiet", "jumbo", "zoom"];
const PARAPHARMACY_SHOPS = ["parafendri", "parashop", "pharmashop", "pharma-shop"];
const SECTION_TITLE_CLASS = "text-left text-[12px] font-black leading-none tracking-tight whitespace-nowrap min-[420px]:text-[14px] sm:text-lg md:text-xl lg:text-[28px]";
const HEADER_ARTWORK_CLASS = "relative hidden h-16 w-24 shrink-0 sm:block md:h-20 md:w-32 lg:h-24 lg:w-42";

interface PriceApiItem {
    name: string;
    average_price: number;
}

interface DisplayShop {
    name: string;
    logo: string;
    color: string;
    price: string;
    numericPrice: number;
    image?: string;
}

interface PriceCardsProps {
    initialData?: PriceApiItem[];
}

function RankBadge({ rank }: { rank: number }) {
    const configs = [
        { color: "bg-[#FFD700]", text: "1st", border: "border-[#B8860B]", shadow: "shadow-[#FFD700]/50" },
        { color: "bg-[#C0C0C0]", text: "2nd", border: "border-[#808080]", shadow: "shadow-[#C0C0C0]/50" },
        { color: "bg-[#CD7F32]", text: "3rd", border: "border-[#8B4513]", shadow: "shadow-[#CD7F32]/50" },
    ];

    if (rank > 3) {
        return null;
    }

    const config = configs[rank - 1];

    return (
        <div className={`absolute -right-3 -top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 ${config.color} ${config.border} ${config.shadow} -rotate-12 shadow-lg transition-transform duration-300 group-hover:rotate-0`}>
            <span className="text-xs font-black italic text-white">{config.text}</span>
        </div>
    );
}

function SectionHeader({
    barColor,
    accentColor,
    accentLabel,
}: {
    barColor: string;
    accentColor: string;
    accentLabel: string;
}) {
    return (
        <div className="mx-auto mb-8 flex max-w-7xl items-start justify-between gap-6 px-4 sm:items-center sm:gap-8 lg:gap-12">
            <div className="flex min-w-0 max-w-4xl flex-1 items-center gap-3 sm:gap-4">
                <div className={`h-8 w-2 shrink-0 rounded-full ${barColor} sm:h-10`}></div>
                <h2 className={`${SECTION_TITLE_CLASS} text-[#2563EB]`}>
                    La moyenne des Prix par site <span className={accentColor}>{accentLabel}</span> <span className="ml-1 text-[#8B5CF6]">مُعَدَّلَ الأسعار</span>
                </h2>
            </div>

            <div className={HEADER_ARTWORK_CLASS}>
                <Image
                    src="/images/Gemini_Generated_Image_cgcjk1cgcjk1cgcj 1.svg"
                    alt="Price Analysis"
                    fill
                    className="object-contain"
                />
            </div>
        </div>
    );
}

export default function PriceCards({ initialData }: PriceCardsProps) {
    const [shops, setShops] = useState<DisplayShop[]>([]);

    useEffect(() => {
        const loadPrices = async () => {
            try {
                const data = initialData ?? [];
                const apiShopsMap = new Map<string, PriceApiItem>();

                data.forEach((shop) => {
                    apiShopsMap.set(shop.name.toLowerCase(), shop);
                });

                const mergedShops: DisplayShop[] = DEFAULT_SHOPS.map((defaultShop) => {
                    const isEcommerce = ECOMMERCE_SHOPS.includes(defaultShop.name.toLowerCase());
                    const apiShop = isEcommerce ? null : apiShopsMap.get(defaultShop.name.toLowerCase());
                    const numericPrice = apiShop ? apiShop.average_price : (parseFloat(defaultShop.price) || 999999);

                    return {
                        ...defaultShop,
                        numericPrice,
                        price: apiShop ? `${apiShop.average_price.toFixed(2)} DT` : defaultShop.price,
                        image: SHOP_IMAGES[defaultShop.name.toLowerCase()] || defaultShop.logo,
                    };
                });

                data.forEach((shop) => {
                    const key = shop.name.toLowerCase();
                    if (!DEFAULT_SHOPS.some((defaultShop) => defaultShop.name.toLowerCase() === key)) {
                        mergedShops.push({
                            name: shop.name,
                            logo: shop.name,
                            color: "text-black",
                            numericPrice: shop.average_price,
                            image: SHOP_IMAGES[key],
                            price: `${shop.average_price.toFixed(2)} DT`,
                        });
                    }
                });

                setShops(mergedShops);
            } catch (error) {
                console.error("Error fetching prices:", error);
                setShops(
                    DEFAULT_SHOPS.map((shop) => ({
                        ...shop,
                        numericPrice: parseFloat(shop.price) || 999999,
                        image: SHOP_IMAGES[shop.name.toLowerCase()],
                    }))
                );
            }
        };

        loadPrices();
    }, [initialData]);

    const getSortedShops = (group: string[]) => {
        return shops
            .filter((shop) => group.includes(shop.name.toLowerCase()))
            .sort((left, right) => left.numericPrice - right.numericPrice);
    };

    const ecommerceShopsList = getSortedShops(ECOMMERCE_SHOPS);
    const parapharmacyShopsList = getSortedShops(PARAPHARMACY_SHOPS).slice(0, 3);

    const renderShopCard = (shop: DisplayShop, index: number) => {
        const rank = index + 1;

        return (
            <div className="group relative flex w-full min-w-0 flex-col gap-3">
                {rank <= 3 && <RankBadge rank={rank} />}

                <div
                    className={`relative flex h-28 items-center justify-center overflow-hidden rounded-[22px] border-2 bg-white p-4 transition-all duration-300 sm:h-32 sm:p-5 ${
                        rank === 1
                            ? "border-[#FFD700]/30 shadow-xl"
                            : rank === 2
                              ? "border-[#C0C0C0]/30 shadow-lg"
                              : rank === 3
                                ? "border-[#CD7F32]/30 shadow-md"
                                : "border-[#E5E7EB]/80"
                    }`}
                >
                    {shop.image ? (
                        <div className="flex h-full w-full items-center justify-center">
                            <Image
                                src={shop.image}
                                alt={shop.name}
                                width={128}
                                height={64}
                                className="max-h-13 max-w-full object-contain transition-transform duration-300 group-hover:scale-105 sm:max-h-16"
                            />
                        </div>
                    ) : (
                        <span className={`px-2 text-center text-xs font-black uppercase tracking-tight transition-transform duration-300 group-hover:scale-105 sm:text-sm ${shop.color}`}>
                            {shop.logo}
                        </span>
                    )}

                    {rank <= 3 && (
                        <div
                            className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 ${
                                rank === 1
                                    ? "bg-linear-to-br from-[#FFD700] to-transparent"
                                    : rank === 2
                                      ? "bg-linear-to-br from-[#C0C0C0] to-transparent"
                                      : "bg-linear-to-br from-[#CD7F32] to-transparent"
                            }`}
                        ></div>
                    )}
                </div>

                <div
                    className={`rounded-2xl border py-2 text-center transition-all duration-300 ${
                        rank === 1
                            ? "border-[#FFD700]/40 bg-[#FFD700]/10"
                            : rank === 2
                              ? "border-[#C0C0C0]/40 bg-[#C0C0C0]/10"
                              : rank === 3
                                ? "border-[#CD7F32]/40 bg-[#CD7F32]/10"
                                : "border-white/50 bg-[#EBEDF2]"
                    }`}
                >
                    <span
                        className={`text-xs font-extrabold sm:text-sm lg:text-base ${
                            rank === 1
                                ? "text-[#B8860B]"
                                : rank === 2
                                  ? "text-[#808080]"
                                  : rank === 3
                                    ? "text-[#8B4513]"
                                    : "text-[#111827]"
                        }`}
                    >
                        {shop.price}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <section className="w-full bg-white py-12">
            {ecommerceShopsList.length > 0 && (
                <div className="mb-16">
                    <SectionHeader barColor="bg-[#8B5CF6]" accentColor="text-[#8B5CF6]" accentLabel="E-commerce" />

                    <div className="mx-auto max-w-7xl px-4">
                        <LogoCarousel
                            cards={ecommerceShopsList.map((shop, index) => renderShopCard(shop, index))}
                            visibleCount={4}
                            label="e-commerce shop logos"
                        />
                    </div>
                </div>
            )}

            {parapharmacyShopsList.length > 0 && (
                <div>
                    <SectionHeader barColor="bg-[#10B981]" accentColor="text-[#10B981]" accentLabel="Parapharmacie" />

                    <div className="mx-auto max-w-7xl px-4">
                        <LogoCarousel
                            cards={parapharmacyShopsList.map((shop, index) => renderShopCard(shop, index))}
                            visibleCount={3}
                            label="parapharmacy shop logos"
                            maxWidthClassName="max-w-[620px]"
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
