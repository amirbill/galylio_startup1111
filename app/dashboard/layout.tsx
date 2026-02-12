import type { Metadata } from "next"
import React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export const metadata: Metadata = {
    title: "Tableau de Bord",
    description: "Votre tableau de bord 1111.tn — Suivez vos prix, benchmarking et veille tarifaire.",
    robots: { index: false, follow: false },
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background">
            <DashboardSidebar />
            <div className="pl-56">
                {children}
            </div>
        </div>
    )
}
