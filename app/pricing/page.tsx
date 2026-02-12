import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tarifs — Plans et Abonnements',
  description:
    'Découvrez nos plans tarifaires sur 1111.tn. Gratuit, Pro, Business — choisissez le plan adapté à vos besoins de comparaison de prix en Tunisie.',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Tarifs — 1111.tn',
    description:
      'Plans et tarifs pour la comparaison de prix en Tunisie.',
    url: '/pricing',
  },
};
import { Check, X, Zap, Building2, Rocket, Crown, ArrowRight, Shield, Clock, Users, TrendingDown, Bell, BarChart3, Download, Headphones } from 'lucide-react';

const plans = [
    {
        name: "Gratuit",
        description: "Pour les particuliers qui comparent occasionnellement",
        price: "0",
        period: "pour toujours",
        icon: Zap,
        color: "slate",
        popular: false,
        features: [
            { name: "Comparaison de prix en temps réel", included: true },
            { name: "Accès à 50K+ produits", included: true },
            { name: "Recherche basique", included: true },
            { name: "Historique 7 jours", included: true },
            { name: "Alertes prix (3 max)", included: true },
            { name: "Support email", included: false },
            { name: "API Access", included: false },
            { name: "Rapports avancés", included: false },
            { name: "Export de données", included: false },
        ],
        cta: "Commencer gratuitement",
        ctaLink: "/",
    },
    {
        name: "Pro",
        description: "Pour les acheteurs réguliers et les petites entreprises",
        price: "99",
        period: "/mois",
        icon: Rocket,
        color: "purple",
        popular: true,
        features: [
            { name: "Comparaison de prix en temps réel", included: true },
            { name: "Accès à 50K+ produits", included: true },
            { name: "Recherche avancée + filtres", included: true },
            { name: "Historique 90 jours", included: true },
            { name: "Alertes prix illimitées", included: true },
            { name: "Support prioritaire", included: true },
            { name: "API Access (1000 req/jour)", included: true },
            { name: "Rapports hebdomadaires", included: true },
            { name: "Export CSV/Excel", included: false },
        ],
        cta: "Essai gratuit 14 jours",
        ctaLink: "/signup?plan=pro",
    },
    {
        name: "Business",
        description: "Pour les entreprises et les revendeurs",
        price: "199",
        period: "/mois",
        icon: Building2,
        color: "teal",
        popular: false,
        features: [
            { name: "Comparaison de prix en temps réel", included: true },
            { name: "Accès à 50K+ produits", included: true },
            { name: "Recherche avancée + filtres", included: true },
            { name: "Historique illimité", included: true },
            { name: "Alertes prix illimitées", included: true },
            { name: "Support dédié 24/7", included: true },
            { name: "API Access illimité", included: true },
            { name: "Rapports personnalisés", included: true },
            { name: "Export tous formats", included: true },
            { name: "Nombre des sites : 5", included: true },
        ],
        cta: "Contacter les ventes",
        ctaLink: "/contact?plan=business",
    },
    {
        name: "Entreprise",
        description: "Solution sur mesure pour les grandes organisations",
        price: "Sur devis",
        period: "",
        icon: Crown,
        color: "amber",
        popular: false,
        features: [
            { name: "Tout de Business +", included: true },
            { name: "Intégration ERP/CRM", included: true },
            { name: "Dashboard personnalisé", included: true },
            { name: "SLA garanti 99.9%", included: true },
            { name: "Formation équipe", included: true },
            { name: "Account Manager dédié", included: true },
            { name: "Données en temps réel", included: true },
            { name: "Analyse prédictive IA", included: true },
            { name: "White-label disponible", included: true },
            { name: "Nombre des sites : illimité ", included: true },
            { name: "Surveillance du Marché", included: true }
        ],
        cta: "Demander un devis",
        ctaLink: "/contact?plan=enterprise",
    },
];

const features = [
    {
        icon: TrendingDown,
        title: "Économies garanties",
        description: "Économisez en moyenne 40% sur vos achats grâce à notre comparaison en temps réel",
    },
    {
        icon: Bell,
        title: "Alertes intelligentes",
        description: "Recevez des notifications instantanées quand les prix baissent sur vos produits favoris",
    },
    {
        icon: BarChart3,
        title: "Analytics avancés",
        description: "Analysez les tendances de prix et prenez des décisions d'achat éclairées",
    },
    {
        icon: Download,
        title: "Export de données",
        description: "Exportez vos rapports en CSV, Excel ou PDF pour vos analyses",
    },
    {
        icon: Shield,
        title: "Données sécurisées",
        description: "Vos données sont protégées avec un chiffrement de niveau bancaire",
    },
    {
        icon: Headphones,
        title: "Support réactif",
        description: "Notre équipe est disponible pour vous aider à optimiser votre expérience",
    },
];

const faqs = [
    {
        question: "Puis-je changer de plan à tout moment ?",
        answer: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement et sont calculés au prorata.",
    },
    {
        question: "Y a-t-il une période d'essai gratuite ?",
        answer: "Oui, tous nos plans payants incluent un essai gratuit de 14 jours sans engagement. Aucune carte bancaire requise.",
    },
    {
        question: "Comment fonctionne l'API ?",
        answer: "Notre API RESTful vous permet d'accéder à toutes nos données de prix en temps réel. Documentation complète disponible.",
    },
    {
        question: "Quels modes de paiement acceptez-vous ?",
        answer: "Nous acceptons les cartes bancaires (Visa, Mastercard), les virements bancaires et le paiement mobile (D17, Flouci).",
    },
];

export default function PricingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
                        <div className="absolute bottom-20 right-10 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm mb-6">
                            <Zap className="size-4 text-amber-400" />
                            Plans flexibles pour tous les besoins
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                            Choisissez votre plan
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            Des solutions adaptées aux particuliers comme aux entreprises.
                            Commencez gratuitement et évoluez selon vos besoins.
                        </p>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="relative -mt-10 pb-20">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {plans.map((plan) => {
                                const IconComponent = plan.icon;
                                const colorClasses: Record<string, { bg: string; border: string; text: string; button: string }> = {
                                    slate: { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-600", button: "bg-slate-900 hover:bg-slate-800" },
                                    purple: { bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-600", button: "bg-purple-600 hover:bg-purple-700" },
                                    teal: { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-600", button: "bg-teal-600 hover:bg-teal-700" },
                                    amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600", button: "bg-amber-600 hover:bg-amber-700" },
                                };
                                const colors = colorClasses[plan.color];

                                return (
                                    <div
                                        key={plan.name}
                                        className={`relative rounded-3xl bg-white border-2 ${plan.popular ? 'border-purple-400 shadow-xl shadow-purple-100' : 'border-slate-200'} p-6 flex flex-col`}
                                    >
                                        {plan.popular && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs font-bold rounded-full">
                                                Plus populaire
                                            </div>
                                        )}

                                        {/* Header */}
                                        <div className={`w-12 h-12 rounded-2xl ${colors.bg} flex items-center justify-center mb-4`}>
                                            <IconComponent className={`size-6 ${colors.text}`} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                                        <p className="text-sm text-slate-500 mt-1">{plan.description}</p>

                                        {/* Price */}
                                        <div className="mt-6 mb-6">
                                            <span className="text-4xl font-black text-slate-900">
                                                {plan.price === "Sur devis" ? "" : `${plan.price} DT`}
                                            </span>
                                            {plan.price === "Sur devis" ? (
                                                <span className="text-2xl font-bold text-slate-900">Sur devis</span>
                                            ) : (
                                                <span className="text-slate-500">{plan.period}</span>
                                            )}
                                        </div>

                                        {/* Features */}
                                        <ul className="space-y-3 flex-grow">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    {feature.included ? (
                                                        <Check className="size-5 text-green-500 shrink-0 mt-0.5" />
                                                    ) : (
                                                        <X className="size-5 text-slate-300 shrink-0 mt-0.5" />
                                                    )}
                                                    <span className={feature.included ? "text-slate-700 text-sm" : "text-slate-400 text-sm"}>
                                                        {feature.name}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* CTA */}
                                        <Link
                                            href={plan.ctaLink}
                                            className={`mt-6 w-full py-3 px-4 rounded-xl text-white font-semibold text-center transition-colors ${colors.button}`}
                                        >
                                            {plan.cta}
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-20 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                                Tout ce dont vous avez besoin
                            </h2>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                Des fonctionnalités puissantes pour optimiser vos achats et économiser du temps et de l&apos;argent.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, idx) => {
                                const IconComponent = feature.icon;
                                return (
                                    <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-teal-100 flex items-center justify-center mb-4">
                                            <IconComponent className="size-6 text-purple-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                                        <p className="text-slate-600 text-sm">{feature.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20">
                    <div className="max-w-3xl mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                                Questions fréquentes
                            </h2>
                            <p className="text-slate-600">
                                Vous avez des questions ? Nous avons les réponses.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.question}</h3>
                                    <p className="text-slate-600">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-red-600 to-red-500">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                            Prêt à économiser ?
                        </h2>
                        <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
                            Rejoignez des milliers de Tunisiens qui économisent chaque jour grâce à 111.tn
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-red-600 font-bold rounded-full hover:bg-red-50 transition-colors"
                            >
                                Commencer maintenant
                                <ArrowRight className="size-5" />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white font-bold rounded-full border-2 border-white/50 hover:bg-white/10 transition-colors"
                            >
                                Nous contacter
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
