import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bientôt Disponible",
  description:
    "La première plateforme tunisienne de comparaison de prix intelligente. Trouvez les meilleurs prix, traquez les fausses promotions, et économisez. Bientôt sur 1111.tn.",
  alternates: {
    canonical: "/coming-soon",
  },
  openGraph: {
    title: "1111.tn — Bientôt Disponible",
    description:
      "La première plateforme tunisienne de comparaison de prix intelligente arrive bientôt.",
    url: "/coming-soon",
  },
};

export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
