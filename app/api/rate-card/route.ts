import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { slugify, uniqueSlug } from "@/lib/slug";
import { logActivity } from "@/lib/activity";

const VALID_CURRENCIES = ["USD", "PHP", "EUR", "GBP", "AUD", "CAD"];
const VALID_UNITS = ["hour", "month", "project"];

interface RateCardPackage {
  name: string;
  price: number;
  unit: "hour" | "month" | "project";
  description: string;
  features: string[];
}

interface RateCardFaq {
  question: string;
  answer: string;
}

export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  const row = await db.prepare("SELECT * FROM rate_cards WHERE user_id = ?").get(user.id);
  return NextResponse.json(row ?? null);
}

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const ip = getClientIp(req);
  if (!(await rateLimit(`ratecard:${ip}`, 10, 10 * 60 * 1000))) {
    return NextResponse.json({ error: "Too many requests — please wait 10 minutes." }, { status: 429 });
  }

  const data = await req.json().catch(() => null);
  if (!data) return NextResponse.json({ error: "Request body must be JSON" }, { status: 400 });

  const headline = String(data.headline || "").trim().slice(0, 120);
  const intro = String(data.intro || "").trim().slice(0, 500);
  const currency = VALID_CURRENCIES.includes(data.currency) ? data.currency : "USD";
  const contactNote = String(data.contact_note || "").trim().slice(0, 300);
  const customSlugRaw = String(data.custom_slug || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 40);

  const packages: RateCardPackage[] = (Array.isArray(data.packages) ? data.packages : [])
    .slice(0, 5)
    .map((p: unknown) => {
      const o = (p ?? {}) as { name?: string; price?: unknown; unit?: string; description?: string; features?: unknown };
      return {
        name: String(o.name || "").trim().slice(0, 80),
        price: Math.min(Math.max(0, Number(o.price) || 0), 10000000),
        unit: VALID_UNITS.includes(String(o.unit)) ? (String(o.unit) as "hour" | "month" | "project") : "month",
        description: String(o.description || "").trim().slice(0, 200),
        features: (Array.isArray(o.features) ? o.features : [])
          .map((f: unknown) => String(f ?? "").trim().slice(0, 120))
          .filter(Boolean)
          .slice(0, 6),
      };
    })
    .filter((p: RateCardPackage) => p.name);

  const faq: RateCardFaq[] = (Array.isArray(data.faq) ? data.faq : [])
    .slice(0, 8)
    .map((f: unknown) => {
      const o = (f ?? {}) as { question?: string; answer?: string };
      return {
        question: String(o.question || "").trim().slice(0, 150),
        answer: String(o.answer || "").trim().slice(0, 600),
      };
    })
    .filter((f: RateCardFaq) => f.question);

  if (!headline) {
    return NextResponse.json({ error: "A headline is required." }, { status: 400 });
  }

  const existing = (await db.prepare("SELECT id, slug FROM rate_cards WHERE user_id = ?").get(user.id)) as
    | { id: number; slug: string }
    | undefined;

  let slug = existing?.slug;
  if (!slug) {
    const baseSlug = customSlugRaw || slugify(headline);
    slug = await uniqueSlug("rate_cards", baseSlug);
    await db
      .prepare(
        `INSERT INTO rate_cards (user_id, slug, headline, intro, currency, packages, faq, contact_note)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(user.id, slug, headline, intro, currency, JSON.stringify(packages), JSON.stringify(faq), contactNote);
  } else {
    let finalSlug = slug!;
    if (customSlugRaw && customSlugRaw !== existing!.slug) {
      finalSlug = await uniqueSlug("rate_cards", customSlugRaw, existing!.id);
    }
    await db
      .prepare(
        `UPDATE rate_cards SET slug = ?, headline = ?, intro = ?, currency = ?, packages = ?, faq = ?, contact_note = ?, updated_at = datetime('now') WHERE user_id = ?`
      )
      .run(finalSlug, headline, intro, currency, JSON.stringify(packages), JSON.stringify(faq), contactNote, user.id);
    slug = finalSlug;
  }

  await logActivity(user.id, "portfolio_updated", { rateCardSlug: slug });

  return NextResponse.json({ ok: true, slug }, { status: 200 });
}

export async function DELETE() {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }
  await db.prepare("DELETE FROM rate_cards WHERE user_id = ?").run(user.id);
  return NextResponse.json({ ok: true });
}