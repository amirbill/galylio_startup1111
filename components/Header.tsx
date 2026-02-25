'use client';

import React, { useState, MouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingDown, Pill, Search, ShoppingBag, Menu, X, Sparkles, CreditCard, LogOut, User, ShoppingCart, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBag } from '@/contexts/BagContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserMenu } from './UserMenu';
import { BagDrawer } from './BagDrawer';

interface Ripple {
    id: number;
    x: number;
    y: number;
}

interface HeaderProps {
    initialUser?: any;
}

export default function Header({ initialUser }: HeaderProps) {
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [imgError, setImgError] = useState(false);

    // const [bagDrawerOpen, setBagDrawerOpen] = useState(false); // Removed in favor of global context
    const { user: contextUser, logout } = useAuth();
    const { itemCount, isBagOpen, openBag, closeBag } = useBag();

    // Use server-provided user if available, otherwise fallback to context (client-side)
    const user = initialUser || contextUser;

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newRipple = {
            id: Date.now(),
            x,
            y
        };

        setRipples((prev) => [...prev, newRipple]);

        setTimeout(() => {
            setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
        }, 600);
    };

    const navItems = [
        {
            label: 'Électronique',
            href: '/products',
            icon: <ShoppingBag className="size-4" />,
            description: 'PC, Téléphones, Électroménager',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            label: 'Parapharmacie',
            href: '/para',
            icon: <Pill className="size-4" />,
            description: 'Soins, Hygiène, Bébé',
            color: 'text-teal-600',
            bgColor: 'bg-teal-50'
        },
        {
            label: 'Tarifs',
            href: '/pricing',
            icon: <CreditCard className="size-4" />,
            description: 'Nos offres & abonnements',
            color: 'text-amber-600',
            bgColor: 'bg-amber-50'
        },
        {
            label: 'Solutions',
            href: '/solutions',
            icon: <Sparkles className="size-4" />,
            description: 'Notre mission & services',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        }
    ];

    return (
        <>
            <header className="sticky top-3 z-50 text-slate-900 w-full max-w-5xl mx-auto px-3">
                <div className="h-16 flex ring-1 ring-slate-200/80 bg-white/90 backdrop-blur-xl rounded-2xl px-4 items-center justify-between shadow-lg shadow-slate-200/50">
                    {/* Logo */}
                    <Link href="/" className="flex gap-2 items-center group">
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
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="group relative px-4 py-2 rounded-xl hover:bg-slate-100 transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`${item.color}`}>{item.icon}</span>
                                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                                        {item.label}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        {/* Price Savings Badge */}
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
                            <TrendingDown className="size-4 text-green-600" />
                            <span className="text-xs font-bold text-green-700">Économisez jusqu&apos;à 40%</span>
                        </div>

                        {/* Bag Icon */}
                        <button
                            onClick={openBag}
                            className="relative size-10 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors border border-blue-200"
                        >
                            <ShoppingCart className="size-5 text-blue-600" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 size-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {itemCount > 9 ? '9+' : itemCount}
                                </span>
                            )}
                        </button>

                        <UserMenu initialUser={user} />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden inline-flex items-center justify-center rounded-xl p-2 hover:bg-slate-100 transition-colors"
                    >
                        {mobileMenuOpen ? (
                            <X className="size-6" />
                        ) : (
                            <Menu className="size-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-20 left-3 right-3 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 animate-in slide-in-from-top-2">
                        <nav className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 p-3 rounded-xl ${item.bgColor} transition-all`}
                                >
                                    <span className={`${item.color}`}>{item.icon}</span>
                                    <div>
                                        <span className="text-sm font-semibold text-slate-900 block">
                                            {item.label}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {item.description}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                            <div className="h-px bg-slate-100 my-2" />
                            {user ? (
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <div className="size-10 overflow-hidden rounded-full bg-slate-200 flex items-center justify-center">
                                            {!imgError ? (
                                                <Image
                                                    src="/avatar.jpg"
                                                    alt="User avatar"
                                                    width={40}
                                                    height={40}
                                                    className="size-full object-cover"
                                                    onError={() => setImgError(true)}
                                                />
                                            ) : (
                                                <User className="size-5 text-slate-500" />
                                            )}
                                        </div>
                                        <div className="flex flex-col truncate">
                                            <span className="text-sm font-bold text-slate-900 truncate">
                                                {user?.name || user?.email?.split('@')[0] || "Utilisateur"}
                                            </span>
                                            <span className="text-xs text-slate-500 truncate">
                                                {user?.email || "chargement..."}
                                            </span>
                                        </div>
                                    </div>
                                    {(user?.role === "admin" || user?.role === "superadmin") && (
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 text-purple-700 font-medium"
                                        >
                                            <LayoutDashboard className="size-4" />
                                            <span className="text-sm">Dashboard</span>
                                        </Link>
                                    )}
                                    <Link
                                        href="/profile"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-slate-700 font-medium"
                                    >
                                        <User className="size-4" />
                                        <span className="text-sm">Modifier le profil</span>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-red-50 text-red-600 w-full text-left font-bold"
                                    >
                                        <LogOut className="size-4" />
                                        <span className="text-sm">Se déconnecter</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Link
                                        href="/signin"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-center gap-3 p-3 rounded-xl bg-purple-50 text-purple-600 w-full font-semibold"
                                    >
                                        Connexion
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </header>

            {/* Bag Drawer */}
            <BagDrawer isOpen={isBagOpen} onClose={closeBag} />
        </>
    );
}

