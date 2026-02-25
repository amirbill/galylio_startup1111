"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Eye, BarChart3, Settings, ShieldCheck, DatabaseZap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"

interface NavItem {
    name: string
    href: string
    icon: any
    requiredRole?: string // Only users with this role can see this item
}

const navItems: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Veille Produits & marques", href: "/dashboard/veille", icon: Eye },
    { name: "Benchmarking avancé", href: "/dashboard/benchmarking", icon: BarChart3 },
    { name: "Accessibility Control", href: "/dashboard/accessibility-control", icon: ShieldCheck, requiredRole: "superadmin" },
    { name: "Data Market", href: "/dashboard/data-market", icon: DatabaseZap },
    { name: "Paramètres", href: "/dashboard/parametre", icon: Settings },
]

export function DashboardSidebar() {
    const pathname = usePathname()
    const { user } = useAuth()
    const userRole = user?.role || "client"

    // Filter nav items based on user role
    const visibleNavItems = navItems.filter((item) => {
        if (!item.requiredRole) return true
        return userRole === item.requiredRole
    })

    return (
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-border bg-card">
            {/* Logo */}
            <div className="flex h-16 items-center gap-2 px-6">
                <div className="flex items-end gap-0.5">
                    <div className="h-8 w-1.5 rounded-full bg-primary" />
                    <div className="h-6 w-1.5 rounded-full bg-primary" />
                    <div className="h-10 w-1.5 rounded-full bg-primary" />
                    <div className="h-5 w-1.5 rounded-full bg-primary" />
                </div>
                <span className="text-lg font-semibold text-foreground">.tn</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {visibleNavItems.map((item) => {
                    const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard")
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-purple/10 text-purple"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className="size-5" />
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
