"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function WinForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote.trim()) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/wins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, quote }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      timerRef.current = setTimeout(() => router.refresh(), 1200);
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="panel p-8">
        <p className="font-serif text-[20px] italic text-gold-300">
          Your story has been sent. Thank you for being open — this will be real
          proof for the next person coming in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="panel p-8 max-w-[680px]">
      <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-gold-400 mb-6">
        Share Your Win
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="form-label" htmlFor="win-name">Display name (optional)</label>
          <input
            id="win-name"
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jenna R. — leave blank for anonymous"
            maxLength={40}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="win-role">What was your win? (1 line)</label>
          <input
            id="win-role"
            className="field"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. First client after 2 months"
          />
        </div>
      </div>
      <div className="mb-6">
        <label className="form-label" htmlFor="win-quote">The story</label>
        <textarea
          id="win-quote"
          className="field min-h-[120px] resize-y"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="What did you do, how long did it take, and what did you learn for the next person coming in?"
          maxLength={500}
        />
        <p className="form-note mt-2">{quote.length}/500</p>
      </div>
      {status === "error" && <p className="form-error">Something went wrong — please try again.</p>}
      <button className="btn-primary" disabled={status === "saving"}>
        {status === "saving" ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
