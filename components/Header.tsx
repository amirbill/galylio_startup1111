'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X, ShoppingCart, ChevronDown, Grid3X3 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useBag } from '@/contexts/BagContext'
import { API_URL } from '@/lib/api'
import { UserMenu } from './UserMenu'
import { BagDrawer } from './BagDrawer'

interface HeaderProps {
    initialUser?: any;
}

export default function Header({ initialUser }: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [retailCategories, setRetailCategories] = useState<string[]>([])
    const [paraCategories, setParaCategories] = useState<string[]>([])
    
    // Desktop dropdown states
    const [isRetailOpen, setIsRetailOpen] = useState(false)
    const [isParaOpen, setIsParaOpen] = useState(false)
    
    // Mobile accordion states
    const [isMobileRetailOpen, setIsMobileRetailOpen] = useState(true)
    const [isMobileParaOpen, setIsMobileParaOpen] = useState(false)
    
    const { user: contextUser } = useAuth()
    const { itemCount, isBagOpen, openBag, closeBag } = useBag()

    const user = initialUser || contextUser

    useEffect(() => {
        async function fetchCategories() {
            try {
                // Fetch top categories from both endpoints
                const [prodRes, paraRes] = await Promise.allSettled([
                    fetch(`${API_URL}/products/top-categories`),
                    fetch(`${API_URL}/para/categories?type=top_category`)
                ])
                
                if (prodRes.status === 'fulfilled' && prodRes.value.ok) {
                    const prodData = await prodRes.value.json()
                    setRetailCategories(Array.from(new Set(prodData)).sort() as string[])
                }
                
                if (paraRes.status === 'fulfilled' && paraRes.value.ok) {
                    const paraData = await paraRes.value.json()
                    setParaCategories(Array.from(new Set(paraData)).sort() as string[])
                }
            } catch (e) {
                console.error('Failed to fetch categories:', e)
            }
        }
        fetchCategories()
    }, [])

    const staticNavItems = [
        { label: 'Tarifs', href: '/pricing' },
        { label: 'Solutions', href: '/solutions' },
    ]

    return (
        <>
            <header className="w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-50 transition-all duration-300">
                {/* Promo Banner */}
                <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-1.5">
                    <p className="text-[12px] font-medium tracking-wide">✨ Économisez jusqu&apos;à 40% sur nos produits premium</p>
                </div>

                {/* Main Header */}
                <div className="max-w-[1600px] w-[95%] mx-auto px-2 sm:px-4 lg:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 group">
                            <Image
                                src="/images/Logo 1111.svg"
                                alt="1111.tn"
                                width={100}
                                height={32}
                                className="h-8 w-auto object-contain"
                                priority
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1.5">
                            {/* Supermarché Dropdown - Mega Menu Style */}
                            <div
                                className="relative"
                                onMouseEnter={() => setIsRetailOpen(true)}
                                onMouseLeave={() => setIsRetailOpen(false)}
                            >
                                <button className={`px-4 py-2 text-[15px] font-medium rounded-full flex items-center gap-2 transition-all duration-200 ${isRetailOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                                    <Grid3X3 size={16} />
                                    Supermarché
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${isRetailOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {isRetailOpen && retailCategories.length > 0 && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 p-6 z-50 w-[480px] animate-in fade-in slide-in-from-top-4 duration-300">
                                        <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent"></div>
                                        <div className="relative">
                                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 pl-1">
                                                Rayons Supermarché
                                            </h3>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 max-h-[60vh] overflow-y-auto pr-2">
                                                {retailCategories.map((cat) => (
                                                    <Link
                                                        key={cat}
                                                        href={`/products?category=${encodeURIComponent(cat)}&category_type=top_category`}
                                                        className="group flex items-center justify-between px-3 py-2.5 rounded-xl text-[14px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
                                                        onClick={() => setIsRetailOpen(false)}
                                                    >
                                                        <span>{cat}</span>
                                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300">&rarr;</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Parapharmacie Dropdown - Mega Menu Style */}
                            <div
                                className="relative"
                                onMouseEnter={() => setIsParaOpen(true)}
                                onMouseLeave={() => setIsParaOpen(false)}
                            >
                                <button className={`px-4 py-2 text-[15px] font-medium rounded-full flex items-center gap-2 transition-all duration-200 ${isParaOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                                    <Grid3X3 size={16} />
                                    Parapharmacie
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${isParaOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {isParaOpen && paraCategories.length > 0 && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 p-6 z-50 min-w-[320px] max-w-[600px] animate-in fade-in slide-in-from-top-4 duration-300">
                                        <div className="absolute -top-4 left-0 right-0 h-4 bg-transparent"></div>
                                        <div className="relative">
                                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4 pl-1">
                                                Univers Parapharmacie
                                            </h3>
                                            <div className={`grid gap-x-6 gap-y-1 ${paraCategories.length > 6 ? 'grid-cols-2' : 'grid-cols-1'} max-h-[60vh] overflow-y-auto pr-2`}>
                                                {paraCategories.map((cat) => (
                                                    <Link
                                                        key={cat}
                                                        href={`/para?category=${encodeURIComponent(cat)}&category_type=top_category`}
                                                        className="group flex items-center justify-between px-3 py-2.5 rounded-xl text-[14px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
                                                        onClick={() => setIsParaOpen(false)}
                                                    >
                                                        <span>{cat}</span>
                                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300">&rarr;</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Divider */}
                            <span className="w-px h-5 bg-slate-200 mx-2"></span>
                            
                            {staticNavItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="px-4 py-2 text-[15px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-full transition-all duration-200"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Actions */}
                        <div className="hidden lg:flex items-center gap-3">
                            {user ? (
                                <UserMenu initialUser={user} />
                            ) : (
                                <>
                                    <Link
                                        href="/signin"
                                        className="px-5 py-2.5 text-[15px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all duration-200"
                                    >
                                        Connexion
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="group inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-[15px] font-medium rounded-full hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 transition-all duration-200"
                                    >
                                        <span>Inscription</span>
                                        <div className="relative flex items-center justify-center size-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14"></path>
                                                <path d="m12 5 7 7-7 7"></path>
                                            </svg>
                                        </div>
                                    </Link>
                                </>
                            )}

                            <div className="w-px h-5 bg-slate-200 mx-2"></div>

                            <button
                                onClick={openBag}
                                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all duration-200 relative group"
                            >
                                <ShoppingCart size={20} />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-0.5 w-[18px] h-[18px] bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-sm">
                                        {itemCount > 9 ? '9+' : itemCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-2.5 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isOpen && (
                        <div className="lg:hidden border-t border-slate-200 py-6 animate-in slide-in-from-top-2 duration-300 h-[calc(100vh-4rem)] overflow-y-auto">
                            
                            {/* Retails Categories section */}
                            {retailCategories.length > 0 && (
                                <div className="mb-6">
                                    <button 
                                        onClick={() => setIsMobileRetailOpen(!isMobileRetailOpen)}
                                        className="w-full flex items-center justify-between px-4 mb-2"
                                    >
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] flex items-center gap-2">
                                            <Grid3X3 size={14} />
                                            Supermarché
                                        </p>
                                        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isMobileRetailOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {isMobileRetailOpen && (
                                        <div className="grid grid-cols-1 gap-1 px-3 mt-3">
                                            {retailCategories.map((cat) => (
                                                <Link
                                                    key={`retail-mob-${cat}`}
                                                    href={`/products?category=${encodeURIComponent(cat)}&category_type=top_category`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center justify-between px-4 py-3 text-[14px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all duration-200"
                                                >
                                                    <span>{cat}</span>
                                                    <span className="text-slate-300">&rarr;</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Para Categories section */}
                            {paraCategories.length > 0 && (
                                <div className="mb-6">
                                    <button 
                                        onClick={() => setIsMobileParaOpen(!isMobileParaOpen)}
                                        className="w-full flex items-center justify-between px-4 mb-2"
                                    >
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] flex items-center gap-2">
                                            <Grid3X3 size={14} />
                                            Parapharmacie
                                        </p>
                                        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isMobileParaOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {isMobileParaOpen && (
                                        <div className="grid grid-cols-1 gap-1 px-3 mt-3">
                                            {paraCategories.map((cat) => (
                                                <Link
                                                    key={`para-mob-${cat}`}
                                                    href={`/para?category=${encodeURIComponent(cat)}&category_type=top_category`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center justify-between px-4 py-3 text-[14px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all duration-200"
                                                >
                                                    <span>{cat}</span>
                                                    <span className="text-slate-300">&rarr;</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* Static Nav Items */}
                            <div className="space-y-1 px-3 mb-6 pt-4 border-t border-slate-100">
                                {staticNavItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-between px-4 py-3.5 text-[15px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all duration-200"
                                    >
                                        <span>{item.label}</span>
                                        <span className="text-slate-300">&rarr;</span>
                                    </Link>
                                ))}
                            </div>
                            {/* Auth Section */}
                            <div className="px-4 pt-4 border-t border-slate-200">
                                {user ? (
                                    <div className="bg-slate-50 rounded-2xl p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                {(user?.name || user?.email)?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">
                                                    {user?.name || user?.email?.split('@')[0] || "Utilisateur"}
                                                </p>
                                                <p className="text-xs text-slate-500">{user?.email}</p>
                                            </div>
                                        </div>
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsOpen(false)}
                                            className="block w-full px-4 py-2.5 text-center text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                                        >
                                            Modifier le profil
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <Link
                                            href="/signin"
                                            onClick={() => setIsOpen(false)}
                                            className="w-full px-6 py-3 text-center text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                                        >
                                            Connexion
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={() => setIsOpen(false)}
                                            className="group w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all"
                                        >
                                            <span>Créer un compte</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                                                <path d="M5 12h14"></path>
                                                <path d="m12 5 7 7-7 7"></path>
                                            </svg>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Bag Drawer */}
            <BagDrawer isOpen={isBagOpen} onClose={closeBag} />
        </>
    )
}


