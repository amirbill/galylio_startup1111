"use client"

import React, { useState } from "react"
import { Search, Settings, Bell, User, LogOut, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardHeaderProps {
    title: string
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
    const { user, logout } = useAuth()
    const [imgError, setImgError] = useState(false)

    return (
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>

            <div className="flex items-center gap-4">
                {/* Go to client site */}
                {(user?.role === "admin" || user?.role === "superadmin") && (
                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-full border border-border bg-background px-4 h-9 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <ExternalLink className="size-4" />
                        <span>Voir le site</span>
                    </Link>
                )}

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Rechercher"
                        className="h-9 w-48 rounded-full border border-border bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple/20"
                    />
                </div>

                {/* Settings */}
                <button className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted">
                    <Settings className="size-4" />
                </button>

                {/* Notifications */}
                <button className="relative flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted">
                    <Bell className="size-4" />
                    <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-purple text-[10px] font-medium text-purple-foreground">
                        2
                    </span>
                </button>

                {/* User Avatar with Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex size-9 overflow-hidden rounded-full bg-purple/10 ring-offset-background transition-all items-center justify-center text-purple font-bold text-sm">
                            {user?.email ? user.email.charAt(0).toUpperCase() : <User className="size-5 text-muted-foreground" />}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <div className="flex items-center gap-3 px-2 py-2">
                            <div className="size-10 overflow-hidden rounded-full bg-muted flex items-center justify-center">
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
                                    <User className="size-6 text-muted-foreground" />
                                )}
                            </div>
                            <div className="flex flex-col truncate">
                                <span className="text-sm font-medium truncate">
                                    {user?.email?.split('@')[0] || "Utilisateur"}
                                </span>
                                <span className="text-xs text-muted-foreground truncate">
                                    {user?.email || "chargement..."}
                                </span>
                            </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/parametre" className="flex w-full cursor-pointer items-center gap-2">
                                <User className="size-4" />
                                <span>Modifier le profil</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => logout()}
                            className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
                        >
                            <LogOut className="size-4" />
                            <span>Se déconnecter</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
