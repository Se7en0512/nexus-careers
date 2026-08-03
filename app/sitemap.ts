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
    "/tools/tracker",
    "/tools/budget",
    "/tools/timezone",
    "/tools/resume-builder",
    "/tools/contributions-calculator",
  ];
  return paths.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.6,
  }));
}
