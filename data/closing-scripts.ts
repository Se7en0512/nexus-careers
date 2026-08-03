export interface ScriptCard {
  key: string;
  title: string;
  scenario: string;
  tip: string;
  lines: string[];
}

export const CLOSING_SCRIPTS: ScriptCard[] = [
  {
    key: "introduction",
    title: "Introduction Message",
    scenario: "When you're reaching out to a client for the first time — direct message, job post, or referral.",
    tip: "At first, show insight into their problem — not your list of skills.",
    lines: [
      "Hi [name], I saw your post about [problem]. I've been through that myself when [context].",
      "I made my days easier back then by [specific result — 'cleaning the inbox from 400 to 20 emails in a week'].",
      "I'd like to do the same for you. Do you have 15 minutes this week where we can talk about your situation?",
      "— [name]",
    ],
  },
  {
    key: "rate",
    title: "Laying Out Your Rate",
    scenario: "When they ask 'how much do you charge?' before they even know what they need.",
    tip: "Don't give a number right away. Turn the question around to them so you learn how big their problem actually is — that's what the price is based on.",
    lines: [
      "It depends on the size of the job. To give you an exact price, I'll need to know:",
      "1. What's the most painful part of your day right now?",
      "2. How many hours per week do I need to cover?",
      "3. What budget range are you comfortable with?",
      "Once you answer, I'll come back with a clear quote — no hidden fees, no 'per task' surprises.",
    ],
  },
  {
    key: "trial",
    title: "Paid Trial Proposal",
    scenario: "When they say 'do it first, then we'll talk about payment' — or 'prove yourself first.'",
    tip: "Work has value even when it's a 'trial.' A paid trial stands in for the vetting process — quick for them, not wasted effort for you.",
    lines: [
      "I understand you'd like to see quality first. To be fair to both sides, here's what I'm proposing:",
      "I'll do [specific deliverable — e.g. 'one week of email management'] for [price].",
      "By the end of that week, you'll see the results directly — no commitment from me or from you.",
      "If you like what you see, we can continue regularly. I don't need any money upfront — after the week, I'll send the invoice.",
    ],
  },
  {
    key: "followup",
    title: "Follow-Up That Isn't Annoying",
    scenario: "Three days with no reply after an interview or proposal.",
    tip: "Following up isn't pushy — it's doing business. Send twice, spaced a week apart, then stop.",
    lines: [
      "Hi [name], just touching base on my proposal. I understand you're busy — if you've chosen someone else, let me know so I can allocate my time.",
      "I'll trim this down to one question: have you reached a decision?",
      "If not, no problem — but if you need any other details to decide, let me know and I'll send them right away.",
      "Thanks, — [name]",
    ],
  },
  {
    key: "objection",
    title: "Handling Objections",
    scenario: "When they say 'that's too expensive,' 'I found cheaper,' or 'I can do it myself.'",
    tip: "Don't drop your price right away. Lay out what they lose by not hiring you — that's where the value lives.",
    lines: [
      "I understand where you're coming from. Let me reframe it this way:",
      "What's an hour of your time worth to your business? If a VA is taking [hours] per week off your plate, I'm giving you back [hours] of time toward real work.",
      "Looked at that way, my rate is the cheapest way for you to buy time.",
      "And if there's a cheaper VA who's faster and more reliable — go with them, I respect that. What I won't do is lower the quality of my work.",
    ],
  },
  {
    key: "increase",
    title: "Rate Increase Request",
    scenario: "A year in, and the work has grown to 3x the original scope.",
    tip: "Don't wait until you're burned out to ask. A rate increase is a normal part of business — if they decline, at least you know where you stand.",
    lines: [
      "Hi [name], the work we've built together over the past year has been great — and I've enjoyed it.",
      "Since we started, I've taken on [list 2–3 new responsibilities]. To keep delivering the same quality, I'd like to adjust my rate from [current] to [new] starting [month].",
      "That's a 15% increase — I considered carefully what would be fair for both of us.",
      "Let me know if that works for you, and thank you for your trust.",
    ],
  },
  {
    key: "respectful",
    title: "Parting Ways – Gracefully",
    scenario: "When you need to end working with a client — late payments, poor communication, or pay that's fallen behind your rate.",
    tip: "Give 30 days' notice. Follow the contract you both signed. Keep a clean, professional mindset — you're the professional here.",
    lines: [
      "Hi [name], I'm grateful for everything we've done together over the past [period].",
      "However, I need to give 30 days' notice, starting [date]. I'll carry on normally until then so you have time to transition.",
      "I'm attaching [what I'm handing over — e.g. the list of accounts, documents, passwords and FAQ] to make the move easier for your next VA.",
      "My final invoice will arrive on [date]. Thank you — and if you need me in the future, I'm here.",
    ],
  },
  {
    key: "linkedin-connect",
    title: "LinkedIn Connection Request",
    scenario: "When you're cold-reaching out to small business owners, coaches, real estate agents, or e-commerce sellers — the 300-character limit is your friend.",
    tip: "Look for a visible pain point: slow replies, messy social media, a broken booking system. That's your opening. Never mass-send — ten honest messages beat a hundred generic ones.",
    lines: [
      "Hi [name] — I noticed [details from their profile, e.g. 'your coaching practice is growing fast']. I'm a VA who helps entrepreneurs run a clean inbox and schedule.",
      "I'd like to stay in your network — zero sales pitch, on my word.",
    ],
  },
  {
    key: "linkedin-followup",
    title: "LinkedIn Follow-Up After Accept",
    scenario: "They accepted your connection — send this within 48 hours.",
    tip: "Reference their pain from their posts. One small sample, free, no strings — that's the whole pitch.",
    lines: [
      "Hi [name], thanks for connecting!",
      "I'll keep it short — you posted about [their pain point or win], and I noticed [one specific detail]. I help business owners with [one task] so they can focus on [their real work].",
      "If that's useful, I'd love to send you a quick 5-minute example of how I'd handle it for you — free, no strings attached. Interested?",
      "— [Your Name]",
    ],
  },
  {
    key: "cold-email",
    title: "Cold Email — The One-Task Pitch",
    scenario: "For direct outreach to business owners with a visible problem — slow replies, no booking link, silence on social.",
    tip: "The opening line should prove you read their business — not a mass send. Offer one small free sample, not the whole menu.",
    lines: [
      "Subject: Quick thought on [their specific problem]",
      "Hi [name],",
      "I saw [business name] via [where], and I spotted [a specific observation — e.g. 'no replies on your recent Instagram comments' / 'no booking link on your contact page'].",
      "I'm a [niche] virtual assistant, and this is exactly the kind of thing I handle. As a demo, I put together [a small sample — e.g. 'a 5-line reply blueprint for your hottest comments' — link it here].",
      "If it helps, I'm happy to walk you through it in 10 minutes this week. No pressure either way — hope it's useful.",
      "— [Your Name]",
      "[Portfolio link / LinkedIn]",
    ],
  },
  {
    key: "discovery-call",
    title: "Discovery Call Cheat Sheet — The 8 Questions",
    scenario: "The 10-minute call that wins clients over. This isn't a pitch — it's a diagnosis. Better questions are what win.",
    tip: "Open warmly, not with a sales pitch: 'Thanks for making time — I'd like to hear what a typical week looks like for you and where it gets painful.' Get that tone right and half the work is done.",
    lines: [
      "1. What does a typical week look like for you?",
      "2. Which part eats up the most time?",
      "3. If you had a magic wand and could fix one thing, what would it be?",
      "4. What have you already tried to fix it?",
      "5. What would you do with the time you get back?",
      "6. Who else is counting on this working?",
      "7. What's your monthly budget for this kind of help?",
      "8. If we started today, what would a good first month look like to you?",
    ],
  },
  {
    key: "too-expensive",
    title: "When They Say 'Too Expensive'",
    scenario: "When your rate is over their budget — before you panic and lower, reframe the value.",
    tip: "Never discount on the spot. Show them what their time is worth, then offer a smaller entry point — not an uncalculated discount.",
    lines: [
      "I totally get it. Let's look at it this way: you mentioned you spend [X hours] a week on [task]. At my rate, that costs less than [what those hours are worth — e.g. 'a single client meeting'] — and it frees those hours for the work that actually grows your business.",
      "If the full package is too much right now, I can also start smaller: [a smaller package] at [a lower rate], and we grow from there. Which works better for you?",
    ],
  },
  {
    key: "think-about-it",
    title: "Answering 'I'll Think About It' — The Follow-Up Sequence",
    scenario: "They asked for time to think. Here's a one-week sequence that won't annoy.",
    tip: "No more than one message a week — you stop once they answer or you've moved on. The first follow-up delivers value, not pressure.",
    lines: [
      "Day 2: 'No rush at all — you've got a lot on your plate. To keep it fresh, the free sample I promised is linked here: [link]. Read it whenever you can.'",
      "Day 6: 'Hi [name] — one quick check-in. If the timing's not right, no problem. If it is, I can start this week — just say the word.'",
      "Beyond that: let it go. That's the whole sequence.",
    ],
  },
  {
    key: "referral",
    title: "Asking for Referrals While They're Happiest",
    scenario: "Right after a result they loved — that's the best moment for a referral and a testimonial.",
    tip: "Referrals should be effortless: you reach out to the person being referred. No pressure — and thank them even just for thinking of you.",
    lines: [
      "Hi [name] — thrilled that [which result they loved] worked this week!",
      "Quick question: do you know one or two business owners grinding through [their old problem]? I've got room for [1] more client and I'd love to help them the same way.",
      "If you're comfortable, I can reach out directly — you'd just be the one recommending me. No pressure, thanks either way!",
    ],
  },
];