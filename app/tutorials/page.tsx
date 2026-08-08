import type { Metadata } from "next";
import { TUTORIAL_CATEGORIES } from "@/data/tutorials";
import { getSkillQuiz } from "@/data/skill-quizzes";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import SkillQuiz from "@/components/SkillQuiz";
import LockedPreview from "@/components/LockedPreview";

export const metadata: Metadata = { title: "Tools Tutorials" };

export const dynamic = "force-dynamic";

export default async function TutorialsPage() {
  const user = await getSessionUser();
  if (!user)
    return (
      <LockedPreview
        eyebrow="Tools Tutorials"
        title="Learn the tools clients actually ask about."
        description="Eight categories, 30+ tools, and free tutorials from official sources — no paid courses, no gatekeeping."
        highlights={[
          "Step-by-step guides from official, free sources",
          "Skill quizzes to test what you've learned",
          "Jump straight to the category you need",
        ]}
        nextPath="/tutorials"
      />
    );

  const quizResults = (await db
    .prepare("SELECT skill_key, score, total, passed FROM skill_quiz_results WHERE user_id = ?")
    .all(user.id)) as Array<{ skill_key: string; score: number; total: number; passed: number }>;
  const resultByKey = new Map(quizResults.map((r) => [r.skill_key, r]));

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Tools Tutorials</div>
          <h1>Learn the tools <em className="italic text-gold-300">clients actually ask about</em>.</h1>
          <p>
            Eight categories, 30+ tools, and free tutorials from official sources —
            no paid courses, no gatekeeping. Learn one tool per category and
            you're already ahead of most applicants.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <nav className="flex flex-wrap gap-2 mb-14 font-mono text-[12px]">
          <span className="text-ink-500 uppercase tracking-[0.08em] self-center mr-1">Jump to</span>
          {TUTORIAL_CATEGORIES.map((c) => (
            <a key={c.key} href={`#${c.key}`} className="px-3 py-1.5 rounded-[3px] border border-navy-700 text-ink-300 hover:border-gold-400 hover:text-gold-300 transition-colors">
              {c.num} · {c.title.split("&")[0].trim()}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-20">
          {TUTORIAL_CATEGORIES.map((cat) => {
            const quiz = getSkillQuiz(cat.key);
            const existingResult = quiz
              ? (resultByKey.get(quiz.key) as { score: number; total: number; passed: number } | undefined) ?? null
              : null;
            return (
              <section key={cat.key} id={cat.key}>
                <div className="mb-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-400 mb-3">Category {cat.num}</p>
                  <h2 className="font-serif font-medium text-[28px] mb-3">{cat.title}</h2>
                  <p className="text-ink-300 max-w-[640px]">{cat.lead}</p>
                </div>

                <div className="flex flex-col gap-1 bg-navy-700 border border-navy-700 mb-6">
                  {cat.tools.map((t) => (
                    <a
                      key={t.name}
                      href={t.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-navy-900 hover:bg-navy-800 transition-colors p-6 flex flex-col md:flex-row md:items-center md:gap-8 group"
                    >
                      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-500 w-[130px] flex-shrink-0">
                        {t.name}
                      </span>
                      <div className="flex-1">
                        <p className="text-[14px] text-ink-300 max-w-[560px]">{t.desc}</p>
                      </div>
                      <span className="font-mono text-xs text-gold-400 mt-2 md:mt-0 whitespace-nowrap">
                        {t.label} →
                      </span>
                    </a>
                  ))}
                </div>

                {quiz && (
                  <SkillQuiz quiz={quiz} isLoggedIn={!!user} existingResult={existingResult} />
                )}
              </section>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-20">
          <a href="/courses" className="panel p-7 block group">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-2">Certificates</p>
            <h3 className="font-serif font-medium text-[20px] mb-2 group-hover:text-gold-300 transition-colors">Course Library</h3>
            <p className="text-[13.5px] text-ink-400">Free certificate courses in these very skills — Google, HubSpot, Microsoft, and more.</p>
            <span className="font-mono text-xs text-gold-400 mt-4 inline-block">See the courses →</span>
          </a>
          <a href="/codes" className="panel p-7 block group">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-2">Speed tools</p>
            <h3 className="font-serif font-medium text-[20px] mb-2 group-hover:text-gold-300 transition-colors">Codes for Efficiency</h3>
            <p className="text-[13.5px] text-ink-400">Formulas, filters, and shortcuts that turn these tools into time machines.</p>
            <span className="font-mono text-xs text-gold-400 mt-4 inline-block">Get the codes →</span>
          </a>
        </div>
      </div>
    </>
  );
}