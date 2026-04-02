'use client'

import { useState } from 'react'
import { Menu, X, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useBag } from '@/contexts/BagContext'
import { UserMenu } from './UserMenu'
import { BagDrawer } from './BagDrawer'

interface HeaderProps {
    initialUser?: any;
}

export default function Header({ initialUser }: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false)
    const { user: contextUser } = useAuth()
    const { itemCount, isBagOpen, openBag, closeBag } = useBag()

    const user = initialUser || contextUser

    const navItems = [
        { label: 'Électronique', href: '/products' },
        { label: 'Parapharmacie', href: '/para' },
        { label: 'Tarifs', href: '/pricing' },
        { label: 'Solutions', href: '/solutions' },
    ]

    return (
        <>
            <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm [--accent:var(--blue-50)] [--accent-foreground:var(--blue-700)]">
                {/* Promo Banner */}
                <div className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center py-2.5">
                    <p className="text-sm font-medium tracking-wide">✨ Économisez jusqu&apos;à 40% sur nos produits premium</p>
                </div>

                {/* Main Header */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 group">
                            <Image
                                src="/images/Logo 1111.svg"
                                alt="1111.tn"
                                width={120}
                                height={40}
                                className="h-10 w-auto object-contain"
                                priority
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200 relative group"
                                >
                                    {item.label}
                                    <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            ))}
                        </nav>

                        {/* Right Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            {user ? (
                                <UserMenu initialUser={user} />
                            ) : (
                                <>
                                    <Link
                                        href="/signin"
                                        className="px-6 py-2.5 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200"
                                    >
                                        Connexion
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="group inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-200"
                                    >
                                        <span>Inscription</span>
                                        <div className="relative flex items-center justify-center size-5 bg-white/20 rounded-full group-hover:bg-white/30 transition-all duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5">
                                                <path d="M5 12h14"></path>
                                                <path d="m12 5 7 7-7 7"></path>
                                            </svg>
                                        </div>
                                    </Link>
                                </>
                            )}

                            <button
                                onClick={openBag}
                                className="p-2 text-slate-700 hover:text-blue-600 transition-colors relative group"
                            >
                                <ShoppingCart size={20} />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                                        {itemCount > 9 ? '9+' : itemCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 text-slate-700 hover:text-blue-600"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isOpen && (
                        <div className="md:hidden border-t border-slate-200 py-4 space-y-4 animate-in slide-in-from-top-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <div className="flex flex-col gap-3 px-4 pt-2 border-t border-slate-200">
                                {user ? (
                                    <div className="flex flex-col gap-3">
                                        <span className="text-sm font-bold text-slate-900 border-b pb-2">
                                            {user?.name || user?.email?.split('@')[0] || "Utilisateur"}
                                        </span>
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsOpen(false)}
                                            className="text-sm font-medium text-slate-700 hover:text-blue-600"
                                        >
                                            Modifier le profil
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        <Link
                                            href="/signin"
                                            onClick={() => setIsOpen(false)}
                                            className="px-4 py-2.5 text-center text-sm font-medium text-slate-700 border border-slate-300 rounded-full hover:bg-slate-50 transition-colors"
                                        >
                                            Connexion
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={() => setIsOpen(false)}
                                            className="group flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:shadow-lg transition-all"
                                        >
                                            <span>Inscription</span>
                                            <div className="relative flex items-center justify-center size-5 bg-white/20 rounded-full group-hover:bg-white/30 transition-all duration-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5">
                                                    <path d="M5 12h14"></path>
                                                    <path d="m12 5 7 7-7 7"></path>
                                                </svg>
                                            </div>
                                        </Link>
                                    </>
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


