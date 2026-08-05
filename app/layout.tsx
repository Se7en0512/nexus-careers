import type { Metadata } from "next";
import { IBM_Plex_Mono, Newsreader, Public_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MarqueeBar from "@/components/MarqueeBar";
import DonateButton from "@/components/DonateButton";
import { db } from "@/lib/db";

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

async function getSiteConfig(): Promise<Record<string, string>> {
  try {
    const rows = (await db.prepare("SELECT key, value FROM site_config").all()) as Array<{ key: string; value: string }>;
    const config: Record<string, string> = {};
    for (const r of rows) config[r.key] = r.value;
    return config;
  } catch {
    return {};
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const config = await getSiteConfig();

  return (
    <html lang="en" className={`${newsreader.variable} ${publicSans.variable} ${plexMono.variable}`}>
      <head>
        <script src="https://js.hcaptcha.com/1/api.js" async defer></script>
      </head>
      <body className="min-h-screen flex flex-col">
        <MarqueeBar text={config.marquee_text || ""} />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <DonateButton paypalLink={config.paypal_link || "https://paypal.me/PhillipWendyll"} />
      </body>
    </html>
  );
}
