"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EXPERIENCE_OPTIONS = [
  { value: "new", label: "I'm completely new to Virtual Assistance" },
  { value: "some", label: "I have some VA experience" },
  { value: "switching", label: "I'm switching careers" },
  { value: "freelancing", label: "I'm already freelancing" },
];

const GOAL_OPTIONS = [
  { value: "first_client", label: "Get my first client" },
  { value: "learn_skills", label: "Learn new VA skills" },
  { value: "resume", label: "Build a professional resume" },
  { value: "portfolio", label: "Improve my portfolio" },
  { value: "interviews", label: "Practice interviews" },
  { value: "earn_more", label: "Earn more as a VA" },
];

const TIME_OPTIONS = [
  { value: "lt5", label: "Less than 5 hours" },
  { value: "5-10", label: "5–10 hours" },
  { value: "10-20", label: "10–20 hours" },
  { value: "20+", label: "More than 20 hours" },
];

const INTEREST_OPTIONS = [
  "Customer Support",
  "Executive Assistant",
  "Social Media",
  "Graphic Design",
  "Video Editing",
  "Bookkeeping",
  "Cold Calling",
  "Lead Generation",
  "Appointment Setting",
  "General Virtual Assistant",
];

export default function WelcomeWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [experience, setExperience] = useState("");
  const [goal, setGoal] = useState("");
  const [time, setTime] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const complete = async () => {
    setSaving(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experience_level: experience,
          main_goal: goal,
          weekly_hours: time,
          interests,
        }),
      });
    } catch {
      // proceed anyway
    }
    router.push("/dashboard");
    router.refresh();
  };

  const canNext = () => {
    if (step === 0) return true;
    if (step === 1) return !!experience;
    if (step === 2) return !!goal;
    if (step === 3) return !!time;
    if (step === 4) return interests.length > 0;
    return true;
  };

  const progress = step === 5 ? 100 : Math.round((step / 5) * 100);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[560px]">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-[3px] bg-navy-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {step > 0 && step < 5 && (
            <p className="font-mono text-[10.5px] text-ink-500 mt-2 text-right">
              Step {step} of 5
            </p>
          )}
        </div>

        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="text-center">
            <div className="text-[56px] mb-4">🎉</div>
            <h1 className="font-serif text-[32px] font-medium mb-3">
              Welcome to Thrive PH!
            </h1>
            <p className="text-[16px] text-ink-500 mb-2 max-w-[400px] mx-auto">
              We&apos;re excited to help you start your VA journey. Let&apos;s personalize your experience — it only takes a minute.
            </p>
            <button onClick={() => setStep(1)} className="btn-primary mt-8">
              GET STARTED →
            </button>
          </div>
        )}

        {/* Step 1: Experience */}
        {step === 1 && (
          <div>
            <div className="eyebrow mb-4">Step 1</div>
            <h2 className="font-serif text-[26px] font-medium mb-2">
              What best describes you?
            </h2>
            <p className="text-[14px] text-ink-500 mb-6">
              This helps us tailor your roadmap.
            </p>
            <div className="space-y-3">
              {EXPERIENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setExperience(opt.value)}
                  className={`w-full text-left p-4 rounded-[3px] border transition-colors ${
                    experience === opt.value
                      ? "border-gold-400 bg-gold-400/10 text-ink-50"
                      : "border-navy-700 bg-navy-900 text-ink-500 hover:border-navy-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        experience === opt.value
                          ? "border-gold-400"
                          : "border-navy-600"
                      }`}
                    >
                      {experience === opt.value && (
                        <div className="w-2 h-2 rounded-full bg-gold-400" />
                      )}
                    </div>
                    <span className="text-[14.5px]">{opt.label}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(0)} className="btn-secondary flex-1">
                ← Back
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!canNext()}
                className="btn-primary flex-1 disabled:opacity-40"
              >
                CONTINUE →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Goal */}
        {step === 2 && (
          <div>
            <div className="eyebrow mb-4">Step 2</div>
            <h2 className="font-serif text-[26px] font-medium mb-2">
              What is your main goal?
            </h2>
            <p className="text-[14px] text-ink-500 mb-6">
              Pick the one that matters most to you right now.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GOAL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setGoal(opt.value)}
                  className={`text-left p-4 rounded-[3px] border transition-colors ${
                    goal === opt.value
                      ? "border-gold-400 bg-gold-400/10 text-ink-50"
                      : "border-navy-700 bg-navy-900 text-ink-500 hover:border-navy-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        goal === opt.value ? "border-gold-400" : "border-navy-600"
                      }`}
                    >
                      {goal === opt.value && (
                        <div className="w-2 h-2 rounded-full bg-gold-400" />
                      )}
                    </div>
                    <span className="text-[14px]">{opt.label}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canNext()}
                className="btn-primary flex-1 disabled:opacity-40"
              >
                CONTINUE →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Time */}
        {step === 3 && (
          <div>
            <div className="eyebrow mb-4">Step 3</div>
            <h2 className="font-serif text-[26px] font-medium mb-2">
              How much time can you dedicate each week?
            </h2>
            <p className="text-[14px] text-ink-500 mb-6">
              There&apos;s no wrong answer — we&apos;ll adjust accordingly.
            </p>
            <div className="space-y-3">
              {TIME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTime(opt.value)}
                  className={`w-full text-left p-4 rounded-[3px] border transition-colors ${
                    time === opt.value
                      ? "border-gold-400 bg-gold-400/10 text-ink-50"
                      : "border-navy-700 bg-navy-900 text-ink-500 hover:border-navy-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        time === opt.value ? "border-gold-400" : "border-navy-600"
                      }`}
                    >
                      {time === opt.value && (
                        <div className="w-2 h-2 rounded-full bg-gold-400" />
                      )}
                    </div>
                    <span className="text-[14.5px]">{opt.label}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1">
                ← Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!canNext()}
                className="btn-primary flex-1 disabled:opacity-40"
              >
                CONTINUE →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Interests */}
        {step === 4 && (
          <div>
            <div className="eyebrow mb-4">Step 4</div>
            <h2 className="font-serif text-[26px] font-medium mb-2">
              Choose your interests
            </h2>
            <p className="text-[14px] text-ink-500 mb-6">
              Select one or more — we&apos;ll recommend resources based on these.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2.5 rounded-full border text-[13.5px] transition-colors ${
                    interests.includes(interest)
                      ? "border-gold-400 bg-gold-400/10 text-gold-300"
                      : "border-navy-700 bg-navy-900 text-ink-500 hover:border-navy-600"
                  }`}
                >
                  {interests.includes(interest) && "✓ "}
                  {interest}
                </button>
              ))}
            </div>
            {interests.length > 0 && (
              <p className="font-mono text-[11px] text-ink-500 mt-3">
                {interests.length} selected
              </p>
            )}
            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(3)} className="btn-secondary flex-1">
                ← Back
              </button>
              <button
                onClick={() => setStep(5)}
                disabled={!canNext()}
                className="btn-primary flex-1 disabled:opacity-40"
              >
                CONTINUE →
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Complete */}
        {step === 5 && (
          <div className="text-center">
            <div className="text-[56px] mb-4">🎉</div>
            <h1 className="font-serif text-[32px] font-medium mb-3">
              You&apos;re all set!
            </h1>
            <p className="text-[16px] text-ink-500 mb-2 max-w-[400px] mx-auto">
              Based on your answers, we&apos;ve personalized your Thrive PH experience. Let&apos;s start building your VA career.
            </p>
            <button
              onClick={complete}
              disabled={saving}
              className="btn-primary mt-8"
            >
              {saving ? "Saving..." : "GO TO MY DASHBOARD →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
