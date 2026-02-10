import React from 'react';
import { Star, MoveUpRight } from 'lucide-react';
import Link from 'next/link';
import { SearchBar } from './SearchBar';

const HeroSection = () => {
    return (
        <section className="relative overflow-hidden p-8 md:p-16 min-h-[600px] flex items-center bg-white">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left Content */}
                <div className="flex flex-col gap-8">
                    {/* Logo */}
                    <div className="flex items-center">
                        <img 
                            src="/images/Logo 1111.svg" 
                            alt="1111.tn Logo" 
                            className="w-40 h-40 md:w-36 md:h-36"
                        />
                    </div>

                    <div className="space-y-6">
                        <span className="text-xs font-medium text-[#111827] tracking-tight">
                            Comparateur de prix intelligent
                        </span>

                        <div className="space-y-2">
                            <h2 className="text-lg md:text-xl font-bold text-[#111827] tracking-tight">
                                Les prix, en toute transparence
                            </h2>

                            <div className="flex flex-col space-y-1">
                                <span className="text-2xl md:text-4xl font-extrabold text-[#2563EB] tracking-tight">
                                    MONITORING
                                </span>
                                <span className="text-2xl md:text-4xl font-extrabold text-[#2563EB] tracking-tight">
                                    BENCHMARKING
                                </span>
                                <span className="text-2xl md:text-4xl font-extrabold text-[#2563EB] tracking-tight text-nowrap">
                                    VEILLE CONCURRENTIELLE
                                </span>
                                <span className="text-2xl md:text-4xl font-extrabold text-[#2563EB] tracking-tight">
                                    PRÉDICTION
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs text-[#111827] font-medium leading-relaxed">
                            On compare les vrais prix. On dévoile tout les mensonges.
                        </p>
                        <p className="text-xs text-[#111827] font-medium">
                            Gratuitement, pour toi.
                        </p>
                    </div>

                    {/* Keep Search Bar for functionality, placing it below the text */}
                    <div className="flex flex-col gap-6 w-full max-w-xl">
                        <SearchBar variant="hero" searchBoth={true} placeholder="Rechercher un produit (électronique, parapharmacie...)" />
                    </div>
                </div>

                {/* Right Visual Section (Blobs) */}
                <div className="relative h-[450px] md:h-[580px] w-full mt-10 lg:mt-0 flex items-center justify-center">
                    {/* Top Right Circle Blob */}
                    <div className="absolute -top-8 -right-8 size-48 md:size-64 rounded-full bg-[#A855F7] overflow-hidden border-[5px] border-white shadow-[0_15px_45px_rgba(0,0,0,0.12)] z-10 hover:scale-105 transition-transform duration-500">
                        <img
                            src="/images/2_.png"
                            alt="Visual 2"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-transparent" />
                    </div>

                    {/* Central Large Oval Blob */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 md:w-60 h-[340px] md:h-[420px] rounded-[10rem] bg-[#FFD700] overflow-hidden border-[6px] border-white shadow-[0_20px_50px_rgba(255,189,18,0.25)] z-20 hover:scale-[1.02] transition-transform duration-500">
                        <img
                            src="/images/1_.png"
                            alt="Visual 1"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#FFBD12]/40 to-transparent" />
                    </div>

                    {/* Bottom Right Arch Blob */}
                    <div className="absolute -bottom-10 -right-6 w-40 md:size-68 rounded-t-[8rem] rounded-b-[1.5rem] bg-[#F97316] overflow-hidden border-[5px] border-white shadow-[0_15px_40px_rgba(0,0,0,0.12)] z-10 hover:scale-105 transition-transform duration-500">
                        <img
                            src="/images/3_.png"
                            alt="Visual 3"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-orange/40 to-transparent" />
                    </div>
                </div>
            </div>
        </section>
    );
};


export default HeroSection;
