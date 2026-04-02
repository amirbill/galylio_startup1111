'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, AlertCircle, Tag, ChevronRight, Sparkles, Star, ShoppingBag } from 'lucide-react';
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
  originalPrice?: number;
  image: string;
  category?: string;
  topCategory?: string;
  type?: 'product' | 'para';
  rating?: number;
  reviews?: number;
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
      className="group relative p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all duration-300 cursor-pointer hover:shadow-md block"
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
          <h4 className="text-[11px] font-semibold text-slate-900 leading-snug mb-1 group-hover:text-purple transition-colors line-clamp-2">
            {item.title}
          </h4>
          <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">
            {item.summary}
          </p>
        </div>
      </div>
      <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300 group-hover:text-slate-500 transition-colors" />
    </a>
  );
}

function getSeedValue(product: RandomProduct): number {
  return `${product.id}-${product.name}`
    .split('')
    .reduce((total, char) => total + char.charCodeAt(0), 0);
}

function getProductRating(product: RandomProduct): number {
  if (product.rating) {
    return product.rating;
  }

  const seed = getSeedValue(product);
  return 4.5 + (seed % 5) / 10;
}

function getProductReviews(product: RandomProduct): number {
  if (product.reviews) {
    return product.reviews;
  }

  const seed = getSeedValue(product);
  return 50 + (seed % 200);
}

function ProductCard({ product }: { product: RandomProduct }) {
  const href = product.type === 'para'
    ? `/para/${product.id}`
    : `/products/${product.id}`;
  const rating = getProductRating(product);
  const reviews = getProductReviews(product);

  return (
    <Link
      href={href}
      className="group relative bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300 cursor-pointer block"
    >
      {/* Product Image */}
      <div className="relative h-32 overflow-hidden bg-slate-50">
        <Image
          src={product.image || getProductFallbackImage(product.name)}
          alt={product.name}
          fill
          className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
        />
        {product.originalPrice && product.originalPrice > product.bestPrice && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-[10px] font-bold z-10">
            -{Math.round(((product.originalPrice - product.bestPrice) / product.originalPrice) * 100)}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        {/* Brand */}
        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">
          {product.brand}
        </p>

        {/* Product Name */}
        <h4 className="text-[11px] font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-slate-700">
          {product.name}
        </h4>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-400 ml-1">({reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-sm font-bold text-purple">
            {product.bestPrice?.toFixed(3)} DT
          </span>
          {product.originalPrice && (
            <span className="text-[10px] text-slate-400 line-through">
              {product.originalPrice.toFixed(3)} DT
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button className="w-full py-1.5 bg-purple text-purple-foreground hover:bg-purple/90 text-[10px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm">
          <ShoppingBag size={12} />
          Voir l&apos;offre
        </button>
      </div>
    </Link>
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200 p-3 animate-pulse">
      <div className="h-32 bg-slate-100 rounded-lg mb-3" />
      <div className="h-2 bg-slate-100 rounded w-1/3 mb-2" />
      <div className="h-3 bg-slate-100 rounded w-full mb-1" />
      <div className="h-3 bg-slate-100 rounded w-2/3 mb-3" />
      <div className="h-2 bg-slate-100 rounded w-1/4 mb-3" />
      <div className="h-8 bg-slate-100 rounded w-full" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface SideBannerProps {
  side: 'left' | 'right';
  initialProducts?: RandomProduct[];
}

export function SideBanner({ side, initialProducts }: SideBannerProps) {
  const isLeft = side === 'left';
  const sideStyle = isLeft
    ? { left: 'max(32px, calc((100vw - 1600px) / 2 + 32px))' }
    : { right: 'max(32px, calc((100vw - 1600px) / 2 + 32px))' };

  const [isVisible, setIsVisible] = useState(false);
  const [yOffset, setYOffset] = useState(0);
  const [products, setProducts] = useState<RandomProduct[]>(initialProducts || []);
  const [loadingProducts, setLoadingProducts] = useState(!initialProducts && !isLeft);
  const displayedProducts = initialProducts && initialProducts.length > 0 ? initialProducts : products;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    
    const handleScroll = () => {
      const footer = document.querySelector('footer');
      const aside = document.querySelector(`aside.${side === 'left' ? 'left-side' : 'right-side'}`);
      
      if (footer && aside) {
        const footerTop = footer.getBoundingClientRect().top;
        const asideRect = aside.getBoundingClientRect();
        
        // Remove current transform from height calculation if necessary, 
        // but rect.height is usually stable.
        const asideHeight = asideRect.height;
        
        // The banner starts at top-24 (96px)
        const naturalTop = 96; 
        const naturalBottom = naturalTop + asideHeight;
        
        // Increase buffer to 48px for better clearance
        const buffer = 48;
        
        if (footerTop < naturalBottom + buffer) {
          setYOffset(footerTop - (naturalBottom + buffer));
        } else {
          setYOffset(0);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [side]);

  useEffect(() => {
    if (!isLeft && (!initialProducts || initialProducts.length === 0)) {
      const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
          const [prodRes, paraRes] = await Promise.all([
            fetch(`${API_URL}/products/listing?limit=20`),
            fetch(`${API_URL}/para/listing?limit=10`),
          ]);

          const prodData = prodRes.ok ? await prodRes.json() : { products: [] };
          const paraData = paraRes.ok ? await paraRes.json() : { products: [] };

          const allProds: RandomProduct[] = (prodData.products || []).map((p: RandomProduct) => ({
            ...p,
            type: 'product' as const,
            rating: p.rating || (4.5 + Math.random() * 0.5),
            reviews: p.reviews || (Math.floor(Math.random() * 200) + 50)
          }));
          const allPara: RandomProduct[] = (paraData.products || []).map((p: RandomProduct) => ({
            ...p,
            type: 'para' as const,
            rating: p.rating || (4.5 + Math.random() * 0.5),
            reviews: p.reviews || (Math.floor(Math.random() * 200) + 50)
          }));

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
  }, [initialProducts, isLeft]);

  return (
    <aside
      style={{ ...sideStyle, transform: `translateY(${yOffset}px)` }}
      className={`
        hidden md:block
        fixed top-24 z-30
        ${side === 'left' ? 'left-side' : 'right-side'}
        w-36 xl:w-48 2xl:w-56 max-h-[calc(100vh-120px)]
        transition-all duration-100 ease-out
        ${isVisible
          ? 'opacity-100 translate-x-0'
          : isLeft
            ? 'opacity-0 -translate-x-8'
            : 'opacity-0 translate-x-8'
        }
      `}
    >
      <div className="space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide pr-2">
        {/* Header */}
        <div className="mb-2">
          <h3 className="text-lg font-bold text-slate-900 mb-0.5">
            {isLeft ? 'Infos Générales' : 'Produits du Moment'}
          </h3>
          <p className="text-xs text-slate-500">
            {isLeft ? 'Actualités & Alertes shopping' : 'Les articles les plus populaires cette semaine'}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {isLeft
            ? sectionLinks.map((item) => <InfoCard key={item.id} item={item} />)
            : loadingProducts
              ? Array.from({ length: 3 }).map((_, i) => <ProductSkeleton key={i} />)
              : displayedProducts.map((p) => <ProductCard key={p.id} product={p} />)
          }
        </div>

        {/* View All Link */}
        <div className="pt-2">
          {isLeft ? (
            <a
              href="#hero"
              className="w-full text-center text-xs text-purple hover:text-purple/80 font-bold py-2 block border-t border-slate-100 mt-2"
            >
              ↑ Retour en haut
            </a>
          ) : (
            <Link
              href="/products"
              className="w-full text-center text-xs text-purple hover:text-purple/80 font-bold py-2 block border-t border-slate-100 mt-2"
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
