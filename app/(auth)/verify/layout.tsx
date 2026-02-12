import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vérification de l'email",
  description: "Vérifiez votre adresse email pour activer votre compte 1111.tn.",
  robots: { index: false, follow: false },
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
