import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { PROMPT_STAGES, PROMPT_STEPS, PROMPT_RULES } from "@/data/prompts";
import CopyScript from "@/components/CopyScript";

export const metadata: Metadata = { title: "AI Tools — Prompt Library & GPT Bots" };

export const dynamic = "force-dynamic";

const GPT_BOTS = [
  {
    key: "resume",
    label: "Resume Bot",
    desc: "Tailors your resume to any job post. Paste the job description and your raw facts — it writes a one-page resume optimized for that role.",
    href: "https://chatgpt.com/g/g-resume-nexus",
    stage: "Stage 1",
  },
  {
    key: "cover",
    label: "Cover Letter Bot",
    desc: "Writes a cover letter using the hook/fit/proof/ask method. Paste the job post and your details — it produces two versions: formal and friendly.",
    href: "https://chatgpt.com/g/g-cover-nexus",
    stage: "Stage 1",
  },
  {
    key: "interview",
    label: "Interview Bot",
    desc: "Acts as the hiring manager. Runs a mock interview, scores your answers, and gives specific feedback on clarity, relevance, and confidence.",
    href: "https://chatgpt.com/g/g-interview-nexus",
    stage: "Stage 2",
  },
  {
    key: "outreach",
    label: "Outreach Bot",
    desc: "Writes cold outreach emails, discovery call scripts, and handles client objections — all with natural, human-sounding language.",
    href: "https://chatgpt.com/g/g-outreach-nexus",
    stage: "Stage 3",
  },
  {
    key: "daily",
    label: "Daily Summary Bot",
    desc: "Turns your raw work notes into a clean, client-friendly daily summary. Three sections: Done, Next, One question.",
    href: "https://chatgpt.com/g/g-daily-nexus",
    stage: "Stage 4",
  },
];

export default async function PromptsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/signup?next=/prompts");

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">AI Tools</div>
          <h1>Your AI co-pilot for the <em className="italic text-gold-300">entire hiring journey</em>.</h1>
          <p>
            Custom GPT bots + prompt library + step-by-step guides. Paste the job post,
            fill in your details, and get professional results in seconds.
            No subscription needed. The AI drafts; you make it yours.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        {/* GPT Bots */}
        <section className="mb-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-400 mb-4">GPT Bots</p>
          <h2 className="font-serif font-medium text-[28px] mb-8">Specialist bots for each career stage.</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GPT_BOTS.map((bot) => (
              <a
                key={bot.key}
                href={bot.href}
                target="_blank"
                rel="noopener noreferrer"
                className="panel p-6 block group hover:border-gold-400/50 transition-colors"
              >
                <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-2">{bot.stage}</p>
                <h3 className="font-serif font-medium text-[17px] mb-2 group-hover:text-gold-300 transition-colors">{bot.label}</h3>
                <p className="text-[13.5px] text-ink-400 leading-relaxed">{bot.desc}</p>
                <span className="font-mono text-xs text-gold-400 mt-4 inline-block">Open in ChatGPT →</span>
              </a>
            ))}
          </div>
          <p className="text-[12.5px] text-ink-500 mt-6">
            GPT links are placeholder URLs — create your own custom GPTs on ChatGPT and update the links.
            Each bot uses the prompts from the library below as its system instructions.
          </p>
        </section>

        {/* Before You Start */}
        <section className="mb-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-400 mb-4">Before you open a bot</p>
          <h2 className="font-serif font-medium text-[28px] mb-8">Gather your materials first.</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {PROMPT_STEPS.map((s) => (
              <div key={s.num} className="panel p-7">
                <span className="font-mono text-[11px] text-gold-400">{s.num}</span>
                <h3 className="font-serif font-medium text-[18px] mt-2 mb-2">{s.title}</h3>
                <p className="text-[13.5px] text-ink-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Prompt Library */}
        <nav className="flex flex-wrap gap-2 mb-16 font-mono text-[12px]">
          <span className="text-ink-500 uppercase tracking-[0.08em] self-center mr-1">Jump to</span>
          {PROMPT_STAGES.map((st) => (
            <a key={st.key} href={`#${st.key}`} className="px-3 py-1.5 rounded-[3px] border border-navy-700 text-ink-300 hover:border-gold-400 hover:text-gold-300 transition-colors">
              {st.title}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-20">
          {PROMPT_STAGES.map((stage) => (
            <section key={stage.key} id={stage.key}>
              <div className="mb-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-400 mb-3">{stage.stage}</p>
                <h2 className="font-serif font-medium text-[28px] mb-3">{stage.title}</h2>
                <p className="text-ink-300 max-w-[640px]">{stage.lead}</p>
              </div>

              <div className="flex flex-col gap-4">
                {stage.blocks.map((b) => (
                  <div key={b.key} className="panel">
                    <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-navy-700">
                      <p className="font-mono text-[12.5px] text-gold-300">{b.label}</p>
                      <CopyScript script={b.content} />
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-[13.5px] text-ink-300 leading-relaxed p-6 bg-navy-950 max-h-[460px] overflow-y-auto">
                      {b.content}
                    </pre>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-400 mb-4">Keep it human</p>
          <h2 className="font-serif font-medium text-[28px] mb-6">The golden rules <em className="italic text-gold-300">of using AI</em></h2>
          <div className="border-l-2 border-gold-400 pl-6 max-w-[720px]">
            <p className="text-[15px] text-ink-200 mb-4 font-medium">The AI drafts. You deliver. Those are different jobs.</p>
            <ul className="flex flex-col gap-3">
              {PROMPT_RULES.map((r, i) => (
                <li key={i} className="text-[14px] text-ink-300 leading-relaxed flex gap-3">
                  <span className="text-gold-400 font-mono text-[12px] mt-0.5">—</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-4 mt-20">
          <a href="/tools/cover-letter" className="panel p-7 block group">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-2">Pre-written templates</p>
            <h3 className="font-serif font-medium text-[20px] mb-2 group-hover:text-gold-300 transition-colors">Job Kit</h3>
            <p className="text-[13.5px] text-ink-400">Pre-written resume, cover letter, and message templates — the no-AI version, for times you just want it done.</p>
            <span className="font-mono text-xs text-gold-400 mt-4 inline-block">Open the templates →</span>
          </a>
          <a href="/tools/cover-letter" className="panel p-7 block group">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-2">Human-led practice</p>
            <h3 className="font-serif font-medium text-[20px] mb-2 group-hover:text-gold-300 transition-colors">Cover Letter Builder</h3>
            <p className="text-[13.5px] text-ink-400">Write a professional cover letter with the hook/fit/proof/ask method — no AI required.</p>
            <span className="font-mono text-xs text-gold-400 mt-4 inline-block">Open the Cover Letter Builder →</span>
          </a>
        </div>
      </div>
    </>
  );
}