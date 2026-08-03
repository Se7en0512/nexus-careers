import { db } from "../lib/db";

const email = process.argv[2];

if (!email) {
  console.error("Usage: npx tsx scripts/make-admin.ts <email>");
  process.exit(1);
}

async function main() {
  const user = (await db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase())) as { id: number } | undefined;

  if (!user) {
    console.error(`No user found with email: ${email}`);
    process.exit(1);
  }

  await db.prepare("UPDATE users SET role = 'admin' WHERE id = ?").run(user.id);
  console.log(`Granted admin role to ${email}`);
}

main();
