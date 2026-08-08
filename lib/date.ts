/**
 * Returns a YYYY-MM-DD date string for the given instant, in Asia/Manila time.
 * Used to compare "same calendar day" regardless of the server's own timezone.
 */
export function manilaDateString(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" }).format(d);
}

/**
 * SQLite stores datetime('now') as "YYYY-MM-DD HH:MM:SS" (UTC, no timezone suffix).
 * This parses that format safely into a Date.
 */
export function parseSqliteUtc(value: string): Date {
  return new Date(value.replace(" ", "T") + "Z");
}