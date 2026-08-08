import type { Metadata } from "next";
import { IBM_Plex_Mono, Newsreader, Public_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DonateButton from "@/components/DonateButton";
import DonateWelcomeModal from "@/components/DonateWelcomeModal";
import GuestHintBar from "@/components/GuestHintBar";
import Heartbeat from "@/components/Heartbeat";
import ToastContainer from "@/components/Toast";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { manilaDateString, parseSqliteUtc } from "@/lib/date";
import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

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

function shouldShowDonatePopup(lastShown: string | null | undefined): boolean {
  if (!lastShown) return true;
  const lastShownManila = manilaDateString(parseSqliteUtc(lastShown));
  return lastShownManila !== manilaDateString();
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [config, user] = await Promise.all([getSiteConfig(), getSessionUser()]);
  const showDonatePopup = !!user && shouldShowDonatePopup(user.donate_popup_last_shown_at);

  return (
    <html lang="en" className={`${newsreader.variable} ${publicSans.variable} ${plexMono.variable}`}>
      <head>
        <script src="https://js.hcaptcha.com/1/api.js" async defer></script>
      </head>
      <body className="min-h-screen flex flex-col" style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-gold-400 focus:text-navy-950 focus:px-4 focus:py-2 focus:rounded-[3px] focus:font-mono focus:text-[13px]"
        >
          Skip to main content
        </a>
        <Nav />
        <main id="main-content" className="flex-1 pb-10" tabIndex={-1}>{children}</main>
        <Footer />
        {!user && <GuestHintBar />}
        <DonateButton paypalLink={config.paypal_link || "https://paypal.me/PhillipWendyll"} gcashNumber={config.gcash_number || ""} />
        {user && (
          <DonateWelcomeModal
            shouldShow={showDonatePopup}
            paypalLink={config.paypal_link || "https://paypal.me/PhillipWendyll"}
            gcashNumber={config.gcash_number || ""}
          />
        )}
        <ToastContainer />
        <Heartbeat />
      </body>
    </html>
  );
}
