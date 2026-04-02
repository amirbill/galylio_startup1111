"use client"

import { useEffect, useState } from "react"
import {
    Zap,
    TrendingDown,
    Leaf,
    DollarSign,
    Lightbulb,
    ChevronDown,
    ChevronUp,
    AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
    getEnergyCalculation,
    getEnergySavingTips,
    type EnergyCalculationResult,
    type EnergySavingTips,
} from "@/lib/api"

// ─── Efficiency badge color helpers ──────────────────────────────────────────

function getEfficiencyColor(rating: string): string {
    const colors: Record<string, string> = {
        "A+++": "bg-green-500",
        "A++": "bg-green-500",
        "A+": "bg-green-400",
        A: "bg-green-400",
        B: "bg-lime-400",
        C: "bg-yellow-400",
        D: "bg-orange-400",
        E: "bg-orange-500",
        F: "bg-red-400",
        G: "bg-red-500",
    }
    return colors[rating] || "bg-gray-400"
}

function getEfficiencyLabel(rating: string): string {
    if (["A+++", "A++", "A+", "A"].includes(rating)) return "Très efficace"
    if (["B", "C"].includes(rating)) return "Efficace"
    if (["D", "E"].includes(rating)) return "Moyen"
    return "Peu efficace"
}

// ─── Category display names ─────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
    refrigerator: "Réfrigérateur",
    air_conditioner: "Climatiseur",
    washing_machine: "Machine à laver",
    dryer: "Sèche-linge",
    dishwasher: "Lave-vaisselle",
    television: "Télévision",
    microwave: "Micro-ondes",
    oven: "Four",
    computer: "Ordinateur",
    laptop: "PC Portable",
    water_heater: "Chauffe-eau",
    fan: "Ventilateur",
    vacuum_cleaner: "Aspirateur",
    iron: "Fer à repasser",
    other: "Autre",
}

// ─── Skeleton loader ────────────────────────────────────────────────────────

function EnergySkeleton() {
    return (
        <Card className="mt-8">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-48" />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-24 rounded-lg" />
                    ))}
                </div>
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
            </CardContent>
        </Card>
    )
}

// ─── Main Component ─────────────────────────────────────────────────────────

interface EnergyConsumptionProps {
    productId: string
}

export function EnergyConsumption({ productId }: EnergyConsumptionProps) {
    const [data, setData] = useState<EnergyCalculationResult | null>(null)
    const [tips, setTips] = useState<EnergySavingTips | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [showTips, setShowTips] = useState(false)

    useEffect(() => {
        let cancelled = false

        async function fetchEnergy() {
            setLoading(true)
            setError(false)

            const result = await getEnergyCalculation(productId)
            if (cancelled) return

            if (!result) {
                setError(true)
                setLoading(false)
                return
            }

            setData(result)

            // Fetch tips for the detected category
            const tipsResult = await getEnergySavingTips(result.category)
            if (!cancelled) {
                setTips(tipsResult)
            }

            setLoading(false)
        }

        fetchEnergy()
        return () => {
            cancelled = true
        }
    }, [productId])

    if (loading) return <EnergySkeleton />
    if (error || !data) return null

    const categoryLabel = CATEGORY_LABELS[data.category] || data.category

    return (
        <Card className="mt-8 overflow-hidden">
            {/* Header */}
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Consommation Énergétique
                    <span className="ml-auto text-sm font-normal text-muted-foreground">
                        {categoryLabel}
                    </span>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
                {/* Efficiency Badge */}
                <div className="flex items-center gap-3">
                    <span
                        className={`inline-flex items-center justify-center px-3 py-1 text-sm font-bold text-white rounded-full ${getEfficiencyColor(
                            data.efficiency_rating
                        )}`}
                    >
                        {data.efficiency_rating}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {getEfficiencyLabel(data.efficiency_rating)} — {data.wattage}W
                    </span>
                </div>

                <Separator />

                {/* Consumption Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Daily */}
                    <div className="rounded-lg border bg-blue-50 dark:bg-blue-950/20 p-4 text-center">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Par jour
                        </p>
                        <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {data.consumption.daily_kwh}
                            <span className="text-sm font-normal ml-1">kWh</span>
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            {data.cost_tnd.daily} TND
                        </p>
                    </div>

                    {/* Monthly */}
                    <div className="rounded-lg border bg-blue-50 dark:bg-purple-950/20 p-4 text-center">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Par mois
                        </p>
                        <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {data.consumption.monthly_kwh}
                            <span className="text-sm font-normal ml-1">kWh</span>
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            {data.cost_tnd.monthly} TND
                        </p>
                    </div>

                    {/* Yearly */}
                    <div className="rounded-lg border bg-orange-50 dark:bg-orange-950/20 p-4 text-center">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Par an
                        </p>
                        <p className="mt-1 text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {data.consumption.yearly_kwh}
                            <span className="text-sm font-normal ml-1">kWh</span>
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            {data.cost_tnd.yearly} TND
                        </p>
                    </div>
                </div>

                <Separator />

                {/* Total Cost of Ownership */}
                <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <h4 className="font-semibold text-sm">
                            Coût total sur 5 ans
                        </h4>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-xs text-muted-foreground">Prix d&apos;achat</p>
                            <p className="text-lg font-bold">
                                {data.total_cost_of_ownership.purchase_price > 0
                                    ? `${data.total_cost_of_ownership.purchase_price} TND`
                                    : "—"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Énergie (5 ans)</p>
                            <p className="text-lg font-bold text-red-500">
                                +{data.total_cost_of_ownership.five_year_energy_cost} TND
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Total</p>
                            <p className="text-lg font-bold text-green-600">
                                {data.total_cost_of_ownership.five_year_total > 0
                                    ? `${data.total_cost_of_ownership.five_year_total} TND`
                                    : `${data.total_cost_of_ownership.five_year_energy_cost} TND`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* CO2 Emissions */}
                <div className="flex items-center gap-3 rounded-lg border bg-green-50 dark:bg-green-950/20 p-3">
                    <Leaf className="h-5 w-5 text-green-600 shrink-0" />
                    <div>
                        <p className="text-sm font-medium">Empreinte carbone</p>
                        <p className="text-xs text-muted-foreground">
                            Cet appareil émet environ{" "}
                            <span className="font-semibold text-green-700 dark:text-green-400">
                                {data.co2_emissions_kg_per_year} kg CO₂
                            </span>{" "}
                            par an
                        </p>
                    </div>
                </div>

                {/* Energy Saving Tips */}
                {tips && tips.tips.length > 0 && (
                    <div className="rounded-lg border p-4">
                        <button
                            onClick={() => setShowTips(!showTips)}
                            className="flex items-center gap-2 w-full text-left"
                        >
                            <Lightbulb className="h-4 w-4 text-yellow-500" />
                            <span className="font-semibold text-sm flex-1">
                                Conseils d&apos;économie d&apos;énergie
                            </span>
                            {showTips ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                        </button>

                        {showTips && (
                            <ul className="mt-3 space-y-2">
                                {tips.tips.map((tip, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                        <TrendingDown className="h-3.5 w-3.5 mt-0.5 text-green-500 shrink-0" />
                                        <span className="text-muted-foreground">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* Disclaimer */}
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <p>
                        Estimation basée sur la catégorie du produit et les spécifications disponibles.
                        La consommation réelle peut varier selon l&apos;utilisation et les conditions.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
