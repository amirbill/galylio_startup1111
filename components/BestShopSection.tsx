'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Check, ShoppingCart, Filter, X } from 'lucide-react';
import { useBag, BagItem } from '@/contexts/BagContext';
import { searchProductsAction } from '@/app/actions';
import Link from 'next/link';
import { SHOP_CONFIG } from '@/lib/shops';

interface SearchResult {
    id?: string;
    sku?: string;
    name?: string;
    title?: string;
    image?: string;
    bestPrice?: number;
    price?: number;
    source: 'para' | 'retail';
}

export function BestShopSection() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showShopSelector, setShowShopSelector] = useState(false);
    const [selectedShop, setSelectedShop] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const shopSelectorRef = useRef<HTMLDivElement>(null);
    const { addItem, isInBag, openBag } = useBag();

    // Handle search
    useEffect(() => {
        // If query is too short, clear results
        if (query.length < 2) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                // Pass selectedShop to the action (undefined if null)
                const data = await searchProductsAction(query, 8, selectedShop || undefined);
                setResults(data);
                setShowDropdown(true);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, selectedShop]); // Trigger search when query OR selectedShop changes

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
            if (shopSelectorRef.current && !shopSelectorRef.current.contains(event.target as Node)) {
                setShowShopSelector(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddToBag = (result: SearchResult) => {
        const item: BagItem = {
            sku: result.sku || result.id || '',
            source: result.source,
            title: result.title || result.name || 'Unknown Product',
            image: result.image || '/placeholder.svg',
            price: result.bestPrice || result.price || 0,
        };
        addItem(item);
    };

    const getSku = (result: SearchResult) => result.sku || result.id || '';

    return (
        <section className="w-full bg-gradient-to-b from-blue-50/50 to-white py-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Container */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                    <h2 className="text-2xl md:text-4xl font-black text-[#2563EB] text-center md:text-left flex-1">
                        Le meilleur magasin pour vos courses
                    </h2>
                    <div className="relative w-64 h-28 md:w-[400px] md:h-40 shrink-0">
                        <img
                            src="/images/Gemini_Generated_Image_ogh7ciogh7ciogh7 1.svg"
                            alt="Shopping Experience"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* Search Container */}
                <div ref={containerRef} className="relative z-50">
                    <div className="flex gap-3">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={selectedShop ? `Rechercher chez ${SHOP_CONFIG[selectedShop]?.name || selectedShop}...` : "Rechercher un produit..."}
                                className={`w-full h-14 pl-6 pr-14 rounded-full border-2 bg-white shadow-lg focus:outline-none focus:ring-4 transition-all text-slate-700 placeholder:text-slate-400 ${selectedShop
                                    ? 'border-blue-300 shadow-blue-100/50 focus:border-blue-500 focus:ring-blue-100'
                                    : 'border-blue-100 shadow-blue-100/50 focus:border-blue-300 focus:ring-blue-100'
                                    }`}
                            />
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 size-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                                disabled={isLoading}
                            >
                                <Search className="size-5" />
                            </button>
                        </div>

                        {/* Shop Filter Button */}
                        <div className="relative" ref={shopSelectorRef}>
                            <button
                                onClick={() => setShowShopSelector(!showShopSelector)}
                                className={`size-14 rounded-full border-2 flex items-center justify-center shadow-lg transition-all ${selectedShop
                                    ? 'bg-blue-50 border-blue-200 text-[#2563EB] shadow-blue-100'
                                    : 'bg-white border-blue-100 text-slate-400 hover:border-blue-200 hover:text-[#2563EB]'
                                    }`}
                                title="Filtrer par boutique"
                            >
                                <Filter className="size-6" />
                                {selectedShop && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
                                    </span>
                                )}
                            </button>

                            {/* Shop Selector Dropdown */}
                            {showShopSelector && (
                                <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-bold text-slate-700">Filtrer par boutique</span>
                                        {selectedShop && (
                                            <button
                                                onClick={() => { setSelectedShop(null); setShowShopSelector(false); }}
                                                className="text-xs font-semibold text-red-500 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                                            >
                                                Effacer
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(SHOP_CONFIG).map(([key, config]) => (
                                            <button
                                                key={key}
                                                onClick={() => { setSelectedShop(key); setShowShopSelector(false); }}
                                                className={`p-2 rounded-xl border-2 text-center transition-all flex flex-col items-center gap-2 hover:bg-slate-50 ${selectedShop === key
                                                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 ring-offset-1'
                                                    : 'border-slate-100 hover:border-blue-200'
                                                    }`}
                                            >
                                                {config.image ? (
                                                    <div className="h-8 w-full flex items-center justify-center">
                                                        <img
                                                            src={config.image}
                                                            alt={config.name}
                                                            className="h-full w-auto object-contain max-w-full"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className={`size-8 rounded-full ${config.color} flex items-center justify-center text-white text-xs font-bold`}>
                                                        {config.name.charAt(0)}
                                                    </div>
                                                )}
                                                <span className="text-[10px] font-bold text-slate-600 truncate w-full">
                                                    {config.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Search Results Dropdown */}
                    {showDropdown && results.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[400px] overflow-y-auto">
                            {results.map((result, index) => {
                                const sku = getSku(result);
                                const inBag = isInBag(sku);

                                return (
                                    <div
                                        key={sku || index}
                                        className="flex items-center gap-4 p-4 hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors"
                                    >
                                        {/* Product Image */}
                                        <div className="size-16 rounded-xl bg-white border border-slate-100 overflow-hidden flex-shrink-0 p-1">
                                            <img
                                                src={result.image || '/placeholder.svg'}
                                                alt={result.title || result.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-slate-800 line-clamp-2">
                                                {result.title || result.name}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-sm font-bold text-[#2563EB]">
                                                    {(result.bestPrice || result.price || 0).toFixed(3)} DT
                                                </p>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${result.source === 'para'
                                                    ? 'bg-teal-50 text-teal-600 border border-teal-100'
                                                    : 'bg-purple-50 text-purple-600 border border-purple-100'
                                                    }`}>
                                                    {result.source === 'para' ? 'Parapharmacie' : 'Électronique'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Add Button */}
                                        <button
                                            onClick={() => handleAddToBag(result)}
                                            disabled={inBag}
                                            className={`flex-shrink-0 size-10 rounded-full flex items-center justify-center transition-all ${inBag
                                                ? 'bg-green-100 text-green-600 cursor-default'
                                                : 'bg-[#2563EB] text-white hover:bg-blue-700 hover:scale-105 active:scale-95'
                                                }`}
                                        >
                                            {inBag ? <Check className="size-5" /> : <Plus className="size-5" />}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* No Results State */}
                    {showDropdown && results.length === 0 && !isLoading && query.length >= 2 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-6 text-center">
                            <p className="text-slate-500 font-medium">Aucun produit trouvé</p>
                            {selectedShop && (
                                <p className="text-xs text-slate-400 mt-1">
                                    Essayez de désactiver le filtre boutique
                                </p>
                            )}
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex items-center justify-center">
                            <div className="size-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>

                {/* Access Bag Button */}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={openBag}
                        className="flex items-center gap-2 text-[#2563EB] hover:text-blue-700 font-medium text-sm transition-colors group"
                    >
                        Accéder à mon panier
                        <ShoppingCart className="size-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </section>
    );
}
