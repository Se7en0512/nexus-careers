export interface PromptBlock {
  key: string;
  label: string;
  content: string;
}

export interface PromptStage {
  key: string;
  stage: string;
  title: string;
  lead: string;
  blocks: PromptBlock[];
}

export const PROMPT_STAGES: PromptStage[] = [
  {
    key: "apps",
    stage: "Stage 1",
    title: "Your applications",
    lead: "Resume, cover letter, profile — the documents every application needs. Feed the AI the full job post, and these prompts will do the heavy lifting.",
    blocks: [
      {
        key: "resume",
        label: "Resume writer — tailored to a specific job post",
        content: `You are a hiring manager at a virtual assistant agency, not a resume writer.

I'll paste a job post below. Then I'll paste my raw facts: skills, certificates, experience (even school orgs and volunteer work), and my equipment setup.

Job post: [paste the FULL job post]

My facts:
- Skills: [list them]
- Certificates: [list them]
- Experience: [list them, even unpaid work]
- Equipment: [one line]

Write me a one-page resume:
1. Headline: "Virtual Assistant — [niche]" that matches the post.
2. Summary: one sentence that answers their biggest need from the post.
3. Skills: only the ones relevant to THIS POST, ranked by relevance.
4. Experience: numbered bullets framed for this role. Keep the facts honest — never invent experience.
5. Certificates ranked by relevance.

Keep it scannable. No adjectives without evidence. If my facts don't match the post, tell me what I should learn or do instead of faking it.`,
      },
      {
        key: "review",
        label: "Resume reviewer — honest, against the job post",
        content: `You are a skeptical recruiter reading 100 resumes in a day.

Here's my resume: [paste your resume]

Here's the job post I'm applying to: [paste the FULL job post]

1. Score my resume 0-10 as a match for THIS POST.
2. List the three biggest gaps between my resume and their requirements.
3. For each gap, give ONE specific fix — with exact wording.
4. Find every vague phrase ("fast learner", "hardworking") and rewrite it with evidence-backed alternatives.
5. Tell me the first line a human recruiter would read — is it strong?

Be brutally honest. If I shouldn't apply to this job yet, tell me and show me exactly what to do first.`,
      },
      {
        key: "cover",
        label: "Cover letter — the hook/fit/proof/ask method",
        content: `You are a virtual assistant with 3 years of experience writing cover letters that get responses. Follow the four-line method: hook, fit, proof, ask.

Job post: [paste the FULL job post]
My details: [name, niche, certificate, one sample I can link]
Sample link: [link or write "I will attach it separately"]

Write a cover letter that:
1. HOOK: starts with ONE specific sentence about the client's business or problem from their post — proof I actually read it.
2. FIT: two sentences — who I am and what I bring.
3. PROOF: reference the sample I'm attaching and what it proves.
4. ASK: a 15-minute call this week, with my two preferred time windows.

No clichés, no "I am writing to express my interest", no paragraphs longer than two sentences. Give me 2 versions: one formal, one friendly.`,
      },
      {
        key: "linkedin",
        label: "LinkedIn headline and profile summary",
        content: `You are a career coach for Filipino virtual assistants.

My facts: [niche, skills, certificates, one result or sample]

1. Write 5 LinkedIn headline options (220 characters each) that make a client think "this person can solve my problem." Make each one different: one skill-first, one result-first, one niche-first, one plain, one with a number.
2. Write the profile "About" section (max 150 words): the first line states who I help and how; prove it in the middle with a sample or certificate; end with a clear call to action.
3. Write a matching freelancing-platform bio (Upwork/OnlineJobs.ph, 80 words) — warmer, less formal than LinkedIn.

No buzzwords like "passionate" or "results-driven".`,
      },
    ],
  },
  {
    key: "interviews",
    stage: "Stage 2",
    title: "Your interviews",
    lead: "Practice with AI before the real thing. It can act as the interviewer, score your answers, and write your intro.",
    blocks: [
      {
        key: "mock",
        label: "Mock interview — the AI acts as the client",
        content: `Act as a hiring manager interviewing me for this role.

Job post: [paste the FULL job post]
My background: [one line: niche, certificates, no experience]

Run a realistic interview with me:
1. Ask ONE question at a time. Wait for my answer before the next.
2. Cycle through: opening questions, behavioral questions, equipment questions, and rate questions.
3. After each answer, give me a brief note: what you liked, what was weak, and a stronger way to say it.
4. After 8 questions, give a scorecard: clarity, relevance, confidence, and my top 3 weakest answers that need fixing.

Start with "Tell me about yourself."`,
      },
      {
        key: "intro",
        label: "Tell me about yourself — 60-second version",
        content: `Write me a 60-second spoken intro for a job interview.

Formula: name + one skill + one proof + what I want.

My facts:
- Name: [name]
- Skill: [one, my strongest]
- Proof: [finished certificate, completed sample, or result]
- Goal: [e.g., long-term client as a [niche] VA]

Guidelines:
1. Sound like a real person speaking, not a resume being read aloud.
2. No sentence longer than 12 words.
3. End with a friendly redirect to them: something like "I'd love to hear what a typical week looks like for you."
4. Write this as a script I can practice out loud.`,
      },
      {
        key: "rate",
        label: 'Answer to "how much do you charge?"',
        content: `I'm a VA with [certificates] and [samples]. A client asked my rate during the interview.

I want to charge [target rate] per hour, but I'm open to a retainer at a slightly better rate.

Write me 3 ways to answer "how much is your rate?":
1. Confident version (I state my rate without asking for negotiation).
2. Retainer version (I offer a monthly package rate).
3. Negotiation version (they said it's too high — I hold my value and floor without sounding desperate).

Each answer is max 4 sentences, plain spoken English.`,
      },
    ],
  },
  {
    key: "clients",
    stage: "Stage 3",
    title: "Getting clients",
    lead: "Direct outreach, discovery calls, and the trickier money conversations — with scripts that sound natural.",
    blocks: [
      {
        key: "outreach",
        label: "Cold outreach email — one specific task",
        content: `Write me a short cold email for a small business owner.

Their business: [business name + what they do]
What I noticed about them: [one specific observation — slow replies, no booking link, messy social media, etc.]
What I do: [niche] virtual assistant
One sample of my work: [what it is + link]

Guidelines:
1. Subject line under 6 words, no clickbait.
2. The opening sentence references my observation ABOUT THEM — proof this isn't a mass email.
3. Offer exactly ONE small task as a free demonstration.
4. Ask for a 10-minute call, this week, no pressure.
5. Total under 120 words. No "I hope this email finds you well."`,
      },
      {
        key: "dcall",
        label: "Discovery call — my question list",
        content: `I have a discovery call with a [type of business] who might hire me as a [niche] VA.

Their situation (what I know): [what you know about them]

Write a discovery call script:
1. A warm 2-sentence opening (not salesy).
2. 8 questions in order: start broad (their week), narrow to their biggest time-waster, then money and next steps.
3. Include a question that quantifies the problem for them ("how many hours a week is that worth to you?").
4. One closing that offers a small free task and books a follow-up.

Add a one-line follow-up email to send the same day.`,
      },
      {
        key: "hard",
        label: "The hard conversations — objections, scope, referrals",
        content: `You are an experienced VA mentor. Give me short, human scripts (max 5 sentences each) for:

1. The client said my rate is too high — I'm defending my value without underselling myself below my [floor rate].
2. The client is asking for extra tasks outside our agreement — I agree to help but at a fair price, not looking desperate.
3. The client said "I'll think about it" — a friendly follow-up I can send after 4 days.
4. A happy client — I'm asking for a referral AND a testimonial naturally, without sounding like a salesperson.

Plain language, no corporate jargon. These are for chat messages.`,
      },
    ],
  },
  {
    key: "job",
    stage: "Stage 4",
    title: "On the job",
    lead: "You got the client. Now let the AI polish the writing so you can focus on the work.",
    blocks: [
      {
        key: "daily",
        label: "Daily summary — what I did, what's next",
        content: `Turn my raw notes into a client-friendly daily summary.

Raw notes (may be messy):
[dump my notes here: completed tasks, problems, questions]

Guidelines:
1. Three short sections: Done / Next / One question.
2. Max 6 bullet points total.
3. Professional but warm — like a message from a trusted teammate.
4. If my notes sound frustrated, reframe it constructively.
5. No fluff, no "I hope you had a great day."
6. Keep client names and numbers as [placeholders] if I wrote real ones — never invent details.`,
      },
      {
        key: "email",
        label: "Tricky email — the professional reply",
        content: `Help me reply to a tricky work email as a [niche] VA.

The email I received: [paste the email]

My situation: [one line — e.g. "I made a scheduling mistake" / "I need more time" / "I need to reset the client's expectations"]

Write 2 reply options:
1. Calm and clear — takes responsibility if it's my fault, fixes it, and suggests the next step.
2. Firm but polite — for when I need to push back or say no.

Guidelines: under 120 words each, no corporate jargon, no over-apologizing, never blame the client even in option 2.`,
      },
      {
        key: "task",
        label: "Task breakdown — messy request to clear steps",
        content: `A client gave me a vague task: "[paste the task]"

As an experienced VA:
1. Restate what I think they actually want — in one sentence.
2. List the questions I should ask before starting (max 4, only the necessary ones).
3. Break the task into clear steps I can action.
4. Tell me what "done" looks like so I can confirm with the client.
5. Point out common mistakes for this type of task.

Be practical. If the request is impossible or risky, say so and show me how to communicate that to the client.`,
      },
    ],
  },
];

export const PROMPT_STEPS: Array<{ num: string; title: string; desc: string }> = [
  {
    num: "01",
    title: "Gather your raw materials first",
    desc: "The AI is only as good as what you feed it. Collect the job post text, your skills, certificates, and 1-2 sample outputs before you open any chat. Copy the full job post — don't summarize it.",
  },
  {
    num: "02",
    title: "Copy the prompt, paste, fill the [brackets]",
    desc: "Each prompt below has its own job. Fill in the placeholders with your real details. The more specific you are, the less generic the output.",
  },
  {
    num: "03",
    title: "Edit everything — and stay safe",
    desc: "The AI drafts. You decide. Rewrite until it sounds like you said it. And never paste a client's confidential data into a free AI chat — use fake placeholders like [client name].",
  },
];

export const PROMPT_RULES: string[] = [
  "Always rewrite the output until it sounds like you said it. Generic AI writing is immediately recognizable — and it hurts your application.",
  "Never paste a client's confidential data, passwords, or private company information into a free AI chat. Use placeholders.",
  "Never ask the AI to invent experience, references, or numbers. A lie found out ends a career faster than an honest gap.",
  "Verify any facts the AI gives you — rates, tool features, or anything it claims. AI confidently makes mistakes.",
  "Use AI for writing, not for thinking. You decide what's right, what's true, and what to say.",
];