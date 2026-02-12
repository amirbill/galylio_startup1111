import type { Metadata } from "next"
import { API_URL } from "@/lib/api"
import { ProductListing } from "@/components/ProductListing"

export const metadata: Metadata = {
  title: "Tous les Produits — Comparer les Prix en Tunisie",
  description:
    "Comparez les prix de milliers de produits en Tunisie : PC portables, imprimantes, réfrigérateurs, machines à laver. Trouvez le meilleur prix sur 1111.tn.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Produits — 1111.tn Comparateur de Prix",
    description:
      "Comparez les prix de milliers de produits en Tunisie. Électroménager, informatique et plus.",
    url: "/products",
  },
}

async function getCategories() {
    try {
        const [subcatsRes, lowcatsRes] = await Promise.all([
            fetch(`${API_URL}/products/categories`),
            fetch(`${API_URL}/products/low-categories`)
        ])

        const subcats = subcatsRes.ok ? await subcatsRes.json() : [];
        const lowcats = lowcatsRes.ok ? await lowcatsRes.json() : [];

        const safeSubcats = Array.isArray(subcats) ? subcats : [];
        const safeLowcats = Array.isArray(lowcats) ? lowcats : [];

        // Return unique combined categories
        return [...new Set<string>([...safeSubcats, ...safeLowcats])]
    } catch (error) {
        console.error("Error fetching categories:", error)
        return []
    }
}

async function getProducts(searchParams: { [key: string]: string | string[] | undefined }) {
    try {
        const params = new URLSearchParams()

        const search = searchParams.search as string;
        const category = searchParams.category as string;
        const categoryType = (searchParams.type || searchParams.category_type || "subcategory") as string;

        // Only fetch initial data if we're not doing a complex search/filter that client handles better,
        // OR simply fetch the default page (everything empty) if no params.
        // Actually, we should try to match the client logic to pre-fill content.

        if (search) params.set("search", search)

        if (category) {
            params.set("category", category)
            params.set("category_type", categoryType)
        }

        // Default initial load
        params.set("page", "1")
        params.set("limit", "20")

        const res = await fetch(`${API_URL}/products/listing?${params.toString()}`, { cache: 'no-store' })

        if (res.ok) {
            return await res.json()
        }
        return { products: [], total: 0, totalPages: 1 }
    } catch (error) {
        console.error("Error fetching products:", error)
        return { products: [], total: 0, totalPages: 1 }
    }
}

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams

    // Fetch data in parallel
    const [categories, productData] = await Promise.all([
        getCategories(),
        getProducts(resolvedSearchParams)
    ])

    return (
        <ProductListing
            initialCategories={categories}
            initialProducts={productData.products}
            initialTotal={productData.total}
            initialTotalPages={productData.totalPages}
        />
    )
}
