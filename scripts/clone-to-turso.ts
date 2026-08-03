process.loadEnvFile(".env");

async function main() {
  const { db } = await import("../lib/db");
  const { createClient } = await import("@libsql/client");

  const local = createClient({ url: "file:data/nexus.db" });
  console.log("remote url:", process.env.TURSO_DATABASE_URL?.slice(0, 40) + "...");

  const before = await db.prepare("SELECT COUNT(*) AS n FROM sqlite_master WHERE type='table'").get();
  console.log("tables on REMOTE:", JSON.stringify(before));

  const tables = (await local.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")).rows as unknown as Array<{ name: string }>;
  tables.sort((a, b) => (a.name === "users" ? -1 : b.name === "users" ? 1 : a.name < b.name ? -1 : 1));
  console.log("local tables:", tables.length);

  for (const t of tables) {
    const name = t.name;
    const cols = (await local.execute(`PRAGMA table_info("${name}")`)).rows as unknown as Array<{ name: string }>;
    const colNames = cols.map((c) => c.name);
    const rows = (await local.execute(`SELECT * FROM "${name}"`)).rows;

    await db.prepare(`DELETE FROM "${name}"`).run();
    if (rows.length === 0) {
      console.log(`${name}: 0 rows`);
      continue;
    }

    const placeholders = colNames.map(() => "?").join(", ");
    const sql = `INSERT INTO "${name}" (${colNames.map((c) => `"${c}"`).join(", ")}) VALUES (${placeholders})`;
    const stmt = db.prepare(sql);
    for (const row of rows) {
      const vals = colNames.map((c) => (row[c] === undefined ? null : row[c]));
      await stmt.run(...(vals as never[]));
    }
    console.log(`${name}: ${rows.length} rows cloned`);
  }

  const userCount = (await db.prepare("SELECT COUNT(*) AS n FROM users").get()) as { n: number };
  const sites = (await db.prepare("SELECT COUNT(*) AS n FROM apply_sites").get()) as { n: number };
  console.log("REMOTE users:", JSON.stringify(userCount), "apply_sites:", JSON.stringify(sites));
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
