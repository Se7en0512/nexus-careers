"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface FeedbackItem {
  name: string;
  content: string;
  rating: number;
  created_at: string;
}

export default function FeedbackSection() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/feedback")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: FeedbackItem[]) => setItems(data))
      .catch(() => setItems([]));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMsg("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, rating }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) return setError("You need to be signed in — create a free account first.");
        return setError(data.error || "Something went wrong.");
      }
      setMsg("Thanks! Your feedback was sent — it will show here once approved.");
      setContent("");
      setRating(5);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <form onSubmit={submit} className="panel p-7 flex flex-col gap-4">
        <h2 className="font-serif font-medium text-[19px]">Send feedback</h2>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHoverRating(n)}
              onMouseLeave={() => setHoverRating(0)}
              className={`text-[22px] leading-none transition-colors ${
                n <= (hoverRating || rating) ? "text-gold-400" : "text-navy-600"
              }`}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
            >
              ★
            </button>
          ))}
          <span className="text-[12px] text-ink-500 ml-2">{rating} / 5</span>
        </div>
        <textarea
          className="field min-h-[110px]"
          placeholder="What do you think of the site? What helped you, and what should we improve?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        {error && (
          <p className="form-error">
            {error.includes("account") ? (
              <>
                {error}{" "}
                <Link href="/signup?next=/feedback" className="underline text-gold-300">
                  Sign up free
                </Link>
              </>
            ) : (
              error
            )}
          </p>
        )}
        {msg && <p className="form-note text-gold-300">{msg}</p>}
        <button className="btn-primary self-start" disabled={busy}>
          {busy ? "Sending..." : "Send feedback"}
        </button>
      </form>

      <section className="flex flex-col gap-3">
        <h2 className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-gold-400">
          Published feedback ({items.length})
        </h2>
        {items.length === 0 ? (
          <p className="panel p-6 text-[13.5px] text-ink-500">
            No published feedback yet — be the first to leave a note.
          </p>
        ) : (
          items.map((item, i) => (
            <div key={i} className="panel p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[13.5px] font-medium">
                  {item.name} <span className="text-gold-400">{"★".repeat(item.rating)}</span>
                  <span className="text-ink-500">{"☆".repeat(5 - item.rating)}</span>
                </p>
                <p className="text-[11.5px] text-ink-500 flex-shrink-0">
                  {new Date(item.created_at + "Z").toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <p className="text-[13.5px] text-ink-300 leading-relaxed">{item.content}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
