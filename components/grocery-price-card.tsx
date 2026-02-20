"use client";

import React from "react"

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProductFallbackImage } from "@/lib/product-fallback-image";

interface StorePrice {
    store: "carrefour" | "mg" | "geant";
    price: string;
    isBestPrice?: boolean;
}

interface GroceryPriceCardProps {
    name: string;
    image: string;
    prices: StorePrice[];
}

const storeLogos: Record<string, { name: string; bgColor: string; textColor: string; logo: React.ReactNode }> = {
    carrefour: {
        name: "Carrefour",
        bgColor: "bg-blue-600",
        textColor: "text-white",
        logo: (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6z" />
            </svg>
        ),
    },
    mg: {
        name: "MG",
        bgColor: "bg-amber-500",
        textColor: "text-white",
        logo: (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
            </svg>
        ),
    },
    geant: {
        name: "Géant",
        bgColor: "bg-green-600",
        textColor: "text-white",
        logo: (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
        ),
    },
};

export function GroceryPriceCard({ name, image, prices }: GroceryPriceCardProps) {
    return (
        <Link
            href="/products/1"
            className="bg-white rounded-[2rem] p-5 shadow-[0_4px_25px_rgb(0,0,0,0.05)] border border-gray-100 flex flex-col w-full min-w-[240px] transition-all hover:shadow-lg group"
        >
            {/* Product Image Container */}
            <div className="bg-white rounded-[1.5rem] aspect-square flex items-center justify-center mb-4 p-3 border border-gray-100 shadow-sm relative overflow-hidden">
                <img
                    src={image || getProductFallbackImage(name)}
                    alt={name}
                    className="object-contain max-h-full max-w-full drop-shadow-md transition-transform group-hover:scale-110 duration-500"
                />
            </div>

            {/* Product Name */}
            <h3 className="text-[#111827] font-bold text-base mb-5 px-1">{name}</h3>

            {/* Price Rows */}
            <div className="flex flex-col gap-3">
                {prices.map((priceItem, index) => {
                    const store = storeLogos[priceItem.store];
                    return (
                        <div
                            key={index}
                            className={`relative flex items-center justify-between rounded-full px-3 py-2.5 transition-all ${priceItem.isBestPrice
                                ? "bg-white border-2 border-[#22C55E] shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                                : "bg-white border border-gray-200"
                                }`}
                        >
                            {/* Best Price Badge */}
                            {priceItem.isBestPrice && (
                                <div className="absolute -top-3 right-5 bg-[#22C55E] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm z-10 uppercase tracking-tighter">
                                    Meilleur prix
                                </div>
                            )}

                            <div className="flex items-center gap-2.5">
                                {/* Store Logo Circle */}
                                <div
                                    className={`w-8 h-8 rounded-full ${store.bgColor} ${store.textColor} flex items-center justify-center shadow-inner overflow-hidden border border-white/20`}
                                >
                                    <span className="text-[11px] font-black uppercase">
                                        {priceItem.store === "carrefour" && "C"}
                                        {priceItem.store === "mg" && "M"}
                                        {priceItem.store === "geant" && "G"}
                                    </span>
                                </div>
                                {/* Price Label */}
                                <span className="text-xs font-black text-[#111827] tracking-tight">
                                    {priceItem.price}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-500 font-bold whitespace-nowrap opacity-60">
                                    Voir l'offre
                                </span>
                                <button className="w-5 h-5 rounded-full bg-[#F97316] text-white flex items-center justify-center hover:bg-[#EA580C] transition-all shadow-md active:scale-90 shrink-0">
                                    <ArrowRight className="w-3 h-3 stroke-[3]" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Link>
    );
}
