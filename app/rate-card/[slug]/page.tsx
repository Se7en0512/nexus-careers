import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import Logo from "@/components/Logo";

export const dynamic = "force-dynamic";

interface RateCardRow {
  headline: string;
  intro: string;
  currency: string;
  packages: string;
  faq: string;
  contact_note: string;
  updated_at: string;
}

interface RateCardPackage {
  name: string;
  price: number;
  unit: string;
  description: string;
  features: string[];
}

interface RateCardFaq {
  question: string;
  answer: string;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  PHP: "₱",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
  CAD: "C$",
};

function formatPrice(price: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency + " ";
  return `${symbol}${price.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const row = (await db.prepare("SELECT headline FROM rate_cards WHERE slug = ?").get(slug)) as
    | { headline: string }
    | undefined;
  if (!row) return { title: "Rate Card" };
  return {
    title: `${row.headline} — Rate Card`,
    description: row.headline,
    openGraph: { title: `${row.headline} — Rate Card`, type: "profile" },
  };
}

export default async function PublicRateCardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = (await db.prepare("SELECT * FROM rate_cards WHERE slug = ?").get(slug)) as RateCardRow | undefined;
  if (!row) notFound();

  let packages: RateCardPackage[] = [];
  let faq: RateCardFaq[] = [];
  try { packages = JSON.parse(row.packages); } catch { packages = []; }
  try { faq = JSON.parse(row.faq); } catch { faq = []; }

  const updated = new Date(row.updated_at + "Z").toLocaleDateString("en-PH", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-950 py-16 px-8">
      <div className="max-w-[760px] mx-auto">
        <div className="flex items-center justify-between mb-14">
          <div className="flex items-center gap-3">
            <Logo size={26} />
            <span className="font-mono font-semibold text-[13px] tracking-[0.06em] uppercase text-gray-500">
              Thrive · Rate Card
            </span>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-[3px] p-10">
          <h1 className="font-serif font-medium text-[clamp(30px,4vw,44px)] mb-3 text-white">{row.headline}</h1>
          {row.intro && <p className="text-[16.5px] leading-relaxed max-w-[560px] text-gray-400">{row.intro}</p>}

          {/* Packages */}
          {packages.length > 0 && (
            <div className="mt-8">
              <h2 className="font-mono text-[11.5px] uppercase tracking-[0.1em] mb-4 text-gray-500">Packages</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packages.map((pkg, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-700 rounded-[3px] p-5 flex flex-col">
                    <h3 className="text-[15px] font-semibold text-white">{pkg.name}</h3>
                    <p className="font-serif text-[26px] text-amber-400 mt-2">
                      {formatPrice(pkg.price, row.currency)}
                      <span className="font-mono text-[12px] text-gray-500"> / {pkg.unit}</span>
                    </p>
                    {pkg.description && <p className="text-[13px] leading-relaxed text-gray-400 mt-1.5">{pkg.description}</p>}
                    {pkg.features.length > 0 && (
                      <ul className="mt-4 space-y-1.5 text-[13px] text-gray-300">
                        {pkg.features.map((f, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="text-amber-400">✓</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          {faq.length > 0 && (
            <div className="mt-8">
              <h2 className="font-mono text-[11.5px] uppercase tracking-[0.1em] mb-4 text-gray-500">FAQ</h2>
              <div className="flex flex-col gap-3">
                {faq.map((item, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-700 rounded-[3px] p-5">
                    <h3 className="text-[14.5px] font-medium text-white mb-1.5">{item.question}</h3>
                    <p className="text-[13px] leading-relaxed text-gray-400">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact note */}
          {row.contact_note && (
            <div className="mt-8 border-l-2 border-amber-400 pl-5 max-w-[640px]">
              <p className="text-[14.5px] text-gray-300">{row.contact_note}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center flex-wrap gap-3 mt-8 font-mono text-[11.5px] text-gray-500">
          <span>BUILT ON THRIVE</span>
          <span>UPDATED: {updated}</span>
        </div>
      </div>
    </div>
  );
}