import type { Metadata } from "next";
import { IBM_Plex_Mono, Newsreader, Public_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Thrive — Foundation for Filipino VAs",
    template: "%s — Thrive",
  },
  description:
    "A structured roadmap, practical tools, and scam protection for aspiring and current Filipino Virtual Assistants.",
  openGraph: {
    title: "Thrive — Foundation for Filipino VAs",
    description:
      "A structured roadmap, practical tools, and scam protection for aspiring and current Filipino Virtual Assistants.",
    url: "https://thrive-ph.vercel.app",
    siteName: "Thrive",
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thrive — Foundation for Filipino VAs",
    description:
      "A structured roadmap, practical tools, and scam protection for aspiring and current Filipino Virtual Assistants.",
  },
  metadataBase: new URL("https://thrive-ph.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${publicSans.variable} ${plexMono.variable}`}>
      <head>
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
      </head>
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
