import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TIMELINE_90, NORMAL_FEELINGS, ONBOARDING_CHECKLIST, EXPERIENCED_SECRETS, FIRST_WEEK, DAILY_SUMMARY_SCRIPT } from "@/data/timeline90";
import CopyScript from "@/components/CopyScript";
import LockedPreview from "@/components/LockedPreview";
import OnboardingChecklist from "@/components/OnboardingChecklist";

export const metadata: Metadata = { title: "The First 90 Days" };

export const dynamic = "force-dynamic";

function NumberedList({ items, gold }: { items: { num: string; title: string; desc: string }[]; gold?: boolean }) {
  return (
    <div className="flex flex-col gap-1 bg-navy-700 border border-navy-700">
      {items.map((item) => (
        <div key={item.num} className="bg-navy-900 p-6 flex flex-col md:flex-row md:gap-8">
          <span className={`font-mono text-[11px] w-[36px] flex-shrink-0 ${gold ? "text-gold-400" : "text-ink-500"}`}>
            {item.num}
          </span>
          <div>
            <h3 className="font-semibold text-[16.5px] mb-1.5">{item.title}</h3>
            <p className="text-[14px] text-ink-400 leading-relaxed max-w-[620px]">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function NinetyDaysPage() {
  const user = await getSessionUser();
  if (!user)
    return (
      <LockedPreview
        eyebrow="Real Talk"
        title="The truth about your first three months."
        description="Most online advice stops at 'how to land your first client.' But the first 90 days after that — that's where the real test is. Here's what to expect, based on real experience."
        highlights={[
          "What each month really feels like — no sugarcoating",
          "The onboarding checklist that sets week one up",
          "Daily summary template you can copy today",
        ]}
        nextPath="/first-90-days"
      />
    );

  const savedRows = (await db
    .prepare("SELECT item_num FROM onboarding_checklist_progress WHERE user_id = ?")
    .all(user.id)) as Array<{ item_num: string }>;
  const savedItemNums = savedRows.map((r) => r.item_num);

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Real Talk</div>
          <h1>The truth about your first three months.</h1>
          <p>
            Most online advice stops at "how to land your first client." But the
            first 90 days after that — that's where the real test is. Here's what
            to expect, based on real experience.
          </p>
        </div>
      </section>

      <section className="py-20 border-b border-navy-700">
        <div className="wrap">
          {TIMELINE_90.map((item) => (
            <div key={item.period} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-3 md:gap-10 py-10 border-t border-navy-700 first:border-t-0">
              <div className="font-mono text-[13px] text-gold-400 tracking-[0.04em]">{item.period}</div>
              <div>
                <h3 className="font-serif font-medium text-[22px] mb-3">{item.title}</h3>
                <p className="text-[15px] text-ink-300 max-w-[620px] mb-2.5">{item.body}</p>
                <div className="text-sm text-ink-500 border-l-2 border-gold-400 pl-4 mt-3.5 max-w-[600px]">
                  {item.realTalk}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 border-b border-navy-700">
        <div className="wrap">
          <div className="section-head mb-4">
            <div className="eyebrow">Before day one</div>
            <h2>The onboarding checklist — set yourself up right.</h2>
            <p>
              The first week makes or breaks the relationship. Use the week before it to
              set up everything below, so your first day is smooth and confident.
            </p>
          </div>
          <OnboardingChecklist items={ONBOARDING_CHECKLIST} initialDone={savedItemNums} />
        </div>
      </section>

      <section className="py-20 border-b border-navy-700">
        <div className="wrap">
          <div className="section-head mb-4">
            <div className="eyebrow">Day 1–7</div>
            <h2>The first week playbook.</h2>
            <p>
              You don't have to be perfect this week. You have to be present,
              organized, and impossible to forget.
            </p>
          </div>
          <NumberedList items={FIRST_WEEK} />

          <div className="panel mt-8">
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-navy-700">
              <p className="font-mono text-[12.5px] text-gold-300">Daily summary template — use it every day in the first week</p>
              <CopyScript script={DAILY_SUMMARY_SCRIPT} />
            </div>
            <pre className="whitespace-pre-wrap font-sans text-[13.5px] text-ink-300 leading-relaxed p-6 bg-navy-950 max-h-[460px] overflow-y-auto">
              {DAILY_SUMMARY_SCRIPT}
            </pre>
          </div>
        </div>
      </section>

      <section className="py-20 border-b border-navy-700">
        <div className="wrap">
          <div className="section-head mb-4">
            <div className="eyebrow">The experienced VA's perspective</div>
            <h2>What they wish they'd known from day one.</h2>
            <p>
              Ask any VA who's been in the game for two years, and they'll all say the same
              seven things. Here they are, in order of relevance.
            </p>
          </div>
          <NumberedList items={EXPERIENCED_SECRETS} />
        </div>
      </section>

      <section className="py-20">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">This Is Normal</div>
            <h2>Feelings that are common to experience but rarely talked about.</h2>
            <p>
              This isn't a list of "what you should do." Its only purpose is for you to know that
              you're not alone when you feel these.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-navy-700 border border-navy-700">
            {NORMAL_FEELINGS.map((n) => (
              <div key={n.title} className="bg-navy-900 p-[26px]">
                <h4 className="font-semibold text-[15px] mb-2">{n.title}</h4>
                <p className="text-[13.5px] text-ink-500">{n.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
