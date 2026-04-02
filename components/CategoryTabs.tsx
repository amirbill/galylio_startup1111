"use client"

import { useState, useEffect } from "react"

interface Category {
    id: string
    label: string
}

interface CategoryTabsProps {
    categories: Category[]
    activeCategory: string
    onCategoryChange?: (category: string) => void
    accentColor?: string
}

export function CategoryTabs({ categories, activeCategory, onCategoryChange, accentColor = "purple" }: CategoryTabsProps) {
    const [currentActive, setCurrentActive] = useState(activeCategory)

    useEffect(() => {
        setCurrentActive(activeCategory)
    }, [activeCategory])

    const handleCategoryClick = (categoryId: string) => {
        setCurrentActive(categoryId)
        onCategoryChange?.(categoryId)
    }

    const getActiveStyles = () => {
        switch (accentColor) {
            case "blue": return "bg-blue-600 text-white"
            case "teal": return "bg-teal-600 text-white"
            case "orange": return "bg-orange-600 text-white"
            default: return "bg-purple text-purple-foreground"
        }
    }

    if (categories.length === 0) {
        return <div className="text-muted-foreground">Loading categories...</div>
    }

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-all cursor-pointer whitespace-nowrap shadow-sm ${currentActive === category.id
                        ? getActiveStyles()
                        : "border border-border bg-card text-muted-foreground hover:bg-muted"
                        }`}
                >
                    {category.label}
                </button>
            ))}
        </div>
    )
}
