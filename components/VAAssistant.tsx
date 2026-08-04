"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "model";
  content: string;
}

const SUGGESTIONS = [
  "How much should I charge as a beginner VA?",
  "How do I reply to a client who says I'm too expensive?",
  "What red flags should I look out for in job posts?",
  "Give me a LinkedIn connection request message.",
  "What should I say in my first interview?",
];

export default function VAAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [usageLeft, setUsageLeft] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;
    setError("");
    setInput("");
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, messages: next.slice(0, -1) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong — please try again.");
      } else {
        setMessages((m) => [...m, { role: "model", content: data.reply }]);
      }
    } catch {
      setError("Connection error — please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel flex flex-col" style={{ height: "min(640px, 75vh)" }}>
      <div className="px-6 py-4 border-b border-navy-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-gold-400">
            Thrive Assistant
          </p>
        </div>
        <p className="font-mono text-[11px] text-ink-500">40 messages / day · free</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {messages.length === 0 && (
          <div>
            <p className="text-[15px] text-ink-200 mb-1">
              Ask anything about getting hired as a VA — rates, negotiations, interviews, tools, or spotting scams.
            </p>
            <div className="flex flex-col gap-2 mt-5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-left text-[13.5px] text-ink-400 border border-navy-700 hover:border-gold-400 hover:text-gold-300 transition-colors rounded-md px-4 py-2.5"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-lg px-4 py-3 text-[14px] leading-relaxed whitespace-pre-wrap ${
              m.role === "user"
                ? "self-end bg-[rgba(217,169,78,0.14)] border border-gold-400/30 text-ink-100"
                : "self-start bg-navy-800 border border-navy-700 text-ink-300"
            }`}
          >
            {m.content}
          </div>
        ))}
        {busy && (
          <div className="self-start bg-navy-800 border border-navy-700 rounded-lg px-4 py-3 text-[14px] text-ink-500">
            Thinking…
          </div>
        )}
        {error && <p className="form-error text-center">{error}</p>}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="px-6 py-4 border-t border-navy-700 flex gap-3"
      >
        <input
          className="field flex-1"
          placeholder="Ask your question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn-primary !py-[10px]" disabled={busy}>
          Send
        </button>
      </form>
    </div>
  );
}
