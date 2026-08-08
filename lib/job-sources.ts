export interface NormalizedJob {
  title: string;
  company: string;
  url: string;
  niche: string;
  description: string;
  source: string;
}

// Maps existing niche keys (see data/niche-learning.ts) to keywords we'll
// match against each job's title + tags/category. First match wins.
// Order matters: more specific niches first, "admin" last as the catch-all
// VA keyword (also matches lib/db.ts's own default niche value).
const NICHE_KEYWORDS: Array<{ niche: string; keywords: string[] }> = [
  { niche: "bookkeeping", keywords: ["bookkeep", "accounting", "quickbooks", "accounts payable", "accounts receivable", "financial analyst"] },
  { niche: "ecommerce", keywords: ["shopify", "ecommerce", "e-commerce", "amazon fba", "dropship", "product listing"] },
  { niche: "content", keywords: ["content writer", "copywriter", "content creator", "blog writer", "seo writer", "technical writer"] },
  { niche: "social", keywords: ["social media", "community manager", "social media manager", "influencer marketing"] },
  { niche: "customer", keywords: ["customer support", "customer service", "customer success", "support specialist", "help desk", "helpdesk"] },
  { niche: "admin", keywords: ["virtual assistant", "executive assistant", "administrative assistant", "admin assistant", "data entry", "personal assistant"] },
];

/**
 * Returns a niche key if the job matches a known VA-relevant keyword,
 * or null if it should be skipped entirely (e.g. a backend engineer role).
 */
function classifyNiche(title: string, extraText: string): string | null {
  const haystack = `${title} ${extraText}`.toLowerCase();
  for (const { niche, keywords } of NICHE_KEYWORDS) {
    if (keywords.some((kw) => haystack.includes(kw))) return niche;
  }
  return null;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 280);
}

/* ---------------- RemoteOK ---------------- */

async function fetchRemoteOk(): Promise<NormalizedJob[]> {
  const res = await fetch("https://remoteok.com/api", {
    headers: { "User-Agent": "ThrivePH-JobAlerts/1.0" },
  });
  if (!res.ok) return [];
  const raw = (await res.json()) as any[];
  // First element is a legal-notice object, not a job — skip it.
  const jobs = raw.slice(1);

  const out: NormalizedJob[] = [];
  for (const j of jobs) {
    const title = j.position || j.title || "";
    const tags = Array.isArray(j.tags) ? j.tags.join(" ") : "";
    const niche = classifyNiche(title, tags);
    if (!niche) continue;
    const url = j.url?.startsWith("http") ? j.url : `https://remoteok.com${j.url || ""}`;
    if (!url || !title) continue;
    out.push({
      title,
      company: j.company || "",
      url,
      niche,
      description: stripHtml(j.description || ""),
      source: "remoteok",
    });
  }
  return out;
}

/* ---------------- Jobicy ---------------- */

async function fetchJobicy(): Promise<NormalizedJob[]> {
  const res = await fetch("https://jobicy.com/api/v2/remote-jobs?count=50");
  if (!res.ok) return [];
  const data = (await res.json()) as { jobs?: any[] };
  const jobs = data.jobs || [];

  const out: NormalizedJob[] = [];
  for (const j of jobs) {
    const title = j.jobTitle || "";
    const industry = Array.isArray(j.jobIndustry) ? j.jobIndustry.join(" ") : String(j.jobIndustry || "");
    const niche = classifyNiche(title, industry);
    if (!niche) continue;
    if (!j.url || !title) continue;
    out.push({
      title,
      company: j.companyName || "",
      url: j.url,
      niche,
      description: stripHtml(j.jobExcerpt || j.jobDescription || ""),
      source: "jobicy",
    });
  }
  return out;
}

/* ---------------- Remotive ---------------- */

async function fetchRemotive(): Promise<NormalizedJob[]> {
  // Request the customer-service category directly — cuts down on
  // irrelevant dev/design noise before we even classify.
  const res = await fetch("https://remotive.com/api/remote-jobs?category=customer-service");
  if (!res.ok) return [];
  const data = (await res.json()) as { jobs?: any[] };
  const jobs = data.jobs || [];

  const out: NormalizedJob[] = [];
  for (const j of jobs) {
    const title = j.title || "";
    const tags = Array.isArray(j.tags) ? j.tags.join(" ") : "";
    const niche = classifyNiche(title, `${j.category || ""} ${tags}`);
    if (!niche) continue;
    if (!j.url || !title) continue;
    out.push({
      title,
      company: j.company_name || "",
      url: j.url,
      niche,
      description: stripHtml(j.description || ""),
      source: "remotive",
    });
  }
  return out;
}

export async function fetchAllSources(): Promise<NormalizedJob[]> {
  const results = await Promise.allSettled([fetchRemoteOk(), fetchJobicy(), fetchRemotive()]);
  const jobs: NormalizedJob[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") jobs.push(...r.value);
  }
  return jobs;
}