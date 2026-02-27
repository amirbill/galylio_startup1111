'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Newspaper, BookOpen, TrendingUp, AlertCircle, Tag, Clock, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL } from '@/lib/api';
import { getProductFallbackImage } from '@/lib/product-fallback-image';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RandomProduct {
  id: string;
  name: string;
  brand: string;
  bestPrice: number;
  image: string;
  category?: string;
  topCategory?: string;
  type?: 'product' | 'para';
}

// ─── Static info cards (left banner) that link to page sections ──────────────

const sectionLinks = [
  {
    id: 1,
    category: 'Tendance',
    title: 'Prix moyen par site e-commerce',
    summary: 'Comparez les prix moyens par catégorie sur Mytek, Tunisianet, Spacenet…',
    href: '#prix-moyens',
    icon: TrendingUp,
    accentColor: '#EF4444',
  },
  {
    id: 2,
    category: 'Alerte',
    title: 'Faux prix détectés : méfiez-vous',
    summary: 'Notre IA surveille les hausses artificielles avant les soldes.',
    href: '#alertes-prix',
    icon: AlertCircle,
    accentColor: '#F59E0B',
  },
  {
    id: 3,
    category: 'Promo',
    title: 'Courses essentielles Tunisiennes',
    summary: 'Comparez le prix du couffin tounsi entre Monoprix, Carrefour et Géant.',
    href: '#couffin-tounsi',
    icon: Tag,
    accentColor: '#10B981',
  },
  {
    id: 4,
    category: 'Info',
    title: 'Meilleur magasin pour vos courses',
    summary: 'Trouvez quel supermarché vous fait le plus économiser ce mois-ci.',
    href: '#meilleur-magasin',
    icon: Sparkles,
    accentColor: '#2563EB',
  },
  {
    id: 5,
    category: 'Analyse',
    title: 'Comparatif Parapharmacie',
    summary: 'Parashop, Pharma Shop, Parafendri : qui est le moins cher ?',
    href: '#parapharmacie',
    icon: TrendingUp,
    accentColor: '#0D9488',
  },
  {
    id: 6,
    category: 'Prédiction',
    title: 'Alerte hausse de prix imminente',
    summary: 'Notre IA prédit les prochaines hausses pour que vous achetiez au bon moment.',
    href: '#prediction-prix',
    icon: AlertCircle,
    accentColor: '#8B5CF6',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoCard({ item }: { item: typeof sectionLinks[0] }) {
  const Icon = item.icon;
  return (
    <a
      href={item.href}
      className="group relative p-3 rounded-xl bg-white/60 hover:bg-white/90 border border-gray-100/80 hover:border-gray-200 transition-all duration-300 cursor-pointer hover:shadow-md block"
    >
      <div className="flex items-start gap-2.5">
        <div
          className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5"
          style={{ backgroundColor: `${item.accentColor}18` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: item.accentColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <span
            className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full inline-block mb-1"
            style={{ color: item.accentColor, backgroundColor: `${item.accentColor}12` }}
          >
            {item.category}
          </span>
          <h4 className="text-[11px] font-semibold text-gray-800 leading-snug mb-1 group-hover:text-[#2563EB] transition-colors line-clamp-2">
            {item.title}
          </h4>
          <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">
            {item.summary}
          </p>
        </div>
      </div>
      <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-300 group-hover:text-gray-500 transition-colors" />
    </a>
  );
}

function ProductCard({ product }: { product: RandomProduct }) {
  const href = product.type === 'para'
    ? `/para/${product.id}`
    : `/products/${product.id}`;

  const categoryColors: Record<string, string> = {
    'Électronique': '#8B5CF6',
    'PC': '#2563EB',
    'Téléphone': '#0D9488',
    'Électroménager': '#F59E0B',
    'Parapharmacie': '#10B981',
  };
  const colorKey = Object.keys(categoryColors).find(k =>
    (product.topCategory || product.category || '').includes(k)
  );
  const color = colorKey ? categoryColors[colorKey] : '#6B7280';

  return (
    <Link
      href={href}
      className="group relative p-3 rounded-xl bg-white/60 hover:bg-white/90 border border-gray-100/80 hover:border-gray-200 transition-all duration-300 hover:shadow-md flex items-center gap-2.5"
    >
      {/* Product image */}
      <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
        <Image
          src={product.image || getProductFallbackImage(product.name)}
          alt={product.name}
          width={40}
          height={40}
          className="object-contain w-full h-full p-0.5 group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <span
          className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full inline-block mb-0.5"
          style={{ color, backgroundColor: `${color}12` }}
        >
          {product.brand}
        </span>
        <p className="text-[11px] font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#8B5CF6] transition-colors">
          {product.name}
        </p>
        <p className="text-[11px] font-black text-[#EF4444] mt-0.5">
          {product.bestPrice?.toFixed(3)} <span className="text-[9px] font-bold">DT</span>
        </p>
      </div>
      <ArrowRight className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-300 group-hover:text-[#8B5CF6] transition-colors shrink-0" />
    </Link>
  );
}

function ProductSkeleton() {
  return (
    <div className="p-3 rounded-xl bg-white/60 border border-gray-100/80 flex items-center gap-2.5 animate-pulse">
      <div className="shrink-0 w-10 h-10 rounded-lg bg-gray-200" />
      <div className="flex-1 space-y-1.5">
        <div className="h-2 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface SideBannerProps {
  side: 'left' | 'right';
}

export function SideBanner({ side }: SideBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [products, setProducts] = useState<RandomProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const isLeft = side === 'left';

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLeft) {
      // Fetch a mix of random products using listing endpoints (no required params)
      const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
          const [prodRes, paraRes] = await Promise.all([
            fetch(`${API_URL}/products/listing?limit=20`),
            fetch(`${API_URL}/para/listing?limit=10`),
          ]);

          const prodData = prodRes.ok ? await prodRes.json() : { products: [] };
          const paraData = paraRes.ok ? await paraRes.json() : { products: [] };

          const allProds: RandomProduct[] = (prodData.products || []).map((p: RandomProduct) => ({ ...p, type: 'product' as const }));
          const allPara: RandomProduct[] = (paraData.products || []).map((p: RandomProduct) => ({ ...p, type: 'para' as const }));

          // Shuffle both lists and pick 2 electronics + 1 para
          const shuffledProds = allProds.sort(() => Math.random() - 0.5).slice(0, 2);
          const shuffledPara = allPara.sort(() => Math.random() - 0.5).slice(0, 1);

          const combined = [...shuffledProds, ...shuffledPara];
          setProducts(combined.length > 0 ? combined : allProds.slice(0, 3));
        } catch {
          setProducts([]);
        } finally {
          setLoadingProducts(false);
        }
      };
      fetchProducts();
    }
  }, [isLeft]);

  return (
    <aside
      ref={bannerRef}
      className={`
        hidden md:block
        sticky top-24 self-start
        w-full max-h-[calc(100vh-120px)]
        transition-all duration-700 ease-out
        ${isVisible
          ? 'opacity-100 translate-x-0'
          : isLeft
            ? 'opacity-0 -translate-x-8'
            : 'opacity-0 translate-x-8'
        }
      `}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
        {/* Header */}
        <div
          className={`relative px-4 py-3.5 ${isLeft
            ? 'bg-gradient-to-r from-[#2563EB] to-[#7C3AED]'
            : 'bg-gradient-to-r from-[#7C3AED] to-[#0D9488]'
            }`}
        >
          <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-white/10" />
          <div className="absolute -left-2 -bottom-2 w-10 h-10 rounded-full bg-white/5" />
          <div className="relative flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              {isLeft
                ? <Newspaper className="w-3.5 h-3.5 text-white" />
                : <BookOpen className="w-3.5 h-3.5 text-white" />
              }
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-tight">
                {isLeft ? 'Infos Générales' : 'Produits du Moment'}
              </h3>
              <p className="text-[9px] text-white/70 font-medium">
                {isLeft ? 'Actualités & Alertes' : 'Sélection aléatoire'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-2.5 space-y-2 max-h-[calc(100vh-240px)] overflow-y-auto scrollbar-hide">
          {isLeft
            ? sectionLinks.map((item) => <InfoCard key={item.id} item={item} />)
            : loadingProducts
              ? Array.from({ length: 5 }).map((_, i) => <ProductSkeleton key={i} />)
              : products.map((p) => <ProductCard key={p.id} product={p} />)
          }
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-gray-100/80">
          {isLeft ? (
            <a
              href="#hero"
              className="w-full text-center text-[10px] font-semibold py-1.5 rounded-lg transition-all duration-300 text-[#2563EB] hover:bg-[#2563EB]/5 block"
            >
              ↑ Retour en haut
            </a>
          ) : (
            <Link
              href="/products"
              className="w-full text-center text-[10px] font-semibold py-1.5 rounded-lg transition-all duration-300 text-[#7C3AED] hover:bg-[#7C3AED]/5 block"
            >
              Voir tous les produits →
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}

export default SideBanner;
