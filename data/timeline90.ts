export interface TimelineItem {
  period: string;
  title: string;
  body: string;
  realTalk: string;
}
export const TIMELINE_90: TimelineItem[] = [
  {
    period: "WEEKS 1–2",
    title: "Onboarding and testing yourself",
    body: "You'll get asked a lot of questions. You won't yet know where the files live, how your client wants work formatted, or what's 'normal' in their workflow.",
    realTalk:
      "Real talk: it's normal to still be slow at this point. It's not a sign your client made the wrong choice.",
  },
  {
    period: "MONTH 1",
    title: "Finding your rhythm",
    body: "You're getting comfortable with the workflow, but you'll often doubt whether you're doing things right. A client rep might come late, and you'll wonder if you did something wrong.",
    realTalk:
      "Real talk: a slow response from the client is usually not about you — they're just busy. Don't jump to thinking it's a performance issue.",
  },
  {
    period: "MONTH 2",
    title: "The first real boundaries challenge",
    body: "This is where the first bit of 'scope creep' usually appears — requests for extra work outside the original agreement, or expectations to be reachable any time of day. This is also when fatigue first kicks in.",
    realTalk:
      "Real talk: saying 'this isn't part of what we agreed on — let's revisit that' isn't rude. It's professional.",
  },
  {
    period: "MONTH 3",
    title: "Measuring your value for the first time",
    body: "By now you can see clearly how much time and effort you're actually putting in — and whether the rate you agreed on at the start is fair.",
    realTalk:
      "Real talk: it's normal to feel your first rate was too low. This is the time to start thinking about a renegotiation or taking on another client.",
  },
];

export const NORMAL_FEELINGS = [
  {
    title: "Self-doubt",
    body: "Even if you're capable, some days you'll wonder if you're good enough. It's common in the first three months for any new VA.",
  },
  {
    title: "Waiting on a reply",
    body: "Silence from a client isn't always bad news. Often it's just their business keeping them busy.",
  },
  {
    title: "Not getting clear feedback",
    body: "Not every client is good at giving detailed feedback. It has nothing to do with your ability.",
  },
];

export interface NumberedItem {
  num: string;
  title: string;
  desc: string;
}

export const ONBOARDING_CHECKLIST: NumberedItem[] = [
  {
    num: "01",
    title: "Get the terms in writing",
    desc: "Even a short message will do: tasks, working hours, rate, payment schedule, and who handles taxes and fees. Send the acceptance-message template from the Templates page the moment they say 'yes.' A written agreement protects you both.",
  },
  {
    num: "02",
    title: "Set up the payment method",
    desc: "PayPal, Payoneer, Wise, or a direct bank transfer — talk through it before you start, not after. Clarify who covers transfer fees (usually the client covers them if you ask). Set a payment schedule: weekly or bi-weekly beats monthly for your cash flow.",
  },
  {
    num: "03",
    title: "Install core tools",
    desc: "One communication channel (Slack or WhatsApp), one project tracker (Asana or Trello), a free password manager (Bitwarden), and a time tracker. Learn them before day one — not during your first client meeting.",
  },
  {
    num: "04",
    title: "Write down the schedule",
    desc: "Their timezone, your overlap hours, their availability for meetings, and when they expect daily or weekly updates. Put it on your wall until you know it by heart.",
  },
  {
    num: "05",
    title: "Plan your backups",
    desc: "Internet: know your provider's support number and have a mobile hotspot plan. Files: turn on Google Drive backup for your work folders. Power: a UPS or a full battery. Test everything once before day one.",
  },
  {
    num: "06",
    title: "Plan for taxes (yes, really)",
    desc: "Once income starts, register as self-employed with the BIR and set aside 10–20% of every payment in a separate account. It hurts far less monthly than yearly. Get your invoices in order from day one.",
  },
];

export const EXPERIENCED_SECRETS: NumberedItem[] = [
  {
    num: "01",
    title: "Your first client unlocks everything after",
    desc: "The second, third, and fourth clients come faster because you have proof — reviews, testimonials, results. Every client advertises for the next one. Ask for referrals when they're happiest, not when you're desperate for work.",
  },
  {
    num: "02",
    title: "Retainers beat one-off gigs",
    desc: "One client paying you weekly for set tasks is more stable than three clients who each pay you once. When you finish a gig well, propose a monthly retainer.",
  },
  {
    num: "03",
    title: "Raise your rates with proof, not hope",
    desc: "Every three to six months, if you've been delivering, raise your rate. Show proof in one sentence: 'Since I started, your inbox has stayed at zero and you've saved about X hours per week.' Then state the new rate. Most clients say yes.",
  },
  {
    num: "04",
    title: "Learning to decline scope creep — politely",
    desc: "'Can you take care of this too?' is how VAs end up doing five jobs for one salary. The script: 'Happy to take that on — my rate for extra tasks is X. Shall I go ahead?' You're not refusing; you're pricing.",
  },
  {
    num: "05",
    title: "Keep a client book",
    desc: "Private notes per client: how they like to be addressed, their deadlines, pet peeves, even their coffee order. Never make a client repeat themselves twice. That alone keeps you and your clients loyal.",
  },
  {
    num: "06",
    title: "Direct outreach really works",
    desc: "Email small businesses directly — local agencies, online shops, coaches. Ten short emails about one specific task beat another proposal on a crowded platform.",
  },
  {
    num: "07",
    title: "Keep leveling up while you work",
    desc: "CRM, automation, reporting, bookkeeping basics — one new skill a quarter. Every certificate is leverage for your next raise, and every skill makes you the VA a client doesn't want to lose.",
  },
];

export const FIRST_WEEK: NumberedItem[] = [
  {
    num: "01",
    title: "Day one: the kickoff call",
    desc: "Ask three things: What does a good week look like to you? What do you value most from me? What should I never do? Their answers are your job description.",
  },
  {
    num: "02",
    title: "Send a summary at the end of each day",
    desc: "Three lines at day's end: what you did, what's next, and one question if you have one. Over-communicating in the first week isn't annoying — it's how they learn to trust you.",
  },
  {
    num: "03",
    title: "Ask early, even if the question sounds basic",
    desc: "'Just to confirm, X or Y?' is a 30-second message. A week of the wrong work is a reputation problem. Ask first, deliver after.",
  },
  {
    num: "04",
    title: "Deliver one thing early",
    desc: "Whatever the deadline is, finish one thing early that first week and say so: 'Done — this is yours a day ahead of schedule, look over whenever you can.' That you'll be remembered for.",
  },
  {
    num: "05",
    title: "End the week with a recap",
    desc: "A short Friday message: what's finished, what's queued for next week, and one request for feedback. The feedback you ask for is feedback you can use.",
  },
];

export const DAILY_SUMMARY_SCRIPT = `Hi [Name],

Quick update for today:

Done:
- [Task 1 — done, here: [where they can find it]]
- [Task 2 — done]
- [Task 3 — done]

Next:
- [Task 4 — due by [date/time]]
- [Task 5 — waiting on [information or access]]

Question: [one question, if you have one]

Have a good evening!
[Your Name]`;