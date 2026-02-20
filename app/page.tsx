import dynamic from 'next/dynamic';
import { API_URL } from '@/lib/api';

// Eager imports — above the fold
import HeroSection from '@/components/HeroSection';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PriceCards from '@/components/PriceCards';
import { SmartInfoCard } from '@/components/smart-info-card';

// Lazy imports — below the fold (code-split, loaded on demand)
const ProductShowcase = dynamic(() => import('@/components/ProductShowcase'));
const ParaProductShowcase = dynamic(() => import('@/components/ParaProductShowcase').then(m => ({ default: m.ParaProductShowcase })));
const SupermarketEssentials = dynamic(() => import('@/components/SupermarketEssentials').then(m => ({ default: m.SupermarketEssentials })));
const SupermarketComparison = dynamic(() => import('@/components/SupermarketComparison').then(m => ({ default: m.SupermarketComparison })));
const FakePriceAlerts = dynamic(() => import('@/components/FakePriceAlerts').then(m => ({ default: m.FakePriceAlerts })));
const ShopPriceComparisonTable = dynamic(() => import('@/components/ShopPriceComparisonTable').then(m => ({ default: m.ShopPriceComparisonTable })));
const BestShopSection = dynamic(() => import('@/components/BestShopSection').then(m => ({ default: m.BestShopSection })));
const PriceVariationAlert = dynamic(() => import('@/components/PriceVariationAlert').then(m => ({ default: m.PriceVariationAlert })));
const CouffinTounsiSection = dynamic(() => import('@/components/CouffinTounsiSection').then(m => ({ default: m.CouffinTounsiSection })));

// Category configurations for each showcase
const imprimanteCategories = [
  { id: "Imprimante", label: "Imprimante", type: "low_category" as const },
  { id: "PC de Bureau", label: "PC de Bureau", type: "subcategory" as const },
  { id: "Pc Portable", label: "Pc Portable", type: "subcategory" as const },
  { id: "Refrigerateur", label: "Réfrigérateur", type: "subcategory" as const },
  { id: "Machine à Laver", label: "Machine à Laver", type: "subcategory" as const },
  { id: "Lave Vaisselle", label: "Lave Vaisselle", type: "subcategory" as const },
];

const refrigerateurCategories = [
  { id: "Refrigerateur", label: "Réfrigérateur", type: "subcategory" as const },
  { id: "PC de Bureau", label: "PC de Bureau", type: "subcategory" as const },
  { id: "Pc Portable", label: "Pc Portable", type: "subcategory" as const },
  { id: "Imprimante", label: "Imprimante", type: "low_category" as const },
  { id: "Machine à Laver", label: "Machine à Laver", type: "subcategory" as const },
  { id: "Lave Vaisselle", label: "Lave Vaisselle", type: "subcategory" as const },
];

const machineALaverCategories = [
  { id: "Machine à Laver", label: "Machine à Laver", type: "subcategory" as const },
  { id: "PC de Bureau", label: "PC de Bureau", type: "subcategory" as const },
  { id: "Pc Portable", label: "Pc Portable", type: "subcategory" as const },
  { id: "Imprimante", label: "Imprimante", type: "low_category" as const },
  { id: "Refrigerateur", label: "Réfrigérateur", type: "subcategory" as const },
  { id: "Lave Vaisselle", label: "Lave Vaisselle", type: "subcategory" as const },
];

const laveVaisselleCategories = [
  { id: "Lave Vaisselle", label: "Lave Vaisselle", type: "subcategory" as const },
  { id: "PC de Bureau", label: "PC de Bureau", type: "subcategory" as const },
  { id: "Pc Portable", label: "Pc Portable", type: "subcategory" as const },
  { id: "Imprimante", label: "Imprimante", type: "low_category" as const },
  { id: "Refrigerateur", label: "Réfrigérateur", type: "subcategory" as const },
  { id: "Machine à Laver", label: "Machine à Laver", type: "subcategory" as const },
];

// Server-side data fetching functions
async function getPrices() {
  try {
    const res = await fetch(`${API_URL}/analytics/prices`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("Error fetching prices:", e);
    return null;
  }
}

async function getCategories(type: "products" | "para") {
  try {
    const res = await fetch(`${API_URL}/${type}/analytics/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error(`Error fetching ${type} categories:`, e);
    return [];
  }
}

async function getCategoryAnalytics(type: "products" | "para", category: string) {
  if (!category) return null;
  try {
    const res = await fetch(`${API_URL}/${type}/analytics/by-category?category=${encodeURIComponent(category)}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error(`Error fetching ${type} analytics for ${category}:`, e);
    return null;
  }
}

async function getAllAnalytics(type: "products" | "para", categories: string[]) {
  // Fetch all analytics in parallel
  // Limit concurrency if needed, but for < 10 items it's fine
  const results = await Promise.all(
    categories.map(async (cat) => {
      const data = await getCategoryAnalytics(type, cat);
      return { category: cat, data };
    })
  );

  // Convert to map/object
  const analyticsMap: Record<string, any> = {};
  results.forEach(({ category, data }) => {
    if (data) analyticsMap[category] = data;
  });
  return analyticsMap;
}


async function getProducts(category: string, type: string) {
  try {
    const url = `${API_URL}/products/random?category=${encodeURIComponent(category)}&category_type=${type}&limit=10`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error(`Error fetching products for ${category}:`, e);
    return [];
  }
}

async function getParaProducts(category: string, type: string) {
  try {
    const url = `${API_URL}/para/random?category=${encodeURIComponent(category)}&category_type=${type}&limit=10`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error(`Error fetching para products for ${category}:`, e);
    return [];
  }
}

async function getComparisonProducts(limit: number = 9) {
  try {
    // Valid categories for each source
    const retailCategories = ["Refrigerateur", "Machine à Laver", "Lave Vaisselle", "Imprimante", "Pc Portable"];
    const paraCategories = ["Maman et bébé", "Solaire", "Hygiène", "Visage"];

    const randomRetailCategory = retailCategories[Math.floor(Math.random() * retailCategories.length)];
    const randomParaCategory = paraCategories[Math.floor(Math.random() * paraCategories.length)];

    // Fetch from both sources with their respective valid categories
    const [retailRes, paraRes] = await Promise.all([
      fetch(`${API_URL}/products/random?category=${encodeURIComponent(randomRetailCategory)}&limit=${limit}`, { next: { revalidate: 300 } }),
      fetch(`${API_URL}/para/random?category=${encodeURIComponent(randomParaCategory)}&limit=${limit}`, { next: { revalidate: 300 } })
    ]);

    const retailData = retailRes.ok ? await retailRes.json() : [];
    const paraData = paraRes.ok ? await paraRes.json() : [];

    const products = [
      ...retailData.map((p: any) => ({ ...p, source: 'retail' })),
      ...paraData.map((p: any) => ({ ...p, source: 'para' }))
    ];

    // Identify by ID by default.
    return products.sort(() => Math.random() - 0.5).slice(0, 9);
  } catch (e) {
    console.error("Error fetching comparison products:", e);
    return [];
  }
}

export default async function Home() {
  // 1. Fetch Categories first (needed for analytics)
  const [productsCategories, paraCategories] = await Promise.all([
    getCategories("products"),
    getCategories("para"),
  ]);

  // 2. Fetch everything else in parallel
  const [
    pricesData,
    imprimanteProducts,
    refrigerateurProducts,
    machineProducts,
    laveVaisselleProducts,
    mamanProducts,
    solaireProducts,
    hygieneProducts,
    visageProducts,
    productsAllAnalytics,
    paraAllAnalytics,
    comparisonProducts
  ] = await Promise.all([
    getPrices(),
    getProducts("Imprimante", "low_category"),
    getProducts("Refrigerateur", "subcategory"),
    getProducts("Machine à Laver", "subcategory"),
    getProducts("Lave Vaisselle", "subcategory"),
    getParaProducts("Maman et bébé", "top"),
    getParaProducts("Solaire", "top"),
    getParaProducts("Hygiène", "top"),
    getParaProducts("Visage", "low"),
    getAllAnalytics("products", productsCategories),
    getAllAnalytics("para", paraCategories),
    getComparisonProducts(9)
  ]);

  const predictiveProduct = imprimanteProducts?.[0];

  return (
    <div className="flex flex-col min-h-screen bg-white font-[family-name:var(--font-geist-sans)]">
      <Header />
      <main className="flex-grow flex flex-col gap-8">


        <div className="max-w-7xl mx-auto w-full px-4">
          <HeroSection />



          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <SmartInfoCard
              videoSrc="/videos/vid1 .mp4"
            />
            <SmartInfoCard
              videoSrc="/videos/vid2.mp4"
            />
            <SmartInfoCard
              videoSrc="/videos/7579561-uhd_2160_4096_25fps.mp4"
            />
          </div>

          <PriceCards initialData={pricesData} />

          <CouffinTounsiSection />

          {/* Best Shop Section */}
          <div className="my-12">
            <BestShopSection />
          </div>

          {/* Category Price Comparison Tables */}
          <div className="mt-12 space-y-8">
            <ShopPriceComparisonTable
              type="products"
              title="Prix moyen par chaque catégorie - E-commerce"
              accentColor="purple"
              initialCategories={productsCategories}
              allAnalyticsData={productsAllAnalytics}
              pricesData={pricesData || []}
            />
            <ShopPriceComparisonTable
              type="para"
              title="Prix moyen par chaque catégorie - Parapharmacie"
              accentColor="teal"
              initialCategories={paraCategories}
              allAnalyticsData={paraAllAnalytics}
              pricesData={pricesData || []}
            />
          </div>



          <div className="mt-25">
            {/* Supermarket Essentials Section */}
            <SupermarketEssentials />
          </div>


          <ProductShowcase
            defaultCategory="Imprimante"
            categoryType="low_category"
            categories={imprimanteCategories}
            bannerImage="/images/imprimente.png"
            bannerText="Imprimantes"
            initialProducts={imprimanteProducts}
            showDecorativeHeaders={true}
          />
          <ProductShowcase
            defaultCategory="Refrigerateur"
            categoryType="subcategory"
            categories={refrigerateurCategories}
            bannerImage="/images/electromenager.png"
            bannerText="Électroménager"
            initialProducts={refrigerateurProducts}
          />
          <ProductShowcase
            defaultCategory="Machine à Laver"
            categoryType="subcategory"
            categories={machineALaverCategories}
            bannerImage="/images/lavage.png"
            bannerText="Lavage"
            initialProducts={machineProducts}
          />
          <ProductShowcase
            defaultCategory="Lave Vaisselle"
            categoryType="subcategory"
            categories={laveVaisselleCategories}
            bannerImage="/images/cuisine.png"
            bannerText="Cuisine"
            initialProducts={laveVaisselleProducts}
          />



          {/* Parapharmacie Section */}
          <div className="max-w-7xl mx-auto w-full px-4 pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-3xl md:text-5xl font-black text-[#0D9488] tracking-tight">
                Parapharmacie: <span className="text-[#2563EB]">Comparez les Prix</span>
              </h2>
              <p className="text-gray-500 mt-2">
                Trouvez les meilleurs prix parmi Parashop, Pharma Shop et Parafendri
              </p>
            </div>
            <div className="relative w-72 h-32 md:w-[530px] md:h-64 shrink-0">
              <img
                src="/images/Gemini_Generated_Image_sca15ssca15ssca1 1.svg"
                alt="Logo Parapharmacie"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <ParaProductShowcase
            defaultCategory="Maman et bébé"
            categoryType="top"
            bannerText="Maman & Bébé"
            initialProducts={mamanProducts}
          />
          <ParaProductShowcase
            defaultCategory="Solaire"
            categoryType="top"
            bannerText="Solaire"
            initialProducts={solaireProducts}
          />
          <ParaProductShowcase
            defaultCategory="Hygiène"
            categoryType="top"
            bannerText="Hygiène"
            initialProducts={hygieneProducts}
          />
          <ParaProductShowcase
            defaultCategory="Visage"
            categoryType="low"
            bannerText="Soins Visage"
            initialProducts={visageProducts}
          />

        </div> {/* End of max-w-7xl from line 204 */}

        <SupermarketComparison products={comparisonProducts} />

        <div className="max-w-7xl mx-auto w-full px-4">
          <FakePriceAlerts />
          <PriceVariationAlert product={predictiveProduct} />
          {/*<PriceIncreasePrediction />*/}
        </div>



      </main>
      <Footer />
    </div>
  );
}
