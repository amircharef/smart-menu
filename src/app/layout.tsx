import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Smart Menu — Commande digitale pour restaurants",
    template: "%s — Smart Menu",
  },
  description:
    "Menu digital et commande par QR code pour restaurants : le client scanne, commande depuis sa table, la cuisine suit en direct.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Smart Menu",
    title: "Smart Menu — Commande digitale pour restaurants",
    description:
      "Menu digital et commande par QR code pour restaurants : le client scanne, commande depuis sa table, la cuisine suit en direct.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
