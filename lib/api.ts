// API Configuration
// Direct connection to backend (avoids Vercel rewrite issues)

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://back-27em.onrender.com/api/v1";

// Normalize: strip trailing slash, then check for /api/v1
const normalizedBase = API_BASE_URL.replace(/\/+$/, '');
export const API_URL = normalizedBase.endsWith('/api/v1')
    ? normalizedBase
    : `${normalizedBase}/api/v1`;

// ─── Energy Consumption Types ────────────────────────────────────────────────

export interface EnergyConsumption {
    daily_kwh: number;
    monthly_kwh: number;
    yearly_kwh: number;
}

export interface EnergyCost {
    daily: number;
    monthly: number;
    yearly: number;
}

export interface TotalCostOfOwnership {
    purchase_price: number;
    five_year_energy_cost: number;
    five_year_total: number;
}

export interface EnergyCalculationResult {
    product_id: string;
    product_name: string;
    category: string;
    wattage: number;
    usage_hours_per_day: number;
    efficiency_rating: string;
    efficiency_factor: number;
    consumption: EnergyConsumption;
    cost_tnd: EnergyCost;
    total_cost_of_ownership: TotalCostOfOwnership;
    co2_emissions_kg_per_year: number;
    calculated_at: string;
}

export interface EnergySavingTips {
    category: string;
    tips: string[];
}

// ─── Energy API Functions ────────────────────────────────────────────────────

export async function getEnergyCalculation(
    productId: string,
    usageHours?: number,
    customWattage?: number
): Promise<EnergyCalculationResult | null> {
    try {
        const params = new URLSearchParams({ product_id: productId });
        if (usageHours !== undefined) params.append("usage_hours", String(usageHours));
        if (customWattage !== undefined) params.append("custom_wattage", String(customWattage));

        const res = await fetch(`${API_URL}/energy/calculate?${params.toString()}`);
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export async function getEnergySavingTips(category: string): Promise<EnergySavingTips | null> {
    try {
        const res = await fetch(`${API_URL}/energy/tips/${encodeURIComponent(category)}`);
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}
