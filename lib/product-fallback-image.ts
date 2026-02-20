/**
 * Returns a fallback product image based on the product name/category.
 * Used when the database image URL is missing.
 */
export function getProductFallbackImage(name: string = "", category: string = ""): string {
    const text = `${name} ${category}`.toLowerCase();

    if (text.includes("huile")) return "/images/categories/huile.svg";

    return "/placeholder.svg";
}
