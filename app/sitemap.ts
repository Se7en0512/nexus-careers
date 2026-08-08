import type { MetadataRoute } from "next";

const base = process.env.APP_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  if (!base) return [];
  const paths = [
    "",
    "/about",
    "/faq",
    "/red-flags",
    "/walkthrough",
    "/wins",
    "/feedback",
    "/privacy-policy",
    "/signup",
    "/login",
    "/forgot-password",
    "/get-started",
    "/first-90-days",
    "/equipment",
    "/niches",
    "/courses",
    "/tutorials",
    "/tips",
    "/prompts",
    "/codes",
    "/free-templates",
    "/apply-here",
    "/closing-scripts",
    "/applications",
    "/assistant",
    "/tools/tracker",
    "/tools/budget",
    "/tools/timezone",
    "/tools/resume-builder",
    "/tools/contributions-calculator",
    "/tools/pitch-calculator",
    "/tools/invoice-generator",
    "/tools/cover-letter",
    "/tools/mock-interview",
    "/tools/niche-finder",
    "/tools/readiness",
    "/tools/interview-coach",
    "/tools/red-flag-checker",
    "/portfolio-builder",
    "/30-day-plan",
    "/jobs",
  ];
  return paths.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : p.startsWith("/tools/") ? 0.7 : 0.6,
  }));
}
