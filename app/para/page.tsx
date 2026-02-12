import type { Metadata } from "next"
import { API_URL } from "@/lib/api"
import { ParaProductListing } from "@/components/ParaProductListing"

export const metadata: Metadata = {
  title: "Parapharmacie — Comparer les Prix en Tunisie",
  description:
    "Comparez les prix de produits de parapharmacie en Tunisie : soins, cosmétiques, hygiène. Trouvez les meilleurs prix sur 1111.tn.",
  alternates: {
    canonical: "/para",
  },
  openGraph: {
    title: "Parapharmacie — 1111.tn Comparateur de Prix",
    description:
      "Comparez les prix de produits de parapharmacie en Tunisie.",
    url: "/para",
  },
}

async function getParaProducts(searchParams: { [key: string]: string | string[] | undefined }) {
    try {
        const params = new URLSearchParams()

        const search = searchParams.search as string;
        const category = searchParams.category as string;
        const categoryType = (searchParams.type || searchParams.category_type || "top") as string;

        if (search) params.set("search", search)

        if (category) {
            params.set("category", category)
            params.set("category_type", categoryType)
        }

        // Default initial load
        params.set("page", "1")
        params.set("limit", "20")

        const res = await fetch(`${API_URL}/para/listing?${params.toString()}`, { cache: 'no-store' })

        if (res.ok) {
            return await res.json()
        }
        return { products: [], total: 0, totalPages: 1 }
    } catch (error) {
        console.error("Error fetching para products:", error)
        return { products: [], total: 0, totalPages: 1 }
    }
}

export default async function ParaProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams
    const productData = await getParaProducts(resolvedSearchParams)

    return (
        <ParaProductListing
            initialProducts={productData.products}
            initialTotal={productData.total}
            initialTotalPages={productData.totalPages}
        />
    )
}
