import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { canChat, recordChat } from "@/lib/ai-usage";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const SYSTEM_PROMPT = `You are the Thrive assistant — a career advisor for Filipino virtual assistants who are starting out or trying to get hired by international/remote clients.

You help with practical things: setting rates (PHP to USD), negotiating with clients, writing application messages, preparing for interviews, choosing tools, avoiding job scams (never pay to get hired), and staying productive.

STRICT RULES:
- Answer in clear, plain English. Short, practical, and direct — no fluff.
- Give specific numbers, examples, or steps whenever possible (e.g. sample rate ranges, sample reply lines).
- If asked something unrelated to VA careers or work, politely redirect back to the topic.
- Never invent fees, taxes, or legal claims you're unsure about — say it's an estimate and to verify with the official source.
- Keep answers under 180 words unless the user asks for something longer.
- Do not ask unnecessary follow-up questions; give the best answer you can.`;

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  if (!(await rateLimit(getClientIp(req), 10, 60 * 1000))) {
    return NextResponse.json(
      { error: "You're sending messages too fast — please wait a moment." },
      { status: 429 }
    );
  }

  const usageCheck = await canChat(user.id);
  if (!usageCheck.allowed) {
    return NextResponse.json({ error: usageCheck.reason }, { status: 429 });
  }

  const data = await req.json().catch(() => null);
  const history: ChatMessage[] = Array.isArray(data?.messages) ? data.messages.slice(-10) : [];
  const content = String(data?.message || "").trim().slice(0, 2000);
  if (!content) {
    return NextResponse.json({ error: "Type a message first." }, { status: 400 });
  }

  const contents = [
    ...history.map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.content }] })),
    { role: "user", parts: [{ text: content }] },
  ];

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
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { maxOutputTokens: 700, temperature: 0.7 },
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "The AI assistant is unavailable right now — please try again later." },
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

    await recordChat(user.id);
    return NextResponse.json({ ok: true, reply: text.trim() });
  } catch {
    return NextResponse.json(
      { error: "There was a problem connecting to the AI service. Please try again." },
      { status: 502 }
    );
  }
}
