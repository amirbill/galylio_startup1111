"use client"

import { useMemo, useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

interface PriceEvolutionChartProps {
    currentPrice?: number
}

export function PriceEvolutionChart({ currentPrice = 3299.000 }: PriceEvolutionChartProps) {
    const data = useMemo(() => {
        const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct"]
        // Generate a somewhat realistic trending history ending at currentPrice
        return months.map((month, i) => {
            // Create a small random fluctuation but generally trending towards the current price
            const progress = (i + 1) / months.length
            const baseChange = (Math.random() - 0.4) * 0.05 // -2% to +3% fluctuation
            const trendPrice = currentPrice * (0.9 + (0.1 * progress)) // Start at 90% and move to 100%
            const price = trendPrice * (1 + baseChange)
            
            return {
                name: month,
                price: parseFloat(price.toFixed(3))
            }
        })
    }, [currentPrice])

    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col h-full min-h-[300px] items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D9488]"></div>
            </div>
        )
    }

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col h-full min-h-[300px]">
             <h3 className="text-center text-xs font-bold uppercase tracking-widest text-[#475569] mb-8">
                ÉVOLUTION DU PRIX
            </h3>
            
            <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10 }}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10 }}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                borderRadius: '12px', 
                                border: 'none', 
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                fontSize: '12px'
                            }}
                            formatter={(value: number | string | undefined) => {
                                const val = typeof value === 'number' ? value : parseFloat(String(value));
                                return [`${val.toFixed(3)} DT`, 'Prix'];
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#0D9488"
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 4, strokeWidth: 0, fill: '#0D9488' }}
                            animationDuration={1500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
