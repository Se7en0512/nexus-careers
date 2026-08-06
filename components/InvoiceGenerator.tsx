"use client";

import { useEffect, useState } from "react";
import PrintButton from "@/components/PrintButton";
import Button from "@/components/Button";

interface LineItem {
    description: string;
    hours: number;
    rate: number;
}

interface InvoiceData {
    invoice_number: string;
    client_name: string;
    client_email: string;
    line_items: LineItem[];
    currency: string;
    due_date: string | null;
    total: number;
}

const STORAGE_KEY = "thrive_invoice_draft";

export default function InvoiceGenerator() {
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [currency, setCurrency] = useState<"PHP" | "USD">("PHP");
    const [dueDate, setDueDate] = useState("");
    const [items, setItems] = useState<LineItem[]>([{ description: "", hours: 0, rate: 0 }]);
    const [invoice, setInvoice] = useState<InvoiceData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                if (data.clientName) setClientName(data.clientName);
                if (data.clientEmail) setClientEmail(data.clientEmail);
                if (data.currency) setCurrency(data.currency);
                if (data.dueDate) setDueDate(data.dueDate);
                if (data.items?.length) setItems(data.items);
                if (data.invoice) setInvoice(data.invoice);
            }
        } catch {
            // ignore corrupted storage
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                clientName, clientEmail, currency, dueDate, items, invoice,
            }));
        } catch {
            // storage full — non-critical
        }
    }, [clientName, clientEmail, currency, dueDate, items, invoice]);

    const updateItem = (idx: number, field: keyof LineItem, value: string | number) => {
        setItems(items.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
    };
    const addItem = () => setItems([...items, { description: "", hours: 0, rate: 0 }]);
    const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

    const symbol = currency === "PHP" ? "₱" : "$";

    const handleGenerate = async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/invoices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ client_name: clientName, client_email: clientEmail, currency, due_date: dueDate || null, line_items: items }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");
            setInvoice(data.invoice);
        } catch (e: any) {
            setError(e.message || "Failed to generate invoice.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="panel p-8 bg-navy-900 border border-navy-700 rounded-[3px]">
                <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-gold-400 mb-6">Invoice Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="form-label" htmlFor="client-name">Client / Company Name</label>
                        <input id="client-name" type="text" className="field" placeholder="e.g. Acme Corp" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                    </div>
                    <div>
                        <label className="form-label" htmlFor="client-email">Client Email</label>
                        <input id="client-email" type="email" className="field" placeholder="billing@acme.com" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className="form-label" htmlFor="currency">Currency</label>
                        <select id="currency" className="field bg-navy-900" value={currency} onChange={(e) => setCurrency(e.target.value as "PHP" | "USD")}>
                            <option value="PHP">₱ PHP — Philippine Peso</option>
                            <option value="USD">$ USD — US Dollar</option>
                        </select>
                    </div>
                    <div>
                        <label className="form-label" htmlFor="due-date">Due Date</label>
                        <input id="due-date" type="date" className="field" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>
                </div>

                <h4 className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-500 mb-3">
                    Line Items ({items.length}/20) — auto-computed subtotal: {symbol}
                    {items.reduce((a, it) => a + (Number(it.hours) || 0) * (Number(it.rate) || 0), 0).toLocaleString()}
                </h4>

                <div className="flex flex-col gap-3 mb-6">
                    {items.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-[1fr_80px_100px_32px] gap-2 items-center">
                            <input type="text" className="field !py-2" placeholder="Description" value={item.description} onChange={(e) => updateItem(idx, "description", e.target.value)} />
                            <input type="number" className="field !py-2 text-right" placeholder="Hrs" value={item.hours || ""} onChange={(e) => updateItem(idx, "hours", Number(e.target.value))} />
                            <input type="number" className="field !py-2 text-right" placeholder="Rate" value={item.rate || ""} onChange={(e) => updateItem(idx, "rate", Number(e.target.value))} />
                            <button onClick={() => removeItem(idx)} disabled={items.length === 1} className="text-red-400 hover:text-red-300 text-sm disabled:opacity-30">✕</button>
                        </div>
                    ))}
                </div>

                {items.length < 20 && (
                    <button onClick={addItem} className="btn-secondary !py-2 !px-4 !text-xs font-mono mb-6">+ Add Line Item</button>
                )}

                {error && <p className="text-xs text-red-400 font-mono mb-4">{error}</p>}

                <Button loading={loading} onClick={handleGenerate} className="!py-3 !px-6 !text-sm">
                    {loading ? "GENERATING..." : "GENERATE INVOICE"}
                </Button>
            </div>

            {invoice && (
                <div className="panel p-10 bg-navy-900 border border-navy-700 rounded-[3px]" id="invoice-print-area">
                    <div className="flex items-start justify-between gap-6 mb-10">
                        <div>
                            <p className="font-mono text-xs uppercase tracking-[0.16em] text-gold-400 mb-2">Invoice</p>
                            <p className="font-mono text-xl text-ink-50 font-bold">{invoice.invoice_number}</p>
                        </div>
                        <div className="text-right text-sm text-ink-300">
                            <p className="font-semibold text-ink-50">Thrive VA</p>
                            <p>Date issued: {new Date().toISOString().slice(0, 10)}</p>
                            {invoice.due_date && <p>Due: {invoice.due_date}</p>}
                        </div>
                    </div>

                    <div className="mb-8">
                        <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-500 mb-2">Bill To</p>
                        <p className="text-ink-50 font-semibold">{invoice.client_name}</p>
                        {invoice.client_email && <p className="text-sm text-ink-300">{invoice.client_email}</p>}
                    </div>

                    <table className="w-full text-left border-collapse mb-8">
                        <thead>
                            <tr className="border-b border-navy-600 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-500">
                                <th className="py-2">Description</th>
                                <th className="py-2 text-right">Hours</th>
                                <th className="py-2 text-right">Rate</th>
                                <th className="py-2 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.line_items.map((it, idx) => (
                                <tr key={idx} className="border-b border-navy-800 text-sm">
                                    <td className="py-3 text-ink-200">{it.description}</td>
                                    <td className="py-3 text-right font-mono text-ink-300">{it.hours}</td>
                                    <td className="py-3 text-right font-mono text-ink-300">{symbol}{it.rate}</td>
                                    <td className="py-3 text-right font-mono text-ink-50">{symbol}{(it.hours * it.rate).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end">
                        <div className="w-[220px] flex flex-col gap-2">
                            <div className="flex justify-between text-sm text-ink-300">
                                <span>Subtotal</span>
                                <span className="font-mono">{symbol}{invoice.total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-ink-300">
                                <span>Tax</span>
                                <span className="font-mono">—</span>
                            </div>
                            <div className="border-t border-navy-600 pt-3 flex justify-between items-center">
                                <span className="font-semibold text-ink-50">Total Due</span>
                                <span className="font-mono text-xl font-bold text-gold-300">{symbol}{invoice.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-navy-700 flex justify-between items-center">
                        <p className="text-xs text-ink-500">Payment terms: due within {invoice.due_date ? "specified date" : "7 days"}. Thank you!</p>
                        <PrintButton />
                    </div>
                </div>
            )}
        </div>
    );
}