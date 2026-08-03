import type { MetadataRoute } from "next";

const base = process.env.APP_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/applications", "/api/"],
    },
    sitemap: base ? `${base}/sitemap.xml` : undefined,
  };
}
