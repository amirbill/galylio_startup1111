"use client"

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
} from "recharts"
import { DashboardHeader } from "@/components/dashboard/header"

const brandsPerSectorData = [
    { name: "Tech", debit: 350, credit: 280 },
    { name: "Magasins", debit: 200, credit: 320 },
    { name: "Para", debit: 280, credit: 220 },
    { name: "Mode", debit: 180, credit: 250 },
]

const pieData = [
    { name: "Tech", value: 35, color: "#7c3aed" },
    { name: "Alimentation", value: 30, color: "#22d3d8" },
    { name: "Para", value: 20, color: "#a78bfa" },
    { name: "Mode", value: 15, color: "#c4b5fd" },
]

const productComparisonData = [
    { name: "TV", value: 3000 },
    { name: "PC", value: 2500 },
    { name: "Electro", value: 4000 },
    { name: "Para", value: 5500 },
    { name: "Smartphone", value: 12500 },
]

const topFamilleData = [
    { nbrMarque: "10.000", secteur: "Tech", famille: "Smartphones", type: "leader" },
    { nbrMarque: "20.000", secteur: "Tech", famille: "Pc portable", type: "moyenne" },
    { nbrMarque: "30.000", secteur: "Tech", famille: "Imprimantes", type: "moyenne" },
    { nbrMarque: "30.000", secteur: "Tech", famille: "Tv", type: "challenger" },
    { nbrMarque: "30.000", secteur: "Tech", famille: "Gaming", type: "leader" },
    { nbrMarque: "25.000", secteur: "Alimentaire", famille: "Huile", type: "challenger" },
    { nbrMarque: "25.000", secteur: "Alimentaire", famille: "Tomates", type: "challenger" },
    { nbrMarque: "25.000", secteur: "Alimentaire", famille: "Tomates", type: "challenger" },
    { nbrMarque: "30.000", secteur: "Tech", famille: "Imprimantes", type: "moyenne" },
    { nbrMarque: "30.000", secteur: "Tech", famille: "Tv", type: "challenger" },
]

function getFamilleStyle(type: string) {
    switch (type) {
        case "leader":
            return "bg-amber-100 text-amber-700"
        case "moyenne":
            return "bg-blue-100 text-blue-700"
        case "challenger":
            return "bg-teal-100 text-teal-700"
        default:
            return "bg-muted text-muted-foreground"
    }
}

export default function BenchmarkingPage() {
    return (
        <div className="min-h-screen">
            <DashboardHeader title="Benchmarking avancé" />
            <main className="space-y-6 p-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Nombre de brands par secteur */}
                    <div className="rounded-xl bg-card p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-semibold text-card-foreground">
                                Nombre de brands par secteur
                            </h3>
                            <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <span className="size-2.5 rounded-full bg-blue-500" />
                                    <span className="text-muted-foreground">Debit</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="size-2.5 rounded-full bg-teal-400" />
                                    <span className="text-muted-foreground">Credit</span>
                                </div>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={brandsPerSectorData} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                    }}
                                />
                                <Bar dataKey="debit" fill="#7c3aed" radius={[4, 4, 0, 0]} barSize={28} />
                                <Bar dataKey="credit" fill="#22d3d8" radius={[4, 4, 0, 0]} barSize={28} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top famille par secteur */}
                    <div className="rounded-xl bg-card p-6 shadow-sm">
                        <h3 className="mb-4 font-semibold text-card-foreground">
                            Top famille par secteur
                        </h3>
                        <div className="max-h-[280px] overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border text-left">
                                        <th className="pb-3 font-medium text-muted-foreground">Nbr marque</th>
                                        <th className="pb-3 font-medium text-muted-foreground">Secteur</th>
                                        <th className="pb-3 font-medium text-muted-foreground">Famille</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topFamilleData.map((row, index) => (
                                        <tr key={index} className="border-b border-border/50">
                                            <td className="py-2.5 text-card-foreground">{row.nbrMarque}</td>
                                            <td className="py-2.5 text-card-foreground">{row.secteur}</td>
                                            <td className="py-2.5">
                                                <span
                                                    className={`rounded-md px-2 py-1 text-xs font-medium ${getFamilleStyle(row.type)}`}
                                                >
                                                    {row.famille}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 flex items-center justify-center gap-6 text-xs">
                            <div className="flex items-center gap-1.5">
                                <span className="size-2.5 rounded-full bg-amber-400" />
                                <span className="text-muted-foreground">Leader</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="size-2.5 rounded-full bg-blue-500" />
                                <span className="text-muted-foreground">Moyenne</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="size-2.5 rounded-full bg-teal-400" />
                                <span className="text-muted-foreground">Challenger</span>
                            </div>
                        </div>
                    </div>

                    {/* Répartition des marques par secteur */}
                    <div className="rounded-xl bg-card p-6 shadow-sm">
                        <h3 className="mb-4 font-semibold text-card-foreground">
                            Répartition des marques par secteur
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={0}
                                    outerRadius={100}
                                    paddingAngle={0}

                                    dataKey="value"
                                    label={({ name, value }) => `${value}%\n${name}`}
                                    labelLine={false}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: any) => [`${value}%`, "Part"]}
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Comparaison par produit */}
                    <div className="rounded-xl bg-card p-6 shadow-sm">
                        <h3 className="mb-4 font-semibold text-card-foreground">
                            Comparaison par produit
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={productComparisonData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                                    tickFormatter={(value) => value.toLocaleString()}
                                />
                                <Tooltip
                                    formatter={(value: any) => [value.toLocaleString(), "Valeur"]}
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                    }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={45}>
                                    {productComparisonData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                index === productComparisonData.length - 1
                                                    ? "#7c3aed"
                                                    : index === productComparisonData.length - 2
                                                        ? "#fbbf24"
                                                        : "#e5e7eb"
                                            }
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    )
}
