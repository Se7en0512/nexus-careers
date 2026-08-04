import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { recordDailyActivity } from "@/lib/gamification";

export async function POST(req: Request) {
    let user;
    try {
        user = await requireUser();
    } catch {
        return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const data = await req.json().catch(() => null);
    if (!data) return NextResponse.json({ error: "Request body must be JSON" }, { status: 400 });

    const clientName = String(data.client_name || "").trim().slice(0, 80);
    const clientEmail = String(data.client_email || "").trim().slice(0, 80);
    const currency = data.currency === "USD" ? "USD" : "PHP";
    const dueDate = data.due_date ? String(data.due_date).trim().slice(0, 10) : null;

    const items = Array.isArray(data.line_items) ? data.line_items.slice(0, 20) : [];
    const lineItems = items.map((it: unknown) => {
        const o = (it ?? {}) as { description?: string; hours?: number; rate?: number };
        return {
            description: String(o.description || "").trim().slice(0, 120),
            hours: Math.max(0, Number(o.hours) || 0),
            rate: Math.max(0, Number(o.rate) || 0),
        };
    }).filter((li: { description: string }) => li.description);

    if (!clientName) return NextResponse.json({ error: "Client name is required." }, { status: 400 });
    if (lineItems.length === 0) return NextResponse.json({ error: "At least 1 line item is required." }, { status: 400 });

    // Server-side total computation
    const total = lineItems.reduce((acc: number, li: { hours: number; rate: number }) => acc + li.hours * li.rate, 0);

    const result = await db.prepare(
        `INSERT INTO invoices (user_id, invoice_number, client_name, client_email, line_items, currency, due_date)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(user.id, "", clientName, clientEmail, JSON.stringify(lineItems), currency, dueDate);

    const invoiceNumber = `INV-${user.id}-${Number(result.lastInsertRowid)}`;
    await db.prepare("UPDATE invoices SET invoice_number = ? WHERE id = ?").run(invoiceNumber, result.lastInsertRowid);

    await recordDailyActivity(user.id);

    return NextResponse.json({
        ok: true,
        invoice: {
            id: Number(result.lastInsertRowid),
            invoice_number: invoiceNumber,
            client_name: clientName,
            client_email: clientEmail,
            line_items: lineItems,
            currency,
            due_date: dueDate,
            total: Math.round(total * 100) / 100,
        },
    });
}

export async function GET() {
    let user;
    try {
        user = await requireUser();
    } catch {
        return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const rows = await db.prepare("SELECT * FROM invoices WHERE user_id = ? ORDER BY created_at DESC").all(user.id);
    return NextResponse.json(rows);
}