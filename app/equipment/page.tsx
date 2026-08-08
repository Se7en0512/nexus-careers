import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import { EQUIPMENT_TIERS } from "@/data/equipment";
import EquipmentChecker from "@/components/EquipmentChecker";
import LockedPreview from "@/components/LockedPreview";

export const metadata: Metadata = { title: "Equipment Guide 2026" };

export const dynamic = "force-dynamic";

export default async function EquipmentPage() {
  const user = await getSessionUser();
  if (!user)
    return (
      <LockedPreview
        eyebrow="Equipment Guide 2026"
        title="You don't need perfect. You need prepared."
        description="The complete WFH setup guide for Filipino VAs and freelancers. Check what you have, plan what to buy, and get PH-priced picks for every part of your setup."
        highlights={[
          "Five-minute equipment self-check with a score",
          "PH-priced picks in three budget tiers",
          "Buy with your first income, not debt",
        ]}
        nextPath="/equipment"
      />
    );

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Equipment Guide 2026</div>
          <h1>You don't need perfect. You need prepared.</h1>
          <p>
            The complete WFH setup guide for Filipino VAs and freelancers. Check what you have,
            plan what to buy, and get PH-priced picks for every part of your setup.
            Three budget tiers per category. All free.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        {/* Interactive Checker */}
        <section className="mb-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-400 mb-4">Self-check</p>
          <h2 className="font-serif font-medium text-[28px] mb-4">Check what you already have.</h2>
          <p className="text-ink-300 max-w-[640px] mb-8">
            Answer 5 quick questions and get a score + a list of what to fix first.
          </p>
          <EquipmentChecker />
        </section>

        {/* Budget Tiers */}
        <div className="flex flex-col gap-8">
          {EQUIPMENT_TIERS.map((tier) => (
            <section key={tier.key} id={tier.key} className="panel scroll-mt-24">
              <div className="p-8 border-b border-navy-700 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="font-serif font-medium text-[26px]">{tier.title}</h2>
                  <p className="text-[14.5px] text-ink-300 mt-2 max-w-[560px]">{tier.tagline}</p>
                </div>
                <span className="font-mono text-[15px] text-gold-400">{tier.total}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-navy-700">
                {tier.items.map((item) => (
                  <div key={item.name} className="bg-navy-900 p-6">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h3 className="font-semibold text-[15.5px]">{item.name}</h3>
                      <span className="font-mono text-[13px] text-gold-400 whitespace-nowrap">
                        {item.estimate}
                      </span>
                    </div>
                    <p className="text-[13.5px] text-ink-500 mb-2">{item.note}</p>
                    {item.buy && (
                      <p className="text-[12px] text-ink-500">
                        <span className="text-gold-400 font-mono">Where to buy:</span> {item.buy}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="border-l-2 border-gold-400 pl-5 mt-12 max-w-[640px]">
          <p className="text-[15px] text-ink-300">
            <strong className="text-ink-50">Real talk:</strong> buying a setup is an
            investment, not a vanity purchase. Start with a cheap setup that works, apply,
            earn, then upgrade from your income — not from debt before you even have your
            first client.
          </p>
        </div>

        <section className="mt-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-400 mb-4">Ready to start?</p>
          <h2 className="font-serif font-medium text-[26px] mb-3">Build your portfolio first.</h2>
          <p className="text-ink-300 max-w-[640px] mb-8">
            Your equipment matters, but your portfolio and skills matter more. Get your
            Readiness Check score, then build your portfolio while you wait for the right setup.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/tools/readiness" className="btn-primary !py-[10px] !px-[16px] !text-[12.5px]">
              Take the Readiness Check →
            </a>
            <a href="/portfolio-builder" className="btn-secondary !py-[10px] !px-[16px] !text-[12.5px]">
              Open the Portfolio Builder →
            </a>
          </div>
        </section>
      </div>
    </>
  );
}