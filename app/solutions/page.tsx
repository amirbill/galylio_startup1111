import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Solutions — Outils de Comparaison de Prix",
    description:
        "Découvrez les solutions de 1111.tn : comparaison de prix, détection de fausses promotions, alertes de prix, suivi de produits en Tunisie.",
    alternates: {
        canonical: "/solutions",
    },
    openGraph: {
        title: "Solutions — 1111.tn",
        description:
            "Nos outils intelligents pour comparer les prix et détecter les fausses promotions en Tunisie.",
        url: "/solutions",
    },
};
import {
    TrendingDown,
    Search,
    Bell,
    Shield,
    Zap,
    Users,
    BarChart3,
    Globe,
    CheckCircle,
    ArrowRight,
    Sparkles,
    Target,
    Clock,
    Wallet
} from "lucide-react"

const features = [
    {
        icon: <Search className="size-6" />,
        title: "Recherche Intelligente",
        description: "Trouvez instantanément n'importe quel produit parmi des milliers de références dans les boutiques tunisiennes.",
        color: "from-blue-500 to-indigo-500"
    },
    {
        icon: <TrendingDown className="size-6" />,
        title: "Comparaison de Prix",
        description: "Comparez les prix en temps réel entre Spacenet, Mytek, Tunisianet, TechnoPro, Darty, Parashop, Pharma-Shop et bien d'autres.",
        color: "from-green-500 to-emerald-500"
    },
    {
        icon: <Bell className="size-6" />,
        title: "Alertes Prix",
        description: "Recevez des notifications quand le prix de vos produits favoris baisse dans une boutique.",
        color: "from-orange-500 to-red-500"
    },
    {
        icon: <Shield className="size-6" />,
        title: "Détection Prix Mensongers",
        description: "Notre algorithme identifie les fausses promotions avec des prix d'origine artificiellement gonflés.",
        color: "from-red-500 to-pink-500"
    },
    {
        icon: <BarChart3 className="size-6" />,
        title: "Historique des Prix",
        description: "Visualisez l'évolution des prix sur plusieurs mois pour acheter au meilleur moment.",
        color: "from-blue-500 to-cyan-500"
    },
    {
        icon: <Zap className="size-6" />,
        title: "Prédiction de Prix",
        description: "Notre IA prédit les hausses de prix imminentes pour vous aider à économiser.",
        color: "from-yellow-500 to-orange-500"
    }
]

const stats = [
    { value: "50K+", label: "Produits suivis", icon: <Target className="size-5" /> },
    { value: "10+", label: "Boutiques partenaires", icon: <Globe className="size-5" /> },
    { value: "40%", label: "Économies moyennes", icon: <Wallet className="size-5" /> },
    { value: "24/7", label: "Mise à jour des prix", icon: <Clock className="size-5" /> }
]

const categories = [
    {
        name: "Électronique & High-Tech",
        shops: ["Spacenet", "Mytek", "Tunisianet", "TechnoPro", "Darty"],
        items: ["PC Portables", "Smartphones", "Téléviseurs", "Électroménager"],
        color: "bg-blue-500"
    },
    {
        name: "Parapharmacie",
        shops: ["Parashop", "Pharma-Shop", "Parafendri"],
        items: ["Soins Visage", "Hygiène", "Bébé & Maman", "Solaire"],
        color: "bg-teal-500"
    },
    {
        name: "Supermarchés",
        shops: ["Monoprix", "Carrefour", "Géant"],
        items: ["Alimentation", "Produits frais", "Épicerie", "Boissons"],
        color: "bg-orange-500"
    }
]

export default function SolutionsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 size-80 bg-blue-200 rounded-full blur-3xl opacity-30" />
                    <div className="absolute -bottom-40 -left-40 size-80 bg-teal-200 rounded-full blur-3xl opacity-30" />
                </div>

                <div className="relative max-w-6xl mx-auto px-4">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
                            <Sparkles className="size-4" />
                            Plateforme de Comparaison de Prix #1 en Tunisie
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                            Économisez sur{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                                chaque achat
                            </span>
                            <br />en Tunisie
                        </h1>

                        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                            111.tn compare les prix de milliers de produits dans les meilleures boutiques tunisiennes
                            pour vous aider à trouver les meilleures offres en quelques secondes.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/products"
                                className="group inline-flex items-center gap-3 px-8 py-3 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                <span>Comparer les Prix</span>
                                <span className="flex items-center justify-center w-5 h-5 bg-white/20 rounded-full group-hover:bg-white/30 transition-all duration-300">
                                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                                </span>
                            </Link>
                            <Link
                                href="/para"
                                className="group inline-flex items-center gap-3 px-8 py-3 bg-white text-slate-700 text-sm font-medium rounded-full border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300"
                            >
                                <span>Explorer Parapharmacie</span>
                                <span className="flex items-center justify-center w-5 h-5 bg-slate-100 rounded-full group-hover:bg-slate-200 transition-all duration-300">
                                    <ArrowRight className="size-3.5 text-slate-500 transition-transform duration-300 group-hover:translate-x-0.5" />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white border-y border-slate-100">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="inline-flex items-center justify-center size-12 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl mb-4 text-blue-600">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-slate-600 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                            Fonctionnalités Puissantes
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Des outils intelligents pour vous aider à prendre les meilleures décisions d&apos;achat
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                            >
                                <div className={`inline-flex items-center justify-center size-14 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                            Catégories Couvertes
                        </h2>
                        <p className="text-lg text-slate-600">
                            Nous comparons les prix dans les principales boutiques tunisiennes
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {categories.map((category, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-all"
                            >
                                <div className={`inline-flex items-center justify-center size-4 rounded-full ${category.color} mb-6`} />
                                <h3 className="text-xl font-bold text-slate-900 mb-4">
                                    {category.name}
                                </h3>

                                <div className="mb-6">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        Boutiques
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {category.shops.map((shop, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-slate-700"
                                            >
                                                {shop}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        Produits
                                    </p>
                                    <ul className="space-y-2">
                                        {category.items.map((item, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                                <CheckCircle className="size-4 text-green-500" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-3xl p-10 md:p-16 text-white text-center relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 size-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 size-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-black mb-6">
                                Notre Mission
                            </h2>
                            <p className="text-lg md:text-xl opacity-90 leading-relaxed mb-8">
                                Aider les consommateurs tunisiens à faire des achats intelligents en leur donnant
                                accès à une comparaison de prix transparente et en temps réel. Nous croyons que
                                chaque dinar compte et que vous méritez de connaître le meilleur prix disponible.
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <div className="size-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <Users className="size-6" />
                                </div>
                                <p className="text-sm opacity-80">
                                    Développé en Tunisie, pour les Tunisiens 🇹🇳
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
                        Prêt à Économiser?
                    </h2>
                    <p className="text-lg text-slate-600 mb-10">
                        Commencez à comparer les prix maintenant et trouvez les meilleures offres
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/products"
                            className="group inline-flex items-center gap-3 px-8 py-3 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            <span>Rechercher un Produit</span>
                            <span className="flex items-center justify-center w-5 h-5 bg-white/20 rounded-full group-hover:bg-white/30 transition-all duration-300">
                                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </span>
                        </Link>
                        <Link
                            href="/"
                            className="group inline-flex items-center gap-3 px-8 py-3 bg-white text-slate-700 text-sm font-medium rounded-full border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300"
                        >
                            <span>Retour à l&apos;Accueil</span>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
