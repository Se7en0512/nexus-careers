"use client";

import { useRef, useState } from "react";

const NICHES = [
  { key: "general VA", label: "General VA" },
  { key: "social media VA", label: "Social Media VA" },
  { key: "content writer / SEO", label: "Content Writer / SEO" },
  { key: "customer support", label: "Customer Support" },
  { key: "bookkeeping", label: "Bookkeeping" },
  { key: "e-commerce (Amazon / Shopify)", label: "E-commerce (Amazon / Shopify)" },
  { key: "real estate VA", label: "Real Estate VA" },
  { key: "data entry / admin", label: "Data Entry / Admin" },
];

interface Round {
  question: string;
  answer: string;
  score: number;
  strengths: string;
  improvements: string;
}

export default function MockInterview() {
  const [stage, setStage] = useState<"setup" | "interview" | "done">("setup");
  const [niche, setNiche] = useState(NICHES[0].key);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [current, setCurrent] = useState<string>("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);
  const recRef = useRef<{ stop: () => void } | null>(null);

  const TOTAL = 5;

  const start = async () => {
    setError("");
    setBusy(true);
    setRounds([]);
    try {
      const res = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", niche }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setCurrent(data.question);
      setAnswer("");
      setStage("interview");
    } catch {
      setError("Connection error — please try again.");
    } finally {
      setBusy(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim() || busy) return;
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "answer",
          niche,
          question: current,
          answer,
          history: rounds.map((r) => ({ question: r.question, answer: r.answer })),
          total: TOTAL,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      const round: Round = {
        question: current,
        answer,
        score: data.score,
        strengths: data.strengths,
        improvements: data.improvements,
      };
      const nextRounds = [...rounds, round];
      setRounds(nextRounds);
      if (data.done || data.summary) {
        setCurrent(data.summary || "");
        setStage("done");
      } else {
        setCurrent(data.nextQuestion);
        setAnswer("");
      }
    } catch {
      setError("Connection error — please try again.");
    } finally {
      setBusy(false);
    }
  };

  const toggleVoice = () => {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    interface Rec {
      start: () => void;
      stop: () => void;
      lang: string;
      interimResults: boolean;
      onresult: (e: { results: { 0: { 0: { transcript: string } } } }) => void;
      onend: () => void;
    }
    const w = window as unknown as {
      SpeechRecognition?: new () => Rec;
      webkitSpeechRecognition?: new () => Rec;
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) {
      setError("Voice input isn't supported in this browser — type your answer instead.");
      return;
    }
    setError("");
    const rec = new Ctor();
    recRef.current = rec;
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (e) => {
      const text = e.results?.[0]?.[0]?.transcript || "";
      setAnswer((prev) => (prev ? prev + " " + text : text));
    };
    rec.onend = () => setListening(false);
    rec.start();
    setListening(true);
  };

  const scoreColor = (s: number) => (s >= 8 ? "text-green-400" : s >= 6 ? "text-gold-400" : "text-red-400");

  if (stage === "setup") {
    return (
      <div className="panel p-8 md:p-10 max-w-[640px]">
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-gold-400 mb-5">
          Mock interview · {TOTAL} questions · AI feedback
        </p>
        <h2 className="font-serif font-medium text-[24px] mb-6">Choose your niche, then get interviewed.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
          {NICHES.map((n) => (
            <button
              key={n.key}
              onClick={() => setNiche(n.key)}
              className={`text-left text-[13.5px] rounded-md px-4 py-2.5 border transition-colors ${
                niche === n.key
                  ? "border-gold-400 bg-[rgba(217,169,78,0.12)] text-gold-300"
                  : "border-navy-700 text-ink-300 hover:border-navy-500"
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>
        {error && <p className="form-error mb-5">{error}</p>}
        <button className="btn-primary" onClick={start} disabled={busy}>
          {busy ? "Starting…" : "Start the Interview"}
        </button>
        <p className="text-[13px] text-ink-500 mt-5 leading-relaxed">
          You'll get 5 realistic questions with a score and specific feedback after each answer,
          plus a final hiring recommendation. Practice out loud — say the words.
        </p>
      </div>
    );
  }

  const currentRound = rounds[rounds.length - 1];

  return (
    <div className="flex flex-col gap-6 max-w-[760px]">
      {rounds.map((r, i) => (
        <div key={i} className="panel p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-gold-400">Question {i + 1} of {TOTAL}</p>
            <span className={`font-mono text-[15px] font-semibold ${scoreColor(r.score)}`}>{r.score}/10</span>
          </div>
          <p className="text-[15px] text-ink-200 font-medium mb-3">{r.question}</p>
          <p className="text-[14px] text-ink-400 mb-3 whitespace-pre-wrap">{r.answer}</p>
          <div className="border-t border-navy-700 pt-3 flex flex-col gap-2">
            <p className="text-[13.5px] text-ink-300"><strong className="text-green-400">What worked: </strong>{r.strengths}</p>
            <p className="text-[13.5px] text-ink-300"><strong className="text-red-400">Improve: </strong>{r.improvements}</p>
          </div>
        </div>
      ))}

      {stage === "interview" && (
        <div className="panel p-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-gold-400 mb-3">
            Question {rounds.length + 1} of {TOTAL}
          </p>
          <p className="text-[16.5px] text-ink-100 font-medium mb-5">{current}</p>
          <textarea
            className="field min-h-[120px]"
            placeholder="Type or speak your answer — practice saying it out loud…"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          {error && <p className="form-error mt-3">{error}</p>}
          <div className="flex gap-3 mt-4">
            <button className="btn-secondary" onClick={toggleVoice} type="button">
              {listening ? "⏹ Stop recording" : "🎤 Speak your answer"}
            </button>
            <button className="btn-primary" onClick={submitAnswer} disabled={busy || !answer.trim()}>
              {busy ? "Evaluating…" : "Submit answer"}
            </button>
          </div>
        </div>
      )}

      {stage === "done" && (
        <div className="panel p-8 border-gold-400/40">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-gold-400 mb-3">Interview complete</p>
          <p className="text-[15.5px] text-ink-200 leading-relaxed mb-5">{current}</p>
          <button className="btn-primary" onClick={start} disabled={busy}>
            Take another interview
          </button>
        </div>
      )}
    </div>
  );
}
