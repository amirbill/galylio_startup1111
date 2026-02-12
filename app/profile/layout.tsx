import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon Profil",
  description: "Gérez votre profil et vos préférences sur 1111.tn.",
  robots: { index: false, follow: false },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
