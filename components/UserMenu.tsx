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
            <div className="flex items-center gap-2">
                <Link
                    href="/signin"
                    className="relative inline-flex h-9 cursor-pointer outline-none overflow-hidden transition-all duration-300 ease-out text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-teal-500 rounded-lg px-4 shadow-sm items-center justify-center hover:scale-105"
                >
                    <span className="relative z-10">Connexion</span>
                </Link>
                <Link
                    href="/signup"
                    className="relative inline-flex h-9 cursor-pointer outline-none overflow-hidden transition-all duration-300 ease-out text-sm font-semibold text-purple-600 bg-white border border-purple-100 rounded-lg px-4 shadow-sm items-center justify-center hover:bg-purple-50"
                >
                    <span className="relative z-10">Inscription</span>
                </Link>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex size-10 overflow-hidden rounded-full bg-slate-100 ring-offset-white transition-all hover:ring-2 hover:ring-purple-500/50 hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 items-center justify-center border border-slate-200 shadow-sm">
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
