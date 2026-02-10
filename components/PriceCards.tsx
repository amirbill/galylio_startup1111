"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/api"

// Mapping shop names (normalized to lowercase) to image paths
const SHOP_IMAGES: { [key: string]: string } = {
    "mytek": "/images/téléchargement (4).png",
    "tunisianet": "/images/téléchargement (6).png",
    "ac space": "/images/file.svg",
    "zoom": "/images/window.svg",
    "wamia": "/images/vercel.svg",
    "tdiscount": "/images/globe.svg",
    "graiet": "/images/file.svg",
    "parafendri": "/images/parafendri-removebg-preview.png",
    "parashop": "/images/parashop-removebg-preview.png",
    "pharmashop": "/images/pharmashop-removebg-preview.png",
    "spacenet": "/images/spacenet-removebg-preview.png",
    "pharma-shop": "/images/pharmashop-removebg-preview.png",
};

// Fallback data in case DB is empty
const DEFAULT_SHOPS = [
    { name: 'MyTek', logo: 'MyTEK', color: 'text-[#E30613]', price: '150 DT' },
    { name: 'Tunisianet', logo: 'Tunisianet', color: 'text-[#005DAA]', price: '150 DT' },
    { name: 'Spacenet', logo: 'Spacenet', color: 'text-[#E30613]', price: '150 DT' },
    { name: 'Parafendri', logo: 'Parafendri', color: 'text-green-600', price: '45 DT' },
    { name: 'Parashop', logo: 'Parashop', color: 'text-green-600', price: '42 DT' },
    { name: 'Pharma-shop', logo: 'Pharma-shop', color: 'text-green-600', price: '48 DT' },
];

// Define categories to filter which shop goes where
const ECOMMERCE_SHOPS = ["mytek", "tunisianet", "spacenet"];
const PARAPHARMACY_SHOPS = ["parafendri", "parashop", "pharmashop", "pharma-shop"];

// Helper to render a rank badge
const RankBadge = ({ rank }: { rank: number }) => {
    const configs = [
        { color: "bg-[#FFD700]", text: "1st", border: "border-[#B8860B]", shadow: "shadow-[#FFD700]/50" },
        { color: "bg-[#C0C0C0]", text: "2nd", border: "border-[#808080]", shadow: "shadow-[#C0C0C0]/50" },
        { color: "bg-[#CD7F32]", text: "3rd", border: "border-[#8B4513]", shadow: "shadow-[#CD7F32]/50" },
    ];

    if (rank > 3) return null;
    const config = configs[rank - 1];

    return (
        <div className={`absolute -top-3 -right-3 z-20 ${config.color} ${config.border} border-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${config.shadow} transform -rotate-12 group-hover:rotate-0 transition-transform duration-300`}>
            <span className="text-white text-xs font-black italic">{config.text}</span>
        </div>
    );
};

interface PriceCardsProps {
    initialData?: any[];
}

export default function PriceCards({ initialData }: PriceCardsProps) {
    const [shops, setShops] = useState<any[]>([]);
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
        const loadPrices = async () => {
            try {
                let data;

                if (initialData) {
                    data = initialData;
                } else {
                    // Fallback fetch removed for security. 
                    // Data should be provided by Server Component props.
                    console.warn("PriceCards: No initialData provided");
                    data = [];
                }

                // Merge API data with default shops
                const apiShopsMap = new Map();
                if (data && Array.isArray(data)) {
                    data.forEach((shop: any) => {
                        apiShopsMap.set(shop.name.toLowerCase(), shop);
                    });
                }

                const mergedShops = DEFAULT_SHOPS.map(defaultShop => {
                    const apiShop = apiShopsMap.get(defaultShop.name.toLowerCase());
                    const numericPrice = apiShop ? apiShop.average_price : (parseFloat(defaultShop.price) || 999999);
                    return {
                        ...defaultShop,
                        numericPrice,
                        price: apiShop ? `${apiShop.average_price.toFixed(2)} DT` : defaultShop.price,
                        image: SHOP_IMAGES[defaultShop.name.toLowerCase()] || defaultShop.logo
                    };
                });

                // Also add any API shops that are NOT in defaults
                if (data && Array.isArray(data)) {
                    data.forEach((shop: any) => {
                        const key = shop.name.toLowerCase();
                        if (!DEFAULT_SHOPS.some(ds => ds.name.toLowerCase() === key)) {
                            mergedShops.push({
                                name: shop.name,
                                logo: shop.name,
                                numericPrice: shop.average_price,
                                image: SHOP_IMAGES[key],
                                color: 'text-black',
                                price: `${shop.average_price.toFixed(2)} DT`
                            });
                        }
                    });
                }

                setShops(mergedShops);

            } catch (error) {
                console.error("Error fetching prices:", error);
                const formattedDefaults = DEFAULT_SHOPS.map(shop => ({
                    ...shop,
                    numericPrice: parseFloat(shop.price) || 999999,
                    image: SHOP_IMAGES[shop.name.toLowerCase()]
                }));
                setShops(formattedDefaults);
            } finally {
                setLoading(false);
            }
        };

        loadPrices();
    }, [initialData]);

    // Helper to sort and rank shops
    const getSortedShops = (list: string[]) => {
        return shops
            .filter(shop => list.includes(shop.name.toLowerCase()))
            .sort((a, b) => a.numericPrice - b.numericPrice);
    };

    const ecommerceShopsList = getSortedShops(ECOMMERCE_SHOPS);
    const parapharmacyShopsList = getSortedShops(PARAPHARMACY_SHOPS);

    // Duplicate for sliding effect
    const slidingEcommerce = ecommerceShopsList.length > 0 ? [...ecommerceShopsList, ...ecommerceShopsList, ...ecommerceShopsList] : [];
    const slidingParapharmacy = parapharmacyShopsList.length > 0 ? [...parapharmacyShopsList, ...parapharmacyShopsList, ...parapharmacyShopsList] : [];

    // Helper to render a shop card
    const renderShopCard = (shop: any, index: number, totalCount: number) => {
        const rank = (index % totalCount) + 1;

        return (
            <div key={index} className="flex flex-col gap-3 group w-[160px] shrink-0 relative">
                {rank <= 3 && <RankBadge rank={rank} />}

                <div className={`bg-white border-2 rounded-[24px] p-5 flex items-center justify-center h-32 transition-all duration-500 overflow-hidden
                    ${rank === 1 ? "border-[#FFD700]/30 shadow-xl" :
                        rank === 2 ? "border-[#C0C0C0]/30 shadow-lg" :
                            rank === 3 ? "border-[#CD7F32]/30 shadow-md" : "border-[#E5E7EB]/80"}`}>
                    {shop.image ? (
                        <img src={shop.image} alt={shop.name} className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                        <span className={`font-black text-lg md:text-xl tracking-tighter uppercase ${shop.color} transform group-hover:scale-110 transition-transform duration-500`}>
                            {shop.logo}
                        </span>
                    )}

                    {rank <= 3 && (
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none
                            ${rank === 1 ? "bg-gradient-to-br from-[#FFD700] to-transparent" :
                                rank === 2 ? "bg-gradient-to-br from-[#C0C0C0] to-transparent" :
                                    "bg-gradient-to-br from-[#CD7F32] to-transparent"}`}>
                        </div>
                    )}
                </div>

                <div className={`rounded-[18px] py-3 text-center transition-all duration-300 border
                    ${rank === 1 ? "bg-[#FFD700]/10 border-[#FFD700]/40" :
                        rank === 2 ? "bg-[#C0C0C0]/10 border-[#C0C0C0]/40" :
                            rank === 3 ? "bg-[#CD7F32]/10 border-[#CD7F32]/40" : "bg-[#EBEDF2] border-white/50"}`}>
                    <span className={`font-extrabold text-lg
                        ${rank === 1 ? "text-[#B8860B]" :
                            rank === 2 ? "text-[#808080]" :
                                rank === 3 ? "text-[#8B4513]" : "text-[#111827]"}`}>
                        {shop.price}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <section className="w-full py-12 bg-white overflow-hidden">
            {ecommerceShopsList.length > 0 && (
                <div className="mb-16">
                    <div className="max-w-7xl mx-auto px-4 mb-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="h-10 w-2 bg-[#8B5CF6] rounded-full"></div>
                            <h2 className="text-[#2563EB] font-black text-3xl sm:text-4xl text-left tracking-tight">
                                La moyenne des Prix par site <span className="text-[#8B5CF6]">E-commerce</span><span className="text-[#8B5CF6]">مُعَدَّلَ الأسعار</span>
                            </h2>
                        </div>
                        <div className="relative w-72 h-32 md:w-[350px] md:h-32 shrink-0">
                            <img
                                src="/images/Gemini_Generated_Image_cgcjk1cgcjk1cgcj 1.svg"
                                alt="Price Analysis"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>

                    <div className="relative w-full">
                        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

                        <div className="animate-marquee-container flex gap-12 whitespace-nowrap px-4">
                            {slidingEcommerce.map((shop, index) => renderShopCard(shop, index, ecommerceShopsList.length))}
                        </div>
                    </div>
                </div>
            )}

            {parapharmacyShopsList.length > 0 && (
                <div>
                    <div className="max-w-7xl mx-auto px-4 mb-10">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-2 bg-[#10B981] rounded-full"></div>
                            <h2 className="text-[#2563EB] font-black text-3xl sm:text-4xl text-left tracking-tight">
                                La moyenne des Prix par site <span className="text-[#10B981]">Parapharmacie</span><span className="text-[#8B5CF6]">مُعَدَّلَ الأسعار</span>
                            </h2>
                        </div>
                    </div>

                    <div className="relative w-full">
                        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

                        <div className="animate-marquee-container flex gap-12 whitespace-nowrap px-4">
                            {slidingParapharmacy.map((shop, index) => renderShopCard(shop, index, parapharmacyShopsList.length))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
