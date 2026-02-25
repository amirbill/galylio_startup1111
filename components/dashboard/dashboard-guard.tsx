"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface DashboardGuardProps {
    children: React.ReactNode
}

export function DashboardGuard({ children }: DashboardGuardProps) {
    const { user, loading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (loading) return

        const role = user?.role

        // Only admin and superadmin can access the dashboard
        if (!role || role === "client") {
            router.push("/")
            return
        }

        // Only superadmin can access the accessibility-control page
        if (pathname.startsWith("/dashboard/accessibility-control") && role !== "superadmin") {
            router.push("/dashboard")
            return
        }
    }, [user, loading, pathname, router])

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    const role = user?.role

    // Don't render anything while redirecting
    if (!role || role === "client") {
        return null
    }

    if (pathname.startsWith("/dashboard/accessibility-control") && role !== "superadmin") {
        return null
    }

    return <>{children}</>
}
