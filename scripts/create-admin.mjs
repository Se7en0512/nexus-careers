import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { randomBytes, scryptSync } from "node:crypto";

const db = new DatabaseSync(path.join(process.cwd(), "data", "nexus.db"));
const email = process.argv[2].toLowerCase();
const password = process.argv[3];

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");
const stored = `${salt}:${hash}`;

const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
if (existing) {
    db.prepare("UPDATE users SET role = 'admin' WHERE id = ?").run(existing.id);
    console.log(`Promoted ${email} (id=${existing.id}) to admin.`);
} else {
    const r = db.prepare("INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, 'Admin', 'admin')").run(email, stored);
    console.log(`Created admin ${email} (id=${Number(r.lastInsertRowid)}).`);
}
const row = db.prepare("SELECT id, email, name, role, plan FROM users WHERE email = ?").get(email);
console.log(JSON.stringify(row));