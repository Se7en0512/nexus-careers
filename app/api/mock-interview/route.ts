import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { canGenerate, recordGeneration } from "@/lib/ai-usage";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const NICHES = [
  "general VA",
  "social media VA",
  "content writer / SEO",
  "customer support",
  "bookkeeping",
  "e-commerce (Amazon / Shopify)",
  "real estate VA",
  "data entry / admin",
];

interface QAPair {
  question: string;
  answer: string;
}

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  if (!rateLimit(getClientIp(req), 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "You're requesting too fast — please wait a few minutes." },
      { status: 429 }
    );
  }

  const usageCheck = await canGenerate(user.id);
  if (!usageCheck.allowed) {
    return NextResponse.json({ error: usageCheck.reason }, { status: 429 });
  }

  const data = await req.json().catch(() => null);
  const action = String(data?.action || "");
  const niche = String(data?.niche || "").trim();
  if (!NICHES.includes(niche)) {
    return NextResponse.json({ error: "Choose a niche first." }, { status: 400 });
  }

  let prompt = "";
  if (action === "start") {
    prompt = `You are conducting a mock job interview for a Filipino virtual assistant applying to a ${niche} position with a remote international client.

Ask the FIRST interview question. It should be a realistic, common question for a ${niche} VA role (introduction, experience, tools, or scenario-based).

Respond ONLY with JSON: {"question": "..."}
The question must be a direct question the interviewer would ask.`;
  } else if (action === "answer") {
    const history: QAPair[] = Array.isArray(data?.history) ? data.history.slice(-4) : [];
    const question = String(data?.question || "").trim().slice(0, 1000);
    const answer = String(data?.answer || "").trim().slice(0, 2000);
    const total = Math.min(Math.max(Number(data?.total) || 5, 2), 8);
    const done = history.length >= total - 1;

    if (!question || !answer) {
      return NextResponse.json({ error: "Answer the question first." }, { status: 400 });
    }

    const transcript = history
      .map((h, i) => `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}`)
      .join("\n\n");

    prompt = `You are evaluating a Filipino VA interviewing for a ${niche} role with a remote international client.

QUESTION ASKED: ${question}

CANDIDATE'S ANSWER: ${answer}

${transcript ? `PREVIOUS Q&A:\n${transcript}` : ""}

${done ? `This was the last question (${total} total). Evaluate the full interview and give:
- an overall score from 1-10
- a one-paragraph overall summary with a recommendation on whether to hire this candidate

Respond ONLY with JSON: {"score": <1-10>, "strengths": "...", "improvements": "...", "summary": "..."}` : `Evaluate the answer:
- score: 1-10
- strengths: what worked, 1-2 sentences
- improvements: what to change, 1-2 sentences, very specific
Then ask the NEXT realistic interview question for a ${niche} VA role (different from previous ones).

Respond ONLY with JSON: {"score": <1-10>, "strengths": "...", "improvements": "...", "nextQuestion": "..."}`}`;
  } else {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set");
    return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.7,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "The interview coach is unavailable right now — please try again later." },
        { status: 502 }
      );
    }

    const json = await res.json();
    const text: string | undefined = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return NextResponse.json(
        { error: "Nothing was generated — please try again." },
        { status: 502 }
      );
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {};
    }

    await recordGeneration(user.id);
    if (action === "start") {
      return NextResponse.json({
        ok: true,
        question: String(parsed.question || "Tell me about yourself and why you're applying."),
      });
    }
    return NextResponse.json({
      ok: true,
      score: Number(parsed.score ?? 0),
      strengths: String(parsed.strengths || ""),
      improvements: String(parsed.improvements || ""),
      nextQuestion: parsed.nextQuestion ? String(parsed.nextQuestion) : null,
      summary: parsed.summary ? String(parsed.summary) : null,
      done: Boolean(parsed.summary),
    });
  } catch {
    return NextResponse.json(
      { error: "There was a problem connecting to the AI service. Please try again." },
      { status: 502 }
    );
  }
}
