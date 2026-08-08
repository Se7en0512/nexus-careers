import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { canChat, recordChat } from "@/lib/ai-usage";
import { logActivity } from "@/lib/activity";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const MAX_SIZE = 8 * 1024 * 1024; // 8MB

const PARSE_PROMPT = `You are a resume parser. Extract the following fields from the resume text and return ONLY valid JSON — no markdown code fences, no preamble, no commentary:

{
  "name": "string",
  "tagline": "string, one line, under 120 chars",
  "bio": "string, 2-4 sentences, under 1000 chars",
  "skills": ["array", "of", "strings", "max 15"],
  "experience": "string, summarized work history, under 2000 chars",
  "location": "string or empty",
  "languages": ["array of strings, max 5"]
}

Only extract information that is actually present in the resume text. Leave fields as empty strings/arrays if not found. Do not invent or assume information.`;

interface ParsedResume {
  name: string;
  tagline: string;
  bio: string;
  skills: string[];
  experience: string;
  location: string;
  languages: string[];
}

const MAX_LENGTHS = {
  name: 60,
  tagline: 120,
  bio: 1000,
  skill: 40,
  experience: 2000,
  location: 100,
  language: 30,
};

function clampString(value: unknown, max: number): string {
  return String(value ?? "").trim().slice(0, max);
}

function clampArray(value: unknown, max: number, itemMax: number): string[] {
  return (Array.isArray(value) ? value : [])
    .map((v) => String(v ?? "").trim().slice(0, itemMax))
    .filter(Boolean)
    .slice(0, max);
}

function stripFences(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
}

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const ip = getClientIp(req);
  if (!(await rateLimit(`resume-parse:${ip}`, 5, 30 * 60 * 1000))) {
    return NextResponse.json({ error: "Too many resume uploads — please wait 30 minutes." }, { status: 429 });
  }

  const usageCheck = await canChat(user.id);
  if (!usageCheck.allowed) {
    return NextResponse.json({ error: usageCheck.reason }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const ALLOWED = new Set([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]);
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Only PDF or DOCX files are allowed" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File must be under 8MB" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileType = file.type;

  let rawText: string;
  try {
    if (file.type === "application/pdf") {
      const parsed = await pdfParse(buffer);
      rawText = parsed.text;
    } else {
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value;
    }
  } catch {
    return NextResponse.json({ error: "Couldn't read this file — try a different format or paste your info manually." }, { status: 400 });
  }

  if (rawText.trim().length < 50) {
    return NextResponse.json({ error: "Couldn't read this file — try a different format or paste your info manually." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set");
    return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
  }

  let parsedJson: ParsedResume;
  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: PARSE_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: rawText.slice(0, 12000) }] }],
        generationConfig: { maxOutputTokens: 1500, temperature: 0.2 },
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "The AI service is unavailable right now — please try again later." }, { status: 502 });
    }

    const json = await res.json();
    const text: string | undefined = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return NextResponse.json({ error: "Couldn't process the resume, please try again or fill the form manually" }, { status: 502 });
    }

    parsedJson = JSON.parse(stripFences(text));
  } catch {
    return NextResponse.json({ error: "Couldn't process the resume, please try again or fill the form manually" }, { status: 502 });
  }

  await recordChat(user.id);
  await logActivity(user.id, "resume_parsed", { fileType });

  const data: ParsedResume = {
    name: clampString(parsedJson.name, MAX_LENGTHS.name),
    tagline: clampString(parsedJson.tagline, MAX_LENGTHS.tagline),
    bio: clampString(parsedJson.bio, MAX_LENGTHS.bio),
    skills: clampArray(parsedJson.skills, 15, MAX_LENGTHS.skill),
    experience: clampString(parsedJson.experience, MAX_LENGTHS.experience),
    location: clampString(parsedJson.location, MAX_LENGTHS.location),
    languages: clampArray(parsedJson.languages, 5, MAX_LENGTHS.language),
  };

  return NextResponse.json({ ok: true, data });
}
