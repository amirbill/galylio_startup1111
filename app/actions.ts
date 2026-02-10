'use server'

import { API_URL } from "@/lib/api"

export async function fetchProductsAction(category: string, categoryType: string, limit: number = 10) {
    try {
        const url = `${API_URL}/products/random?category=${encodeURIComponent(category)}&category_type=${categoryType}&limit=${limit}`;
        // console.log(`[Server Action] Fetching products: ${url}`);
        const res = await fetch(url, { cache: 'no-store' });

        if (!res.ok) {
            console.error(`[Server Action] Failed to fetch products: ${res.status}`);
            return [];
        }

        return await res.json();
    } catch (error) {
        console.error("[Server Action] Error fetching products:", error);
        return [];
    }
}

export async function fetchAnalyticsAction(type: "products" | "para", category: string) {
    try {
        const url = `${API_URL}/${type}/analytics/by-category?category=${encodeURIComponent(category)}`;
        // console.log(`[Server Action] Fetching analytics: ${url}`);
        const res = await fetch(url, { cache: 'no-store' });

        if (!res.ok) {
            console.error(`[Server Action] Failed to fetch analytics: ${res.status}`);
            return null;
        }

        return await res.json();
    } catch (error) {
        console.error("[Server Action] Error fetching analytics:", error);
        return null;
    }
}

export async function searchProductsAction(query: string, limit: number = 5, shop?: string) {
    try {
        const shopParam = shop ? `&shop=${encodeURIComponent(shop)}` : '';
        // Search both endpoints in parallel
        const [retailRes, paraRes] = await Promise.all([
            fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}${shopParam}`, { cache: 'no-store' }),
            fetch(`${API_URL}/para/search?q=${encodeURIComponent(query)}&limit=${limit}${shopParam}`, { cache: 'no-store' })
        ]);

        const retailData = retailRes.ok ? await retailRes.json() : [];
        const paraData = paraRes.ok ? await paraRes.json() : [];

        // Add source to each result
        const retailResults = retailData.map((r: any) => ({ ...r, source: "retail" as const }));
        const paraResults = paraData.map((r: any) => ({ ...r, source: "para" as const }));

        // Interleave results
        const combined = [];
        const maxLen = Math.max(retailResults.length, paraResults.length);
        for (let i = 0; i < maxLen; i++) {
            if (retailResults[i]) combined.push(retailResults[i]);
            if (paraResults[i]) combined.push(paraResults[i]);
        }

        return combined.slice(0, 8);
    } catch (error) {
        console.error("[Server Action] Error searching products:", error);
        return [];
    }
}

export async function filterProductsAction(type: "products" | "para", params: string) {
    try {
        const url = `${API_URL}/${type}/listing?${params}`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return { products: [], total: 0, totalPages: 0 };
        return await res.json();
    } catch (error) {
        console.error("[Server Action] Error filtering products:", error);
        return { products: [], total: 0, totalPages: 0 };
    }
}

export async function getCategoriesAction(type: "products" | "para", endpoint: "categories" | "low-categories" = "categories") {
    try {
        const url = `${API_URL}/${type}/${endpoint}`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error("[Server Action] Error fetching categories:", error);
        return [];
    }
}

export async function calculateBestShopAction(items: { sku: string; source: string }[]) {
    try {
        const res = await fetch(`${API_URL}/bag/best-shop`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
            cache: 'no-store'
        });

        if (!res.ok) {
            console.error("[Server Action] Failed to calculate best shop:", res.status);
            return null;
        }

        return await res.json();
    } catch (error) {
        console.error("[Server Action] Error calculating best shop:", error);
        return null;
    }
}

export async function fetchComparisonProductsAction(limit: number = 5) {
    try {
        // Fetch from both retail and para random endpoints
        // Using common categories to increase chance of interesting comparisons
        const categories = ["Alimentation", "Droguerie", "Hygiène", "Beauté"];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];

        const [retailRes, paraRes] = await Promise.all([
            fetch(`${API_URL}/products/random?category=${encodeURIComponent(randomCategory)}&limit=${limit}`, { cache: 'no-store' }),
            fetch(`${API_URL}/para/random?category=${encodeURIComponent(randomCategory)}&limit=${limit}`, { cache: 'no-store' })
        ]);

        const retailData = retailRes.ok ? await retailRes.json() : [];
        const paraData = paraRes.ok ? await paraRes.json() : [];

        // Add source and normalize
        const products = [
            ...retailData.map((p: any) => ({ ...p, source: 'retail' })),
            ...paraData.map((p: any) => ({ ...p, source: 'para' }))
        ];

        // Shuffle
        return products.sort(() => Math.random() - 0.5).slice(0, 9);
    } catch (error) {
        console.error("[Server Action] Error fetching comparison products:", error);
        return [];
    }
}
