"use client";

import Image from "next/image";
import { LogoCarousel } from "@/components/LogoCarousel";

const RETAILERS = [
    { name: "Carrefour", logo: "/b23416c7cc5a117ca44a75a3b308465e944e13ca.png", price: "30 DT" },
    { name: "Carrefour Market", logo: "/2975c9ff2b5e14fb33cd01f16c86cef38a65630b.png", price: "31.5 DT" },
    { name: "Carrefour Express", logo: "/20bcc4f2a7eac2254c0cd16ab2fd766dd07c8817.png", price: "29.75 DT" },
    { name: "Géant", logo: "/570de29bf0c410c91e121fab36591b044a2ab1bd.png", price: "33 DT" },
    { name: "mg", logo: "/06c31b0fccec4706d27c55c3308bb6538080af2f.png", price: "30.5 DT" },
    { name: "Aziza", logo: "/020d751a34a011aa815096d3e31f4416893f2ca3.png", price: "28 DT" },
    { name: "MONOPRIX", logo: "/7d643875ed1ded1a12ba452e1ff38e37d138aa7d.png", price: "29 DT" },
];

const TITLE_CLASS = "font-black tracking-tight whitespace-nowrap text-[12px] min-[420px]:text-[14px] sm:text-lg md:text-xl lg:text-[28px] text-left leading-none";
const HEADER_ARTWORK_CLASS = "relative hidden h-16 w-24 shrink-0 sm:block md:h-20 md:w-32 lg:h-24 lg:w-42";

export function CouffinTounsiSection() {
    const retailerCards = RETAILERS.map((retailer) => (
        <div key={retailer.name} className="group relative flex w-full min-w-0 flex-col gap-3">
            <div className="flex h-28 items-center justify-center overflow-hidden rounded-[22px] border-2 border-[#E5E7EB]/80 bg-white p-4 transition-all duration-300 group-hover:shadow-lg sm:h-32 sm:p-5">
                <div className="flex h-full w-full items-center justify-center">
                    <Image
                        src={retailer.logo}
                        alt={retailer.name}
                        width={128}
                        height={64}
                        className="max-h-13 max-w-full object-contain transition-transform duration-300 group-hover:scale-105 sm:max-h-16"
                    />
                </div>
            </div>
            <div className="rounded-2xl border border-white/50 bg-[#EBEDF2] py-2 text-center transition-all duration-300">
                <span className="text-xs font-extrabold text-[#111827] sm:text-sm lg:text-base">
                    {retailer.price}
                </span>
            </div>
        </div>
    ));

    return (
        <section className="w-full bg-white py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8 flex items-start justify-between gap-6 sm:items-center sm:gap-8 lg:gap-12">
                    <div className="flex min-w-0 max-w-4xl flex-1 items-center gap-3 sm:gap-4">
                        <div className="h-8 w-2 shrink-0 rounded-full bg-[#2563EB] sm:h-10"></div>
                        <div className="flex min-w-0 flex-col">
                            <h2 className={`${TITLE_CLASS} text-[#2563EB]`}>
                                Prix moyen <span className="text-[#8B5CF6]">couffin Tounsi</span><span className="text-[#8B5CF6] ml-2">مُعَدَّلَ الأسعار</span>
                            </h2>
                            <p className="mt-2 text-xs font-medium text-gray-500 md:text-sm">
                                Tomate, poivron, huile, yaourt...
                            </p>
                        </div>
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

                <LogoCarousel
                    cards={retailerCards}
                    visibleCount={4}
                    label="couffin tounsi retailer logos"
                />
            </div>
        </section>
    );
}
