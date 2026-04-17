"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Search, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from "@/lib/api"

interface SearchResult {
    id: string
    name: string
    brand: string
    bestPrice: number
    image: string
    inStock: boolean
    source?: "retail" | "para"
    relevance?: number
}

interface SearchBarProps {
    placeholder?: string
    className?: string
    variant?: "hero" | "header" | "premium"
    searchEndpoint?: string
    linkPrefix?: string
    accentColor?: string
    searchBoth?: boolean
}

export function SearchBar({
    placeholder = "Recherche un produit, une marque, une catégorie...",
    className = "",
    variant = "hero",
    searchEndpoint = "/api/v1/products/search",
    linkPrefix = "/products",
    accentColor = "purple",
    searchBoth = false
}: SearchBarProps) {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const inputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const requestIdRef = useRef(0)
    const router = useRouter()

    const resolveSearchUrl = (endpoint: string, searchQuery: string, resultLimit: number) => {
        const queryString = `q=${encodeURIComponent(searchQuery)}&limit=${resultLimit}`
        const apiBase = API_BASE_URL.replace(/\/+$/, "")
        const normalizedEndpoint = endpoint.startsWith("/api/v1/")
            ? endpoint.replace(/^\/api\/v1/, "")
            : endpoint

        if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
            return `${endpoint}?${queryString}`
        }

        if (endpoint.startsWith("/api/v1/")) {
            return `${apiBase}${normalizedEndpoint}?${queryString}`
        }

        return `${apiBase}/${normalizedEndpoint.replace(/^\/+/, "")}?${queryString}`
    }

    const getSourceFromEndpoint = (endpoint: string): "retail" | "para" => {
        return endpoint.includes("/para/") ? "para" : "retail"
    }

    const getCompanionEndpoint = (endpoint: string): string => {
        return endpoint.includes("/para/") ? "/api/v1/products/search" : "/api/v1/para/search"
    }

    const fetchEndpointResults = async (endpoint: string, searchQuery: string, resultLimit: number) => {
        const response = await fetch(resolveSearchUrl(endpoint, searchQuery, resultLimit), {
            cache: "no-store",
        })

        if (!response.ok) {
            return []
        }

        const data = await response.json()
        const source = getSourceFromEndpoint(endpoint)

        return (Array.isArray(data) ? data : []).map((result: SearchResult) => ({
            ...result,
            source: result.source || source,
            relevance: typeof result.relevance === "number" ? result.relevance : 0,
        }))
    }

    // Debounced search
    useEffect(() => {
        if (query.length < 2) {
            setResults([])
            setShowDropdown(false)
            return
        }

        const timer = setTimeout(async () => {
            const requestId = ++requestIdRef.current
            setIsLoading(true)
            try {
                const limit = variant === "premium" ? 8 : 5

                const companionEndpoint = getCompanionEndpoint(searchEndpoint)
                const [primaryResults, companionResults] = await Promise.all([
                    fetchEndpointResults(searchEndpoint, query, limit),
                    searchBoth ? fetchEndpointResults(companionEndpoint, query, limit) : Promise.resolve([]),
                ])

                const resultsToShow = searchBoth
                    ? [...primaryResults, ...companionResults]
                    : primaryResults

                const rankedResults = resultsToShow
                    .sort((left, right) => (right.relevance || 0) - (left.relevance || 0))
                    .slice(0, searchBoth ? 2 * limit : limit)

                if (requestId === requestIdRef.current) {
                    setResults(rankedResults)
                    setShowDropdown(true)
                }
            } catch (error) {
                console.error("Search error:", error)
            } finally {
                if (requestId === requestIdRef.current) {
                    setIsLoading(false)
                }
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query, searchBoth, variant, searchEndpoint])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(e.target as Node)
            ) {
                setShowDropdown(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSubmit = useCallback((e?: React.FormEvent) => {
        e?.preventDefault()
        if (query.trim()) {
            setShowDropdown(false)
            router.push(`${linkPrefix}?search=${encodeURIComponent(query.trim())}`)
        }
    }, [query, router, linkPrefix])

    const handleResultClick = (result: SearchResult) => {
        setShowDropdown(false)
        setQuery("")
        const prefix = searchBoth && result.source === "para" ? "/para" :
            searchBoth && result.source === "retail" ? "/products" :
                linkPrefix
        router.push(`${prefix}/${encodeURIComponent(result.id)}`)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showDropdown || results.length === 0) {
            if (e.key === "Enter") {
                handleSubmit()
            }
            return
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault()
                setSelectedIndex(prev =>
                    prev < results.length - 1 ? prev + 1 : prev
                )
                break
            case "ArrowUp":
                e.preventDefault()
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
                break
            case "Enter":
                e.preventDefault()
                if (selectedIndex >= 0 && selectedIndex < results.length) {
                    handleResultClick(results[selectedIndex])
                } else {
                    handleSubmit()
                }
                break
            case "Escape":
                setShowDropdown(false)
                setSelectedIndex(-1)
                break
        }
    }

    const formatPrice = (price: number) => {
        return price.toFixed(3) + " DT"
    }

    const clearSearch = () => {
        setQuery("")
        setResults([])
        setShowDropdown(false)
        inputRef.current?.focus()
    }

    const isHero = variant === "hero"
    const isPremium = variant === "premium"

    // Color mappings for different accent colors
    const accentColors = {
        purple: {
            bg50: "bg-purple/10",
            text600: "text-purple",
            hoverBg: "hover:bg-purple/10",
            buttonText: "text-[#8B5CF6]"
        },
        blue: {
            bg50: "bg-blue-50",
            text600: "text-blue-600",
            hoverBg: "hover:bg-blue-50",
            buttonText: "text-[#2563EB]"
        },
        teal: {
            bg50: "bg-teal-50",
            text600: "text-teal-600",
            hoverBg: "hover:bg-teal-50",
            buttonText: "text-[#0D9488]"
        }
    }

    const colors = isPremium 
        ? { bg50: "bg-blue-50", text600: "text-blue-600", hoverBg: "hover:bg-blue-50", buttonText: "text-white" }
        : (accentColors[accentColor as keyof typeof accentColors] || accentColors.purple)

    if (isPremium) {
        return (
            <div className={`relative ${className}`}>
                <form onSubmit={handleSubmit}>
                    <div className="relative group">
                        <div className="relative bg-white rounded-[2.5rem] px-6 sm:px-8 py-3 sm:py-4 flex items-center gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100/80">
                            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value)
                                    setSelectedIndex(-1)
                                }}
                                onFocus={() => {
                                    if (results.length > 0) setShowDropdown(true)
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder={placeholder}
                                className="flex-1 text-sm sm:text-lg outline-none bg-transparent text-slate-900 placeholder-slate-400"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors mr-2"
                                >
                                    <X className="size-4 text-gray-400" />
                                </button>
                            )}
                            {isLoading && (
                                <Loader2 className="size-4 text-gray-400 animate-spin mr-2" />
                            )}
                            <button 
                                type="submit"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-10 py-2.5 sm:py-3.5 rounded-2xl text-sm sm:text-base font-bold hover:shadow-lg transition-all duration-300 active:scale-95"
                            >
                                Chercher
                            </button>
                        </div>
                    </div>
                </form>

                {/* Dropdown Results */}
                {showDropdown && results.length > 0 && (
                    <div
                        ref={dropdownRef}
                        className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-[450px] overflow-y-auto p-2"
                    >
                        <div className="space-y-1">
                            {results.map((result, index) => (
                                <button
                                    key={`${result.source || 'item'}-${result.id}`}
                                    onClick={() => handleResultClick(result)}
                                    className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all text-left ${index === selectedIndex
                                        ? "bg-blue-50"
                                        : "hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="relative size-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                                        <Image
                                            src={result.image || "/placeholder.svg"}
                                            alt={result.name}
                                            fill
                                            className="object-contain p-1.5"
                                        />
                                        {result.source && (
                                            <div className={`absolute bottom-0 left-0 right-0 text-[9px] font-black text-white text-center py-0.5 ${result.source === "para" ? "bg-teal-500" : "bg-blue-500"
                                                }`}>
                                                {result.source === "para" ? "PARA" : "TECH"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-[10px] font-black uppercase tracking-wider ${result.source === "para" ? "text-teal-600" : "text-blue-600"
                                            }`}>
                                            {result.brand}
                                        </p>
                                        <p className="text-base font-bold text-gray-900 truncate">
                                            {result.name}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-sm font-black text-orange-500">
                                                {formatPrice(result.bestPrice)}
                                            </span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${result.inStock
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-600"
                                                }`}>
                                                {result.inStock ? "En stock" : "Épuisé"}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* See all results button */}
                        <div className="mt-2 pt-2 border-t border-gray-100">
                            <button
                                onClick={() => handleSubmit()}
                                className="w-full py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                            >
                                Voir tous les résultats pour &quot;{query}&quot;
                            </button>
                        </div>
                    </div>
                )}

                {/* No results message */}
                {showDropdown && query.length >= 2 && results.length === 0 && !isLoading && (
                    <div
                        ref={dropdownRef}
                        className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50 p-8 text-center"
                    >
                        <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-gray-50 rounded-full">
                                <Search className="size-8 text-gray-300" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-gray-900">Aucun produit trouvé</p>
                                <p className="text-sm text-gray-500">Nous n'avons pas trouvé de résultats pour &quot;{query}&quot;</p>
                            </div>
                            <button
                                onClick={() => handleSubmit()}
                                className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-colors"
                            >
                                Recherche globale
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className={`relative ${className}`}>
            <form onSubmit={handleSubmit}>
                <div className={`relative ${isHero ? "group/search" : ""}`}>
                    {isHero && (
                        <div className="absolute inset-0 bg-white rounded-full shadow-lg border border-gray-200" />
                    )}
                    <div className={`relative flex items-center gap-3 ${isHero
                        ? "p-2 pl-6"
                        : "bg-gray-100 rounded-full px-4 py-2"
                        }`}>
                        {!isHero && (
                            <Search className="size-4 text-gray-400" />
                        )}
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value)
                                setSelectedIndex(-1)
                            }}
                            onFocus={() => {
                                if (results.length > 0) setShowDropdown(true)
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            className={`flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:text-gray-500 ${isHero
                                ? "text-gray-900 h-10"
                                : "text-gray-700 h-8"
                                }`}
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="size-4 text-gray-400" />
                            </button>
                        )}
                        {isLoading && (
                            <Loader2 className="size-4 text-gray-400 animate-spin" />
                        )}
                        {isHero && (
                            <button
                                type="submit"
                                className={`size-10 rounded-full bg-white shadow-md flex items-center justify-center ${colors.buttonText} transition-transform hover:scale-110 active:scale-95`}
                            >
                                <Search className="size-4 stroke-[3px]" />
                            </button>
                        )}
                    </div>
                </div>
            </form>

            {/* Dropdown Results */}
            {showDropdown && results.length > 0 && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-[400px] overflow-y-auto"
                >
                    <div className="p-2">
                        {results.map((result, index) => (
                            <button
                                key={`${result.source || 'item'}-${result.id}`}
                                onClick={() => handleResultClick(result)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${index === selectedIndex
                                    ? colors.bg50
                                    : "hover:bg-gray-50"
                                    }`}
                            >
                                <div className="relative size-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                    <Image
                                        src={result.image || "/placeholder.svg"}
                                        alt={result.name}
                                        fill
                                        className="object-contain p-1"
                                    />
                                    {result.source && (
                                        <div className={`absolute bottom-0 left-0 right-0 text-[8px] font-bold text-white text-center py-0.5 ${result.source === "para" ? "bg-teal-500" : "bg-blue-500"
                                            }`}>
                                            {result.source === "para" ? "PARA" : "TECH"}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-bold uppercase ${result.source === "para" ? "text-teal-600" : colors.text600
                                        }`}>
                                        {result.brand}
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {result.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-sm font-bold text-orange-500">
                                            {formatPrice(result.bestPrice)}
                                        </span>
                                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${result.inStock
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-600"
                                            }`}>
                                            {result.inStock ? "En stock" : "Épuisé"}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* See all results button */}
                    <div className="border-t border-gray-100 p-2">
                        <button
                            onClick={() => handleSubmit()}
                            className={`w-full py-2 text-sm font-medium ${colors.text600} ${colors.hoverBg} rounded-lg transition-colors`}
                        >
                            Voir tous les résultats pour &quot;{query}&quot;
                        </button>
                    </div>
                </div>
            )}

            {/* No results message */}
            {showDropdown && query.length >= 2 && results.length === 0 && !isLoading && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 p-6 text-center"
                >
                    <p className="text-gray-500">Aucun produit trouvé pour &quot;{query}&quot;</p>
                    <button
                        onClick={() => handleSubmit()}
                        className={`mt-2 text-sm font-medium ${colors.text600} hover:underline`}
                    >
                        Rechercher dans toutes les boutiques
                    </button>
                </div>
            )}
        </div>
    )
}
