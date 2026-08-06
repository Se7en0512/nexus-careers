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
        projects: string;
        theme: string;
        custom_slug: string;
        tagline: string;
        location: string;
        availability: string;
        languages: string;
        timezone_info: string;
        response_time: string;
      }
    | undefined;

  const parseJson = (s: string | undefined, fallback: unknown) => {
    try { return s ? JSON.parse(s) : fallback; } catch { return fallback; }
  };

  const initial = row
    ? {
        name: row.name,
        bio: row.bio,
        skills: parseJson(row.skills, []),
        experience: row.experience,
        links: parseJson(row.links, []),
        projects: parseJson(row.projects, []),
        theme: row.theme || "minimal",
        custom_slug: row.custom_slug || "",
        tagline: row.tagline || "",
        location: row.location || "",
        availability: row.availability || "",
        languages: parseJson(row.languages, []),
        timezone_info: row.timezone_info || "",
        response_time: row.response_time || "",
      }
    : null;

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Interactive Tool · Free</div>
          <h1>Portfolio Builder</h1>
          <p>
            A shareable page that shows who you are, what you can do, and why clients should hire you. Add projects, trust signals, and choose a theme.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <PortfolioForm initial={initial} currentSlug={row?.slug ?? null} />

        <aside className="panel p-7 mt-10">
          <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-gold-400 mb-5">Tips</h3>
          <ul className="flex flex-col gap-4">
            {[
              "This isn't a resume — it's a 'first impression' page. Clear, short, and direct.",
              "Add 2–3 featured projects with descriptions. Visual portfolios get more engagement.",
              "Include trust signals: location, availability, timezone, and languages.",
              "Share the link with every application. It's more personal than a PDF attachment.",
            ].map((t, i) => (
              <li key={i} className="flex gap-3 text-[13.5px] text-ink-300">
                <span className="font-mono text-gold-400 flex-shrink-0">0{i + 1}</span>
                {t}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
