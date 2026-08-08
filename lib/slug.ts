import { db } from "./db";

export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || "va";
}

export async function uniqueSlug(table: string, base: string, excludeId?: number): Promise<string> {
  let slug = base;
  let n = 2;
  for (;;) {
    const existing = (await db.prepare(`SELECT id FROM ${table} WHERE slug = ?`).get(slug)) as
      | { id: number }
      | undefined;
    if (!existing || (excludeId && existing.id === excludeId)) break;
    slug = `${base}-${n}`;
    n++;
  }
  return slug;
}
