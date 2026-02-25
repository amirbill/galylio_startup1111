"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { PageAccessCard } from "@/components/dashboard/page-access-card"
import { Shield, AlertCircle, Search } from "lucide-react"
import { useState } from "react"

// Define all pages in the application
const pages = [
    // Main Pages
    { name: "Home", path: "/", category: "Main" as const, visible: true, role: "both" as const },
    { name: "Solutions", path: "/solutions", category: "Main" as const, visible: true, role: "both" as const },
    { name: "Products", path: "/products", category: "Main" as const, visible: true, role: "both" as const },
    { name: "Para Products", path: "/para", category: "Main" as const, visible: true, role: "both" as const },
    { name: "Pricing", path: "/pricing", category: "Main" as const, visible: true, role: "both" as const },
    { name: "Profile", path: "/profile", category: "Main" as const, visible: true, role: "client" as const },
    { name: "Coming Soon", path: "/coming-soon", category: "Main" as const, visible: false, role: "both" as const },

    // Dashboard Pages
    { name: "Dashboard Overview", path: "/dashboard", category: "Dashboard" as const, visible: true, role: "both" as const },
    { name: "Product Monitoring", path: "/dashboard/veille", category: "Dashboard" as const, visible: true, role: "both" as const },
    { name: "Advanced Benchmarking", path: "/dashboard/benchmarking", category: "Dashboard" as const, visible: true, role: "admin" as const },
    { name: "Data Market", path: "/dashboard/data-market", category: "Dashboard" as const, visible: true, role: "admin" as const },
    { name: "Accessibility Control", path: "/dashboard/accessibility-control", category: "Dashboard" as const, visible: true, role: "admin" as const },
    { name: "Settings", path: "/dashboard/parametre", category: "Dashboard" as const, visible: true, role: "both" as const },

    // Auth Pages
    { name: "Sign In", path: "/signin", category: "Auth" as const, visible: true, role: "both" as const },
    { name: "Sign Up", path: "/signup", category: "Auth" as const, visible: true, role: "both" as const },
    { name: "Forgot Password", path: "/forgot-password", category: "Auth" as const, visible: true, role: "both" as const },
    { name: "Reset Password", path: "/reset-password", category: "Auth" as const, visible: true, role: "both" as const },
    { name: "Verify Email", path: "/verify", category: "Auth" as const, visible: true, role: "both" as const },

    // Product Pages
    { name: "Product Details", path: "/products/[id]", category: "Products" as const, visible: true, role: "both" as const },
    { name: "Para Product Details", path: "/para/[id]", category: "Products" as const, visible: true, role: "both" as const },
]

export default function AccessibilityControlPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")

    // Filter pages based on search and category
    const filteredPages = pages.filter((page) => {
        const matchesSearch = page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            page.path.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === "all" || page.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const categories = ["all", "Main", "Dashboard", "Auth", "Products"]

    return (
        <div className="min-h-screen">
            <DashboardHeader title="Accessibility Control" />

            <main className="p-6">
                {/* Header Section */}
                <div className="mb-6">
                    <div className="mb-4 flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">Page Access Management</h2>
                            <p className="text-sm text-muted-foreground">
                                Control visibility and access permissions for all pages. Set role-based or user-specific access.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border border-purple/30 bg-purple/5 px-4 py-2">
                            <Shield className="size-5 text-purple" />
                            <span className="text-sm font-semibold text-purple">
                                {pages.length} Pages Managed
                            </span>
                        </div>
                    </div>

                    {/* Info Alert */}
                    <div className="mb-4 flex items-start gap-3 rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
                        <AlertCircle className="size-5 text-blue-500" />
                        <div>
                            <h4 className="text-sm font-semibold text-blue-500">How it works</h4>
                            <p className="text-xs text-blue-500/80">
                                Toggle visibility to show/hide pages. Set access control to restrict pages to specific user roles.
                                You can also select specific clients or admins who can access each page for granular control.
                                Changes are applied immediately after saving.
                            </p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search pages..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple/20"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                                        selectedCategory === category
                                            ? "border-purple bg-purple/10 text-purple"
                                            : "border-border bg-background text-muted-foreground hover:border-purple/50"
                                    }`}
                                >
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pages Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPages.map((page) => (
                        <PageAccessCard
                            key={page.path}
                            pageName={page.name}
                            pagePath={page.path}
                            category={page.category}
                            initialVisible={page.visible}
                            initialRole={page.role}
                        />
                    ))}
                </div>

                {/* No Results */}
                {filteredPages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Search className="mb-3 size-12 text-muted-foreground/50" />
                        <h3 className="text-lg font-semibold text-foreground">No pages found</h3>
                        <p className="text-sm text-muted-foreground">
                            Try adjusting your search or filter criteria
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}
