"use client";

import Image from "next/image";

const RETAILERS = [
    { name: "Carrefour", logo: "/b23416c7cc5a117ca44a75a3b308465e944e13ca.png", price: "30 DT" },
    { name: "Carrefour Market", logo: "/2975c9ff2b5e14fb33cd01f16c86cef38a65630b.png", price: "31.5 DT" },
    { name: "Carrefour Express", logo: "/20bcc4f2a7eac2254c0cd16ab2fd766dd07c8817.png", price: "29.75 DT" },
    { name: "Géant", logo: "/570de29bf0c410c91e121fab36591b044a2ab1bd.png", price: "33 DT" },
    { name: "mg", logo: "/06c31b0fccec4706d27c55c3308bb6538080af2f.png", price: "30.5 DT" },
    { name: "Aziza", logo: "/020d751a34a011aa815096d3e31f4416893f2ca3.png", price: "28 DT" },
    { name: "MONOPRIX", logo: "/7d643875ed1ded1a12ba452e1ff38e37d138aa7d.png", price: "29 DT" },
];

export function CouffinTounsiSection() {
    // Triple the retailers for seamless marquee effect
    const marqueeRetailers = [...RETAILERS, ...RETAILERS, ...RETAILERS];

    return (
        <section className="w-full py-16 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header Section matching PriceCards */}
                <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="h-10 w-2 bg-[#2563EB] rounded-full"></div>
                        <div className="flex flex-col">
                            <h2 className="text-[#2563EB] font-black text-xl sm:text-2xl md:text-3xl text-left tracking-tight whitespace-nowrap">
                                Prix moyen <span className="text-[#8B5CF6]">couffin Tounsi</span><span className="text-[#8B5CF6] ml-2">مُعَدَّلَ الأسعار</span>
                            </h2>
                            <p className="text-gray-500 text-xs md:text-sm font-medium mt-1">
                                Tomate , poivron , huile , yaourt ...
                            </p>
                        </div>
                    </div>
                    <div className="relative w-48 h-24 md:w-[350px] md:h-32 shrink-0 hidden sm:block">
                        <img
                            src="/images/Gemini_Generated_Image_cgcjk1cgcjk1cgcj 1.svg"
                            alt="Price Analysis"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* Marquee Container with Gradient Overlays */}
                <div className="relative w-full">
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

                    <div className="animate-marquee-container flex gap-10 whitespace-nowrap">
                        {marqueeRetailers.map((retailer, index) => (
                            <div key={index} className="flex flex-col gap-2.5 group w-[145px] shrink-0 relative">
                                <div className="bg-white border-2 border-[#E5E7EB]/80 rounded-[22px] p-4 flex items-center justify-center h-28 transition-all duration-500 overflow-hidden group-hover:shadow-lg">
                                    <div className="relative w-full h-full">
                                        <img
                                            src={retailer.logo}
                                            alt={retailer.name}
                                            className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                                <div className="bg-[#EBEDF2] border border-white/50 rounded-[16px] py-2 text-center transition-all duration-300">
                                    <span className="font-extrabold text-base text-[#111827]">
                                        {retailer.price}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
