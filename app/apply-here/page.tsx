import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import ApplyDirectory from "@/components/ApplyDirectory";
import LockedPreview from "@/components/LockedPreview";

export const metadata: Metadata = { title: "Apply Here" };

export const dynamic = "force-dynamic";

interface Site {
  id: number;
  name: string;
  url: string;
  category: string;
  description: string;
  platform_type: string;
  niche_tags: string;
}

export default async function ApplyHerePage() {
  const user = await getSessionUser();
  if (!user)
    return (
      <LockedPreview
        eyebrow="Apply Here"
        title="Where you can really apply — not where you're just led on."
        description="A directory of platforms and companies that actually hire Filipino VAs."
        highlights={[
          "Curated platforms and agencies that hire Filipino VAs",
          "Filter by niche and platform type",
          "Read the Red Flags page first to stay safe",
        ]}
        nextPath="/apply-here"
      />
    );

  const rows = (await db
    .prepare("SELECT id, name, url, category, description, platform_type, niche_tags FROM apply_sites ORDER BY category, name")
    .all()) as unknown as Site[];

  // libsql rows have no plain prototype — must map to plain objects
  // before passing to a Client Component (Next.js serialization).
  const sites = rows.map((s) => ({
    id: s.id,
    name: s.name,
    url: s.url,
    category: s.category,
    description: s.description,
    platform_type: s.platform_type,
    niche_tags: s.niche_tags,
  }));

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Apply Here · {sites.length}+ platforms</div>
          <h1>Where you can really apply — not where you're just led on.</h1>
          <p>
            A directory of platforms and companies that actually hire Filipino VAs.
            Before applying anywhere, read the{" "}
            <a href="/red-flags" className="accent-link">Red Flags page</a> first — it's what
            will keep you safe.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <ApplyDirectory sites={sites} />

        <section className="mt-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-400 mb-4">Your own clients</p>
          <h2 className="font-serif font-medium text-[26px] mb-3">You're not waiting for a post — you're making the work happen.</h2>
          <p className="text-ink-300 max-w-[640px] mb-8">
            Platforms give you applications; direct outreach gives you clients. Reach out to small
            business owners, solo coaches, real estate agents, and e-commerce sellers who have a
            visible problem: slow replies, messy social media, no booking system. That is your
            opening line.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="/closing-scripts" className="panel p-7 block group">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-2">Direct outreach</p>
              <h3 className="font-serif font-medium text-[20px] mb-2 group-hover:text-gold-300 transition-colors">Closing Scripts</h3>
              <p className="text-[13.5px] text-ink-400">LinkedIn connection requests, one-task-pitch cold emails, discovery call questions, and replies to 'you're too expensive' — all copy-paste.</p>
              <span className="font-mono text-xs text-gold-400 mt-4 inline-block">Open the scripts →</span>
            </a>
            <a href="/prompts" className="panel p-7 block group">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-2">With AI</p>
              <h3 className="font-serif font-medium text-[20px] mb-2 group-hover:text-gold-300 transition-colors">Prompt Library</h3>
              <p className="text-[13.5px] text-ink-400">Prompts for cold outreach emails, discovery call scripts, and handling objections — tailored to each business.</p>
              <span className="font-mono text-xs text-gold-400 mt-4 inline-block">Open the prompts →</span>
            </a>
          </div>
        </section>

        <div className="border-l-2 border-gold-400 pl-5 mt-12 max-w-[640px]">
          <p className="text-[15px] text-ink-300">
            <strong className="text-ink-50">Remember:</strong> some platforms charge their own
            fee for job access (e.g. VirtualStaff.ph). That's different from an "employer"
            asking you to pay before you get hired. Be careful about the difference.
          </p>
        </div>
      </div>
    </>
  );
}
