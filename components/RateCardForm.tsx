"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import { showToast } from "@/components/Toast";

interface RateCardPackage {
  name: string;
  price: number;
  unit: string;
  description: string;
  features: string[];
}

interface RateCardFaq {
  question: string;
  answer: string;
}

const CURRENCIES = ["USD", "PHP", "EUR", "GBP", "AUD", "CAD"];
const UNITS = [
  { value: "hour", label: "per hour" },
  { value: "month", label: "per month" },
  { value: "project", label: "per project" },
];

export default function RateCardForm() {
  const [headline, setHeadline] = useState("");
  const [intro, setIntro] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [contactNote, setContactNote] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [packages, setPackages] = useState<RateCardPackage[]>([]);
  const [faq, setFaq] = useState<RateCardFaq[]>([]);
  const [activeTab, setActiveTab] = useState<"content" | "packages" | "faq">("content");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/rate-card")
      .then((res) => res.json())
      .then((data) => {
        if (!data) return;
        setHeadline(data.headline || "");
        setIntro(data.intro || "");
        setCurrency(data.currency || "USD");
        setContactNote(data.contact_note || "");
        try {
          setPackages(JSON.parse(data.packages || "[]"));
        } catch { setPackages([]); }
        try {
          setFaq(JSON.parse(data.faq || "[]"));
        } catch { setFaq([]); }
        setSavedSlug(data.slug || null);
      })
      .catch(() => {});
  }, []);

  const updatePackage = (idx: number, field: keyof RateCardPackage, value: string | number | string[]) => {
    setPackages(ps => ps.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));
  };

  const addPackage = () =>
    setPackages(ps => [...ps, { name: "", price: 0, unit: "month", description: "", features: [] }]);

  const removePackage = (idx: number) =>
    setPackages(ps => ps.filter((_, i) => i !== idx));

  const updateFaq = (idx: number, field: keyof RateCardFaq, value: string) => {
    setFaq(fs => fs.map((f, i) => (i === idx ? { ...f, [field]: value } : f)));
  };

  const addFaq = () => setFaq(fs => [...fs, { question: "", answer: "" }]);
  const removeFaq = (idx: number) => setFaq(fs => fs.filter((_, i) => i !== idx));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/rate-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline,
          intro,
          currency,
          contact_note: contactNote,
          custom_slug: customSlug,
          packages: packages.map(p => ({
            ...p,
            features: p.features,
          })),
          faq,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setSavedSlug(data.slug);
      showToast("success", "Rate card saved successfully!");
    } finally {
      setBusy(false);
    }
  };

  const publicUrl = savedSlug ? `https://thrive-ph.vercel.app/rate-card/${savedSlug}` : null;

  const copyLink = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
      {/* FORM */}
      <form onSubmit={submit} className="flex flex-col gap-5">
        {/* Tab Navigation */}
        <div className="flex gap-1 bg-navy-800 rounded-[3px] p-1">
          {(["content", "packages", "faq"] as const).map(tab => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)}
              className={`flex-1 min-h-[44px] py-2.5 px-3 rounded-[2px] text-[12px] font-mono uppercase tracking-wider transition-colors ${
                activeTab === tab ? "bg-gold-400 text-navy-950" : "text-ink-500 hover:text-ink-300"
              }`}>
              {tab === "content" ? "Content" : tab === "packages" ? "Packages" : "FAQ"}
            </button>
          ))}
        </div>

        {/* CONTENT TAB */}
        {activeTab === "content" && (
          <>
            <div>
              <label className="form-label" htmlFor="rc-headline">Headline</label>
              <input id="rc-headline" className="field" value={headline} onChange={e => setHeadline(e.target.value)}
                placeholder="e.g. Virtual Assistant Services — Transparent Rates" maxLength={120} required />
              <p className="font-mono text-[10px] text-ink-500 mt-1">The title at the top of your public page</p>
            </div>
            <div>
              <label className="form-label" htmlFor="rc-intro">Intro (optional)</label>
              <textarea id="rc-intro" className="field min-h-[90px] resize-y" value={intro} onChange={e => setIntro(e.target.value)}
                placeholder="e.g. Clear, fixed rates so you always know what you're paying for. No hidden fees, no awkward surprises." maxLength={500} />
              <p className="font-mono text-[10px] text-ink-500 mt-1">{intro.length}/500</p>
            </div>
            <div>
              <label className="form-label" htmlFor="rc-currency">Currency</label>
              <select id="rc-currency" className="field" value={currency} onChange={e => setCurrency(e.target.value)}>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label" htmlFor="rc-contact">Contact note (optional)</label>
              <textarea id="rc-contact" className="field min-h-[80px] resize-y" value={contactNote} onChange={e => setContactNote(e.target.value)}
                placeholder="e.g. Have questions or need something custom? Message me at [email] or on [platform]." maxLength={300} />
            </div>
            <div>
              <label className="form-label" htmlFor="rc-slug">Custom URL slug</label>
              <div className="flex items-center gap-0">
                <span className="font-mono text-[12px] text-ink-500 bg-navy-800 px-3 py-[10px] border border-r-0 border-navy-700 rounded-l-[3px]">/rate-card/</span>
                <input id="rc-slug" className="field !rounded-l-none flex-1" value={customSlug}
                  onChange={e => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder={slugify(headline || "rate-card")} maxLength={40} />
              </div>
              <p className="font-mono text-[10px] text-ink-500 mt-1">Leave blank to auto-generate from your headline</p>
            </div>
          </>
        )}

        {/* PACKAGES TAB */}
        {activeTab === "packages" && (
          <>
            <p className="text-[13.5px] text-ink-500">Packages are the core of your rate card — name, price, and what's included. Up to 5.</p>
            {packages.map((pkg, i) => (
              <div key={i} className="border border-navy-700 rounded-[3px] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-gold-400">PACKAGE {i + 1}</span>
                  <button type="button" onClick={() => removePackage(i)} className="text-[11px] text-red-400 hover:text-red-300">Remove</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input className="field" placeholder="Package name (e.g. Starter)" value={pkg.name}
                    onChange={e => updatePackage(i, "name", e.target.value)} />
                  <select className="field" value={pkg.unit} onChange={e => updatePackage(i, "unit", e.target.value)}>
                    {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input className="field" type="number" min={0} step="0.01" placeholder="Price" value={pkg.price === 0 ? "" : pkg.price}
                      onChange={e => updatePackage(i, "price", parseFloat(e.target.value) || 0)} />
                  </div>
                  <div />
                </div>
                <textarea className="field min-h-[60px] resize-y" placeholder="Short description of the package" value={pkg.description}
                  onChange={e => updatePackage(i, "description", e.target.value)} maxLength={200} />
                <div>
                  <p className="font-mono text-[10px] text-ink-500 mb-1">Features (comma-separated, max 6)</p>
                  <input className="field" placeholder="e.g. Email management up to 100 emails/day, Calendar scheduling" value={pkg.features.join(", ")}
                    onChange={e => updatePackage(i, "features", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} />
                </div>
              </div>
            ))}
            {packages.length === 0 && (
              <div className="border border-dashed border-navy-600 rounded-[3px] p-8 text-center">
                <p className="text-[14px] text-ink-300 mb-1">No packages yet</p>
                <p className="text-[12.5px] text-ink-500">Add at least one so prospects can see how you charge.</p>
              </div>
            )}
            {packages.length < 5 && (
              <button type="button" onClick={addPackage} className="btn-secondary !py-[10px] !px-[16px] !text-[12.5px] self-start">+ Add package</button>
            )}
          </>
        )}

        {/* FAQ TAB */}
        {activeTab === "faq" && (
          <>
            <p className="text-[13.5px] text-ink-500">Answer the questions clients always ask before hiring you — how you work, schedules, communication.</p>
            {faq.map((item, i) => (
              <div key={i} className="border border-navy-700 rounded-[3px] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-gold-400">QUESTION {i + 1}</span>
                  <button type="button" onClick={() => removeFaq(i)} className="text-[11px] text-red-400 hover:text-red-300">Remove</button>
                </div>
                <input className="field" placeholder="Question (e.g. What's your turnaround time?)" value={item.question}
                  onChange={e => updateFaq(i, "question", e.target.value)} maxLength={150} />
                <textarea className="field min-h-[70px] resize-y" placeholder="Answer" value={item.answer}
                  onChange={e => updateFaq(i, "answer", e.target.value)} maxLength={600} />
              </div>
            ))}
            {faq.length === 0 && (
              <div className="border border-dashed border-navy-600 rounded-[3px] p-8 text-center">
                <p className="text-[14px] text-ink-300 mb-1">No FAQ yet</p>
                <p className="text-[12.5px] text-ink-500">Optional — add the top questions you get from prospects.</p>
              </div>
            )}
            {faq.length < 8 && (
              <button type="button" onClick={addFaq} className="btn-secondary !py-[10px] !px-[16px] !text-[12.5px] self-start">+ Add question</button>
            )}
          </>
        )}

        {error && <p className="form-error">{error}</p>}

        <div className="flex items-center gap-4 flex-wrap">
          <Button loading={busy}>
            {busy ? "Saving..." : savedSlug ? "Update Rate Card" : "Publish Rate Card"}
          </Button>
          {publicUrl && (
            <>
              <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                View the Public Page ↗
              </a>
              <button type="button" onClick={copyLink} className="btn-secondary !py-[10px] !px-[16px] !text-[12.5px]">
                {copied ? "✓ Copied" : "📋 Copy Link"}
              </button>
            </>
          )}
        </div>
        {publicUrl && (
          <p className="form-note">
            Your public link: <a href={publicUrl} className="accent-link">/rate-card/{savedSlug}</a> — send it with every proposal.
          </p>
        )}
      </form>

      {/* HINT */}
      <div className="border border-navy-700 bg-navy-900 rounded-[3px] p-5 self-start xl:sticky xl:top-24">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-3 block">Why a rate card?</span>
        <ul className="space-y-2.5 text-[12px] text-ink-50 leading-relaxed">
          <li>• Clients compare you to others anyway — give them one clear sheet instead.</li>
          <li>• Priced packages stop "how much per hour?" conversations before they stall.</li>
          <li>• A FAQ answers the same 5 questions you get every first call.</li>
          <li>• Share one link in every proposal instead of typing rates each time.</li>
        </ul>
      </div>
    </div>
  );
}

function slugify(input: string): string {
  return input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "rate-card";
}