import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription",
  description:
    "Créez votre compte gratuit sur 1111.tn pour comparer les prix en Tunisie, suivre l'historique des prix et recevoir des alertes de promotions.",
  alternates: {
    canonical: "/signup",
  },
  openGraph: {
    title: "Inscription — 1111.tn",
    description:
      "Créez votre compte gratuit sur 1111.tn pour comparer les prix en Tunisie.",
    url: "/signup",
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
