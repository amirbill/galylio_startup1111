'use client';

import React, { useState, useEffect } from 'react';
import { X, Trash2, ShoppingCart, Store, Crown, Loader2, Pill, Monitor } from 'lucide-react';
import { useBag } from '@/contexts/BagContext';
import { calculateBestShopAction } from '@/app/actions';

import { SHOP_CONFIG } from '@/lib/shops';

interface ShopTotal {
    shop: string;
    total: number;
    available_count: number;
    missing_count: number;
}

interface CategoryResult {
    category: string;
    category_label: string;
    best_shop: string | null;
    best_total: number | null;
    shop_totals: ShopTotal[];
}

interface BestShopResult {
    para_result: CategoryResult | null;
    retail_result: CategoryResult | null;
}

interface BagDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BagDrawer({ isOpen, onClose }: BagDrawerProps) {
    const { items, removeItem, clearBag } = useBag();
    const [result, setResult] = useState<BestShopResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Calculate best shop when items change
    useEffect(() => {
        async function calculate() {
            if (items.length === 0) {
                setResult(null);
                return;
            }

            setIsLoading(true);
            try {
                const data = await calculateBestShopAction(
                    items.map((item) => ({ sku: item.sku, source: item.source }))
                );
                setResult(data);
            } catch (error) {
                console.error('Error calculating best shop:', error);
            } finally {
                setIsLoading(false);
            }
        }

        if (isOpen) {
            calculate();
        }
    }, [items, isOpen]);

    if (!isOpen) return null;

    const formatPrice = (price: number) => `${price.toFixed(3)} DT`;

    const renderCategorySection = (categoryResult: CategoryResult, icon: React.ReactNode, bgColor: string) => {
        return (
            <div className={`rounded-xl border border-slate-200 overflow-hidden mb-4`}>
                {/* Category Header */}
                <div className={`${bgColor} p-3 flex items-center gap-2`}>
                    {icon}
                    <h4 className="text-sm font-bold text-white">{categoryResult.category_label}</h4>
                </div>

                {/* Shop Cards */}
                <div className="p-3 bg-white">
                    {categoryResult.shop_totals.length > 0 ? (
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {categoryResult.shop_totals
                                .filter((st) => st.available_count > 0)
                                .sort((a, b) => a.total - b.total)
                                .map((shopTotal) => {
                                    const config = SHOP_CONFIG[shopTotal.shop.toLowerCase()] || {
                                        name: shopTotal.shop,
                                        color: 'bg-gray-500',
                                    };
                                    const isBest = shopTotal.shop === categoryResult.best_shop;

                                    return (
                                        <div
                                            key={shopTotal.shop}
                                            className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl border-2 min-w-[90px] transition-all ${isBest
                                                ? 'border-yellow-400 bg-yellow-50 shadow-lg'
                                                : 'border-slate-200 bg-white'
                                                }`}
                                        >
                                            {isBest && (
                                                <Crown className="size-4 text-yellow-500 mb-1" />
                                            )}
                                            {config.image ? (
                                                <img
                                                    src={config.image}
                                                    alt={config.name}
                                                    className="h-8 w-auto object-contain mb-2"
                                                />
                                            ) : (
                                                <div
                                                    className={`size-8 rounded-full ${config.color} flex items-center justify-center text-white text-xs font-bold mb-2`}
                                                >
                                                    {config.name.charAt(0)}
                                                </div>
                                            )}
                                            <span
                                                className={`text-sm font-bold ${isBest ? 'text-yellow-600' : 'text-slate-700'
                                                    }`}
                                            >
                                                {formatPrice(shopTotal.total)}
                                            </span>
                                            {shopTotal.missing_count > 0 && (
                                                <span className="text-[10px] text-red-500 mt-1">
                                                    {shopTotal.missing_count} manquant(s)
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 text-center py-2">
                            Aucune donnée de prix disponible
                        </p>
                    )}

                    {/* Best Choice for this category */}
                    {categoryResult.best_shop && (
                        <div className="mt-3 p-2 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg border border-yellow-300">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-amber-800">
                                    Meilleur choix: {SHOP_CONFIG[categoryResult.best_shop.toLowerCase()]?.name || categoryResult.best_shop}
                                </span>
                                <span className="text-sm font-black text-amber-700">
                                    {categoryResult.best_total ? formatPrice(categoryResult.best_total) : '-'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <h2 className="text-xl font-black text-[#2563EB] flex items-center gap-2">
                        <ShoppingCart className="size-5" />
                        Panier
                    </h2>
                    <button
                        onClick={onClose}
                        className="size-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                    >
                        <X className="size-5 text-slate-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShoppingCart className="size-16 text-slate-300 mb-4" />
                            <p className="text-slate-500">Votre panier est vide</p>
                            <p className="text-sm text-slate-400 mt-1">
                                Recherchez des produits pour les ajouter
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item) => (
                                <div
                                    key={item.sku}
                                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                                >
                                    {/* Image */}
                                    <div className="size-16 rounded-lg bg-white overflow-hidden flex-shrink-0 border border-slate-200">
                                        <img
                                            src={item.image || '/placeholder.svg'}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-slate-800 line-clamp-2">
                                            {item.title}
                                        </h4>
                                        <p className="text-sm font-bold text-[#2563EB] mt-1">
                                            {formatPrice(item.price)}
                                        </p>
                                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full mt-1 ${item.source === 'para'
                                            ? 'bg-teal-100 text-teal-600'
                                            : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            {item.source === 'para' ? 'Parapharmacie' : 'Électronique'}
                                        </span>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeItem(item.sku)}
                                        className="size-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Shop Comparison */}
                {items.length > 0 && (
                    <div className="border-t border-slate-200 p-4 bg-slate-50 max-h-[50%] overflow-y-auto">
                        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Store className="size-4" />
                            Prix dans chaque point de vente
                        </h3>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="size-6 text-blue-500 animate-spin" />
                            </div>
                        ) : result ? (
                            <div>
                                {/* Para Section */}
                                {result.para_result && result.para_result.shop_totals.length > 0 && (
                                    renderCategorySection(
                                        result.para_result,
                                        <Pill className="size-4 text-white" />,
                                        'bg-teal-500'
                                    )
                                )}

                                {/* Retail Section */}
                                {result.retail_result && result.retail_result.shop_totals.length > 0 && (
                                    renderCategorySection(
                                        result.retail_result,
                                        <Monitor className="size-4 text-white" />,
                                        'bg-blue-500'
                                    )
                                )}

                                {/* Show message if no data */}
                                {(!result.para_result || result.para_result.shop_totals.length === 0) &&
                                    (!result.retail_result || result.retail_result.shop_totals.length === 0) && (
                                        <p className="text-sm text-slate-500 text-center py-4">
                                            Aucune donnée de prix disponible
                                        </p>
                                    )}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 text-center py-4">
                                Aucune donnée de prix disponible
                            </p>
                        )}

                        {/* Clear Bag Button */}
                        <button
                            onClick={clearBag}
                            className="w-full mt-4 py-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
                        >
                            Vider le panier
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
