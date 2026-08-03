import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { canGenerate, recordGeneration } from "@/lib/ai-usage";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

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
  const jobDescription = String(data?.jobDescription || "").trim().slice(0, 2000);
  if (!jobDescription) {
    return NextResponse.json({ error: "A job description is required." }, { status: 400 });
  }

  const portfolio = (await db
    .prepare("SELECT * FROM portfolios WHERE user_id = ?")
    .get(user.id)) as { name: string; bio: string; skills: string; experience: string } | undefined;
  if (!portfolio) {
    return NextResponse.json(
      { error: "Create your portfolio first before generating a cover letter." },
      { status: 400 }
    );
  }

  const skills = JSON.parse(portfolio.skills) as string[];

  const systemPrompt = `You are a professional cover letter writer for Filipino virtual assistants applying to remote/international clients.

STRICT RULES:
- Only use the candidate background provided below. Never invent experience, skills, employers, or achievements not present in the given data.
- If the provided background is thin, write a shorter, honest letter rather than padding it with fabricated claims.
- Tone: professional, warm, confident — not robotic, not overly formal.
- Output plain text only. No markdown, no headers, no bullet points, no signature block placeholder text like "[Your Name]" — use the candidate's actual name.
- Length: 200-300 words.

CANDIDATE BACKGROUND:
Name: ${portfolio.name}
Bio: ${portfolio.bio}
Skills: ${skills.join(", ")}
Experience: ${portfolio.experience}

JOB DESCRIPTION THE CANDIDATE IS APPLYING TO:
${jobDescription}

Write the cover letter now.`;

  try {
    const res = await fetch(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: { maxOutputTokens: 600, temperature: 0.7 },
        }),
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "AI generation is unavailable right now — please try again later." },
        { status: 502 }
      );
    }

    const json = await res.json();
    const text: string | undefined =
      json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return NextResponse.json(
        { error: "Nothing was generated — please try again." },
        { status: 502 }
      );
    }

    await recordGeneration(user.id);
    return NextResponse.json({ ok: true, letter: text.trim() });
  } catch {
    return NextResponse.json(
      { error: "There was a problem connecting to the AI service. Please try again." },
      { status: 502 }
    );
  }
}