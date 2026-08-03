export interface TipGroup {
  key: string;
  eyebrow: string;
  title: string;
  lead: string;
  tips: Array<{ num: string; title: string; desc: string }>;
}

export const TIP_GROUPS: TipGroup[] = [
  {
    key: "bago",
    eyebrow: "Before you apply",
    title: "Starting out on the right foot",
    lead: "Skip the hype, skip the 'quit your job in 30 days.' These are the practical things that actually decide who gets hired and who doesn't — in the order you'll need them.",
    tips: [
      {
        num: "01",
        title: "Pick ONE skill first",
        desc: "Email, calendar, spreadsheets, or social — pick one for your first 90 days. Depth always beats breadth. Clients hire specialists, not 'jack of all trades' profiles.",
      },
      {
        num: "02",
        title: "Your equipment matters more than your certificate",
        desc: "A certificate gets you an interview. A camera that freezes kills it. Test your setup before you apply — not on the day of your first interview.",
      },
      {
        num: "03",
        title: "Finish one course all the way through",
        desc: "One finished certificate with real knowledge beats ten courses you started. Set a deadline for yourself — 'done in 2 weeks' — and treat it like a job.",
      },
      {
        num: "04",
        title: "Learn the tools clients actually use",
        desc: "Google Workspace, Zoom, Slack, Canva, and one project tool (Asana or Trello). Learn all five for free in about two weeks. They show up in almost every job post.",
      },
      {
        num: "05",
        title: "Build a profile clients can trust",
        desc: "A real photo, a clear headline ('Detail-oriented VA with a Google Workspace certification'), and a bio about what you CAN do for them — not what you hope to learn.",
      },
    ],
  },
  {
    key: "grind",
    eyebrow: "The grind",
    title: "Applying and interviewing without losing heart",
    lead: "Interviews aren't tests — they're conversations. These are the habits that put you ahead, not luck.",
    tips: [
      {
        num: "06",
        title: "Apply every day — volume is the strategy",
        desc: "Ten quality applications a week is a genuinely achievable number. Most VAs get hired somewhere between application 50 and 100. Silence is normal; it's not about you.",
      },
      {
        num: "07",
        title: "Customize the first two lines",
        desc: "Clients instantly recognize a copy-paste proposal. Mention one specific thing from their post in the first two sentences. That alone puts you ahead of most applicants.",
      },
      {
        num: "08",
        title: "Attach one sample to every application",
        desc: "One clean email, one organized spreadsheet, one simple calendar invite. 'Show, don't tell' is the biggest edge for applicants with no experience.",
      },
      {
        num: "09",
        title: "Practice your intro out loud",
        desc: "Record yourself: 'Hello, I'm [name], and I can help you with [one thing].' 60 seconds, clear English, decent lighting. It feels embarrassing. Do it anyway — it pays off big in interviews.",
      },
      {
        num: "10",
        title: "Do a test call before every interview",
        desc: "Camera, mic, internet, lighting — test them with a friend or on a free test-call site 30 minutes before. Never test your setup during the actual interview.",
      },
    ],
  },
  {
    key: "in",
    eyebrow: "Once you're in",
    title: "Keeping the job and growing",
    lead: "Getting the job is easier than keeping it. These are the habits that make you valuable to a client week after week.",
    tips: [
      {
        num: "11",
        title: "Over-communicate in the first week",
        desc: "Send a short daily or weekly summary: what you did, what's next, what you need. Clients keep VAs who make their lives easier — communication is half of that job.",
      },
      {
        num: "12",
        title: "Write everything down in one place",
        desc: "Tasks, deadlines, preferences, passwords (in a password manager, not a notes app). Never make a client repeat themselves twice.",
      },
      {
        num: "13",
        title: "Ask early, not later",
        desc: "'Just to confirm, do you want X or Y?' is a 30-second message. Redoing a week of wrong work takes much longer. Questions are free; mistakes are expensive.",
      },
      {
        num: "14",
        title: "Deliver early whenever you can",
        desc: "Early gets remembered. Late gets remembered in the worst way. Build buffer into every deadline and surprise them once in a while.",
      },
      {
        num: "15",
        title: "Ask for a testimonial while they're happy",
        desc: "Right after a win, ask: 'Would you write two sentences about working with me?' Use it in every proposal from then on. Proof beats promises.",
      },
      {
        num: "16",
        title: "Keep leveling up",
        desc: "One new skill per quarter: CRM, automation, reporting, bookkeeping basics. Every certificate and result is leverage for your next rate increase.",
      },
    ],
  },
];
