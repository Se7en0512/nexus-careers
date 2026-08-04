import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import PortfolioForm from "@/components/PortfolioForm";

export const metadata: Metadata = { title: "Portfolio Builder" };

export const dynamic = "force-dynamic";

export default async function PortfolioBuilderPage() {
  const user = await getSessionUser();
  if (!user) redirect("/signup?next=/portfolio-builder");

  const row = (await db.prepare("SELECT * FROM portfolios WHERE user_id = ?").get(user.id)) as
    | {
        name: string;
        bio: string;
        skills: string;
        experience: string;
        links: string;
        slug: string;
      }
    | undefined;

  const initial = row
    ? {
        name: row.name,
        bio: row.bio,
        skills: (() => { try { return JSON.parse(row.skills); } catch { return []; } })(),
        experience: row.experience,
        links: (() => { try { return JSON.parse(row.links); } catch { return []; } })(),
      }
    : null;

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Interactive Tool · Free</div>
          <h1>Portfolio Builder</h1>
          <p>
            A simple shareable page that shows who you are and what you can do. No job
            experience needed to start — samples and clarity are enough.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
          <div className="panel p-8">
            <PortfolioForm initial={initial} currentSlug={row?.slug ?? null} />
          </div>

          <aside className="panel p-7">
            <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-gold-400 mb-5">
              Notes
            </h3>
            <ul className="flex flex-col gap-4">
              {[
                "This isn't a resume — it's a 'first impression' page. Clear, short, and direct.",
                "Use real samples of your work (Canva, Google Docs, any file).",
                "If you have no experience yet, say what you've studied and show the samples you've made — that's not a lie.",
                "Share the link with every application. It's more personal than a PDF attachment.",
              ].map((t, i) => (
                <li key={i} className="flex gap-3 text-[13.5px] text-ink-300">
                  <span className="font-mono text-gold-400 flex-shrink-0">0{i + 1}</span>
                  {t}
                </li>
              ))}
            </ul>

            <div className="border-t border-navy-700 mt-6 pt-6">
              <h4 className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-500 mb-4">
                Host it for free on GitHub Pages
              </h4>
              <ul className="flex flex-col gap-3">
                {[
                  "Create a free account on github.com — it does double duty: proof you can handle tech.",
                  "Create a repository with a name you like (e.g. 'portfolio'), upload your page, and make sure the filename is index.html.",
                  "Turn on GitHub Pages: Settings → Pages → Source: main branch → Save. In a minute, your page is live at yourusername.github.io — link that in every application.",
                ].map((t, i) => (
                  <li key={i} className="flex gap-3 text-[13px] text-ink-400">
                    <span className="font-mono text-gold-400 flex-shrink-0">{i + 1}.</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
