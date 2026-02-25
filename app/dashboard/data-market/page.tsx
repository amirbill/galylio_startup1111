import { DashboardHeader } from "@/components/dashboard/header"
import { ShopDataWidget } from "@/components/dashboard/shop-data-widget"

// Sample chart data generator
const generateChartData = (baseValue: number, variance: number = 20) => {
    return Array.from({ length: 12 }, (_, i) => ({
        value: baseValue + Math.random() * variance - variance / 2,
    }))
}

// Shop data based on the configured shops
const shopsData = [
    {
        shopName: "ParaShop",
        shopLogo: "/images/parashop-removebg-preview.png",
        location: "Tunis, Tunisia",
        revenue: "3.2M DT",
        traffic: "45k/mo",
        dataPoints: "12.5K",
        demographics: "25-55, Health",
        rating: 4.5,
        reviewCount: 342,
        lastUpdated: "2 hours ago",
        price: "299 DT",
        chartData: generateChartData(80, 15),
        trending: true,
    },
    {
        shopName: "Pharma-Shop",
        shopLogo: "/images/pharmashop-removebg-preview.png",
        location: "Sousse, Tunisia",
        revenue: "2.8M DT",
        traffic: "38k/mo",
        dataPoints: "10.2K",
        demographics: "30-60, Pharma",
        rating: 4.6,
        reviewCount: 289,
        lastUpdated: "1 hour ago",
        price: "349 DT",
        chartData: generateChartData(75, 18),
        trending: false,
    },
    {
        shopName: "ParaFendri",
        shopLogo: "/images/parafendri-removebg-preview.png",
        location: "Sfax, Tunisia",
        revenue: "2.1M DT",
        traffic: "28k/mo",
        dataPoints: "8.7K",
        demographics: "20-50, Wellness",
        rating: 4.3,
        reviewCount: 198,
        lastUpdated: "3 hours ago",
        price: "279 DT",
        chartData: generateChartData(70, 20),
        trending: false,
    },
    {
        shopName: "MyTek",
        shopLogo: "/images/téléchargement (4).png",
        location: "Tunis, Tunisia",
        revenue: "5.1M DT",
        traffic: "62k/mo",
        dataPoints: "22.3K",
        demographics: "18-45, Tech",
        rating: 4.7,
        reviewCount: 543,
        lastUpdated: "30 min ago",
        price: "499 DT",
        chartData: generateChartData(90, 12),
        trending: true,
    },
    {
        shopName: "Tunisianet",
        shopLogo: "/images/téléchargement (6).png",
        location: "Tunis, Tunisia",
        revenue: "6.3M DT",
        traffic: "78k/mo",
        dataPoints: "28.9K",
        demographics: "20-50, Tech",
        rating: 4.8,
        reviewCount: 672,
        lastUpdated: "1 hour ago",
        price: "599 DT",
        chartData: generateChartData(95, 10),
        trending: true,
    },
    {
        shopName: "Spacenet",
        shopLogo: "/images/spacenet-removebg-preview.png",
        location: "Ariana, Tunisia",
        revenue: "4.5M DT",
        traffic: "52k/mo",
        dataPoints: "18.4K",
        demographics: "22-48, Electronics",
        rating: 4.4,
        reviewCount: 421,
        lastUpdated: "2 hours ago",
        price: "449 DT",
        chartData: generateChartData(85, 14),
        trending: false,
    },
]

export default function DataMarketPage() {
    return (
        <div className="min-h-screen">
            <DashboardHeader title="Data Market" />

            <main className="p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Market Intelligence</h2>
                    <p className="text-sm text-muted-foreground">
                        Explore comprehensive data insights from all major shops in Tunisia
                    </p>
                </div>

                {/* Shop Widgets Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {shopsData.map((shop) => (
                        <ShopDataWidget key={shop.shopName} {...shop} />
                    ))}
                </div>
            </main>
        </div>
    )
}
