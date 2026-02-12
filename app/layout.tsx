import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { BagProvider } from "@/contexts/BagContext";
import { GoogleProvider } from "@/components/providers/GoogleProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://1111.tn";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "1111.tn — Comparateur de Prix Tunisie | Meilleurs Prix en Ligne",
    template: "%s | 1111.tn",
  },
  description:
    "Comparez les prix en Tunisie sur 1111.tn. Trouvez les meilleurs prix pour électroménager, informatique, parapharmacie. Détectez les fausses promotions et économisez.",
  keywords: [
    "comparateur de prix tunisie",
    "meilleur prix tunisie",
    "comparaison prix",
    "prix électroménager tunisie",
    "prix informatique tunisie",
    "prix parapharmacie tunisie",
    "fausses promotions tunisie",
    "1111.tn",
    "مقارنة الأسعار تونس",
    "أفضل سعر تونس",
    "mytek prix",
    "tunisianet prix",
    "spacenet prix",
  ],
  authors: [{ name: "1111.tn" }],
  creator: "1111.tn",
  publisher: "1111.tn",
  openGraph: {
    type: "website",
    locale: "fr_TN",
    url: BASE_URL,
    siteName: "1111.tn",
    title: "1111.tn — Comparateur de Prix Tunisie",
    description:
      "La première plateforme tunisienne de comparaison de prix intelligente. Trouvez les meilleurs prix, traquez les fausses promotions, et économisez.",
    images: [
      {
        url: `${BASE_URL}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: "1111.tn — Comparateur de Prix Tunisie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "1111.tn — Comparateur de Prix Tunisie",
    description:
      "Comparez les prix en Tunisie. Trouvez les meilleurs prix, détectez les fausses promotions.",
    images: [`${BASE_URL}/images/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    // Replace with your actual verification codes
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
    // yandex: "YOUR_YANDEX_CODE",
  },
};

import { getUserFromServer } from "@/lib/auth-server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserFromServer();

  return (
    <html lang="fr" dir="ltr">
      <head>
        <link rel="canonical" href={BASE_URL} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "1111.tn",
              url: BASE_URL,
              description:
                "Comparateur de prix en Tunisie — Trouvez les meilleurs prix pour électroménager, informatique et parapharmacie.",
              potentialAction: {
                "@type": "SearchAction",
                target: `${BASE_URL}/products?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleProvider>
          <AuthProvider initialUser={user}>
            <BagProvider>
              {children}
            </BagProvider>
          </AuthProvider>
        </GoogleProvider>
      </body>
    </html>
  );
}

