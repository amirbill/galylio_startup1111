'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Send, ShoppingBag, Pill, CreditCard, Sparkles, TrendingDown } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full">
            <div className="relative overflow-hidden border-t border-slate-200 text-slate-900 bg-white">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-transparent to-red-50/30"></div>

                <div className="relative max-w-[1440px] mx-auto sm:px-10 lg:px-14 lg:py-16 pt-12 pr-6 pb-12 pl-6">
                    {/* Top */}
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-10">
                        {/* Brand Section */}
                        <div className="max-w-md">
                            <Link href="/" className="inline-flex items-center gap-3">
                                <Image
                                    src="/images/Logo 1111.svg"
                                    alt="1111.tn"
                                    width={120}
                                    height={48}
                                    className="h-12 w-auto object-contain"
                                />
                            </Link>
                            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                                <strong className="text-red-600">1111.tn</strong> - La première plateforme tunisienne de comparaison de prix.
                                Comparez les prix de l&apos;électronique, électroménager et parapharmacie parmi les meilleures boutiques en Tunisie.
                            </p>

                            {/* Stats */}
                            <div className="mt-6 flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <TrendingDown className="size-5 text-green-600" />
                                    <div>
                                        <p className="text-lg font-bold text-slate-900">40%</p>
                                        <p className="text-xs text-slate-500">D&apos;économie</p>
                                    </div>
                                </div>
                                <div className="h-8 w-px bg-slate-200" />
                                <div>
                                    <p className="text-lg font-bold text-slate-900">50K+</p>
                                    <p className="text-xs text-slate-500">Produits</p>
                                </div>
                                <div className="h-8 w-px bg-slate-200" />
                                <div>
                                    <p className="text-lg font-bold text-slate-900">10+</p>
                                    <p className="text-xs text-slate-500">Boutiques</p>
                                </div>
                            </div>

                            {/* Newsletter */}
                            <form className="mt-6 flex items-center gap-2">
                                <div className="flex-1">
                                    <label htmlFor="nl-email" className="sr-only">Email</label>
                                    <input
                                        id="nl-email"
                                        type="email"
                                        required
                                        placeholder="Votre email"
                                        className="w-full rounded-full bg-slate-100 text-slate-900 placeholder-slate-400 px-4 py-3 text-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-red-300 outline-none"
                                    />
                                </div>
                                <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-red-600 text-white px-4 py-3 text-sm ring-1 ring-red-500 hover:bg-red-700 transition">
                                    S&apos;abonner
                                    <Send className="h-4 w-4" />
                                </button>
                            </form>
                            <p className="mt-2 text-xs text-slate-500">Recevez les meilleures offres. Pas de spam.</p>
                        </div>

                        {/* Links */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-8 w-full lg:w-auto">
                            <div>
                                <p className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                    <ShoppingBag className="size-4 text-purple-600" />
                                    Catégories
                                </p>
                                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                                    <li><Link href="/products?category=PC%20de%20Bureau&type=subcategory" className="hover:text-red-600 transition-colors">Ordinateurs</Link></li>
                                    <li><Link href="/products?category=Pc%20Portable&type=subcategory" className="hover:text-red-600 transition-colors">Laptops</Link></li>
                                    <li><Link href="/products?category=Refrigerateur&type=subcategory" className="hover:text-red-600 transition-colors">Électroménager</Link></li>
                                    <li><Link href="/products?category=Imprimante&type=low_category" className="hover:text-red-600 transition-colors">Imprimantes</Link></li>
                                </ul>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                    <Pill className="size-4 text-teal-600" />
                                    Parapharmacie
                                </p>
                                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                                    <li><Link href="/para?category=Maman%20et%20bébé&type=top" className="hover:text-red-600 transition-colors">Maman & Bébé</Link></li>
                                    <li><Link href="/para?category=Hygiène&type=top" className="hover:text-red-600 transition-colors">Hygiène</Link></li>
                                    <li><Link href="/para?category=Solaire&type=top" className="hover:text-red-600 transition-colors">Solaire</Link></li>
                                    <li><Link href="/para?category=Visage&type=low" className="hover:text-red-600 transition-colors">Soins Visage</Link></li>
                                </ul>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                    <Sparkles className="size-4 text-orange-600" />
                                    Entreprise
                                </p>
                                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                                    <li><Link href="/solutions" className="hover:text-red-600 transition-colors">À propos</Link></li>
                                    <li><Link href="/pricing" className="hover:text-red-600 transition-colors">Tarifs</Link></li>
                                    <li><Link href="/dashboard" className="hover:text-red-600 transition-colors">Dashboard</Link></li>
                                    <li><a href="mailto:contact@111.tn" className="hover:text-red-600 transition-colors">Contact</a></li>
                                </ul>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                    <CreditCard className="size-4 text-amber-600" />
                                    Boutiques
                                </p>
                                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                                    <li><a href="https://mytek.tn" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">Mytek</a></li>
                                    <li><a href="https://spacenet.tn" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">Spacenet</a></li>
                                    <li><a href="https://tunisianet.com.tn" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">Tunisianet</a></li>
                                    <li><a href="https://technopro.tn" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">TechnoPro</a></li>
                                    <li><a href="https://darty.tn" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">Darty</a></li>
                                    <li><a href="https://parashop.tn" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">Parashop</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
                            <a href="mailto:contact@111.tn" className="flex items-center gap-2 hover:text-red-600 transition-colors">
                                <Mail className="size-4" />
                                contact@111.tn
                            </a>
                            <a href="tel:+21612345678" className="flex items-center gap-2 hover:text-red-600 transition-colors">
                                <Phone className="size-4" />
                                +216 12 345 678
                            </a>
                            <span className="flex items-center gap-2">
                                <MapPin className="size-4" />
                                Tunis, Tunisie
                            </span>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-slate-500">© 2026 111.tn - Tous droits réservés. Fait avec ❤️ en Tunisie</p>
                        <div className="flex items-center gap-2">
                            <a href="https://facebook.com/111tn" target="_blank" rel="noopener noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-200 hover:bg-red-50 hover:ring-red-200 transition-colors">
                                <Facebook className="h-4 w-4 text-slate-700" />
                            </a>
                            <a href="https://instagram.com/111tn" target="_blank" rel="noopener noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-200 hover:bg-red-50 hover:ring-red-200 transition-colors">
                                <Instagram className="h-4 w-4 text-slate-700" />
                            </a>
                            <a href="https://linkedin.com/company/111tn" target="_blank" rel="noopener noreferrer" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-200 hover:bg-red-50 hover:ring-red-200 transition-colors">
                                <Linkedin className="h-4 w-4 text-slate-700" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
