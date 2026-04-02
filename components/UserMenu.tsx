"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { LogOut, User, LayoutDashboard } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserMenuProps {
    initialUser?: any;
}

export function UserMenu({ initialUser }: UserMenuProps) {
    const { user: contextUser, logout } = useAuth()
    const user = initialUser || contextUser;
    const [imgError, setImgError] = useState(false)

    if (!user) {
        return (
            <div className="flex items-center gap-3">
                <Link
                    href="/signin"
                    className="group inline-flex items-center gap-2 hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-full py-2 px-5 shadow-sm hover:shadow"
                >
                    <span>Connexion</span>
                </Link>
                <Link
                    href="/signup"
                    className="group inline-flex items-center gap-2 hover:bg-[#0056b3] hover:shadow-lg hover:shadow-[#0066FF]/20 transition-all duration-300 transform hover:scale-105 text-sm font-bold text-white bg-[#0066FF] rounded-full py-2 px-5 shadow-md shadow-[#0066FF]/10"
                >
                    <span>Inscription</span>
                    <div className="relative flex items-center justify-center size-5 bg-white/20 rounded-full group-hover:bg-white/30 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                        </svg>
                    </div>
                </Link>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex size-10 overflow-hidden rounded-full bg-slate-100 ring-offset-white transition-all hover:ring-2 hover:ring-blue-500/50 hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 items-center justify-center border border-slate-200 shadow-sm">
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
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border-slate-200 shadow-xl bg-white">
                    <div className="flex items-center gap-3 px-2 py-3">
                        <div className="size-12 overflow-hidden rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                            {!imgError ? (
                                <Image
                                    src="/avatar.jpg"
                                    alt="User avatar"
                                    width={48}
                                    height={48}
                                    className="size-full object-cover"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <User className="size-6 text-slate-500" />
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
                    <DropdownMenuSeparator className="bg-slate-100 my-1" />
                    {(user?.role === "admin" || user?.role === "superadmin") && (
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard" className="flex w-full cursor-pointer items-center gap-3 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors">
                                <LayoutDashboard className="size-4" />
                                <span className="text-sm font-medium">Dashboard</span>
                            </Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex w-full cursor-pointer items-center gap-3 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors">
                            <User className="size-4" />
                            <span className="text-sm font-medium">Modifier le profil</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-100 my-1" />
                    <DropdownMenuItem
                        onClick={() => logout()}
                        className="flex cursor-pointer items-center gap-3 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 focus:bg-red-50 transition-colors"
                    >
                        <LogOut className="size-4" />
                        <span className="text-sm font-bold">Se déconnecter</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
