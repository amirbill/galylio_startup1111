import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion",
  description:
    "Connectez-vous à votre compte 1111.tn pour comparer les prix, suivre vos produits favoris et recevoir des alertes de prix en Tunisie.",
  alternates: {
    canonical: "/signin",
  },
  openGraph: {
    title: "Connexion — 1111.tn",
    description:
      "Connectez-vous à votre compte 1111.tn pour comparer les prix en Tunisie.",
    url: "/signin",
  },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
