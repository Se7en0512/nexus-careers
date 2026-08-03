export type QuizOption = { label: string; value: string; w?: number };
export type QuizQuestion = { q: string; options: QuizOption[] };

/* ============ VA READINESS CHECK ============ */

const STAGES = ["umpisa", "get-hired", "thrive", "level-up"] as const;
export type StageKey = (typeof STAGES)[number];

export const STAGE_LABELS: Record<StageKey, string> = {
  umpisa: "Start",
  "get-hired": "Get Hired",
  thrive: "Thrive",
  "level-up": "Level Up",
};

// Each answer carries a readiness weight (0-100) for the VA Score.
// The average of the weights becomes the user's numerical score.
export const readinessQuestions: QuizQuestion[] = [
  {
    q: "Do you have your own laptop and a reliable internet connection?",
    options: [
      { label: "No decent laptop or internet yet", value: "umpisa", w: 5 },
      { label: "An old but working laptop, free internet", value: "umpisa", w: 25 },
      { label: "A proper laptop and internet connection", value: "get-hired", w: 55 },
      { label: "A complete setup — backup internet and everything", value: "thrive", w: 85 },
    ],
  },
  {
    q: "How comfortable are you with basic online tools? (email, Google Docs, Sheets, Zoom)",
    options: [
      { label: "I still struggle with some of them", value: "umpisa", w: 15 },
      { label: "I can handle the basics but need more practice", value: "get-hired", w: 40 },
      { label: "Comfortable — I use them every day", value: "thrive", w: 70 },
      { label: "I can teach and set these up for other people", value: "level-up", w: 95 },
    ],
  },
  {
    q: "Have you applied to any online jobs before?",
    options: [
      { label: "Not yet — I'm just starting out", value: "umpisa", w: 5 },
      { label: "I've applied, but no interview ever pushed through", value: "get-hired", w: 35 },
      { label: "I've finished an interview and am waiting for results", value: "get-hired", w: 60 },
      { label: "I already have a client or an offer", value: "thrive", w: 90 },
    ],
  },
  {
    q: "How many hours can you commit to this each week?",
    options: [
      { label: "Less than 5 hours", value: "umpisa", w: 10 },
      { label: "5–10 hours, and I can add more", value: "umpisa", w: 25 },
      { label: "10–20 hours, I can commit consistently", value: "get-hired", w: 50 },
      { label: "20+ hours — I'm aiming full-time", value: "thrive", w: 85 },
    ],
  },
  {
    q: "How would you describe your English — in writing and speaking?",
    options: [
      { label: "I struggle, and I often feel shy about it", value: "umpisa", w: 5 },
      { label: "I can manage, though I make mistakes sometimes", value: "get-hired", w: 35 },
      { label: "Good — I can email and speak in meetings", value: "thrive", w: 65 },
      { label: "Strong — I can negotiate and mediate", value: "level-up", w: 95 },
    ],
  },
  {
    q: "When you get a task you don't know how to do, what do you usually do?",
    options: [
      { label: "I look for someone to teach me first", value: "umpisa", w: 15 },
      { label: "I google it, then try to do it myself", value: "get-hired", w: 45 },
      { label: "I have a system: research → test → ask if needed", value: "thrive", w: 70 },
      { label: "I examine the process to make it faster for everyone", value: "level-up", w: 95 },
    ],
  },
  {
    q: "Do you have a resume or profile ready for VA applications?",
    options: [
      { label: "Not yet — I don't know where to start", value: "umpisa", w: 0 },
      { label: "I have a draft, but it's not polished yet", value: "get-hired", w: 30 },
      { label: "A proper resume and an updated profile", value: "thrive", w: 65 },
      { label: "I keep updating it based on interview feedback", value: "level-up", w: 95 },
    ],
  },
  {
    q: "How long have you been on your VA or remote work journey?",
    options: [
      { label: "Only days or weeks", value: "umpisa", w: 0 },
      { label: "I've been applying for a few months", value: "get-hired", w: 40 },
      { label: "I already have 1–2 clients", value: "thrive", w: 70 },
      { label: "Over a year, or I'm thinking about scaling", value: "level-up", w: 95 },
    ],
  },
];

export interface ReadinessResult {
  stage: StageKey;
  label: string;
  score: number; // 0-100
}

export interface ReadinessAnswer {
  value: string;
  w: number;
}

export function scoreReadiness(answers: ReadinessAnswer[]): ReadinessResult {
  const counts: Record<StageKey, number> = { umpisa: 0, "get-hired": 0, thrive: 0, "level-up": 0 };

  for (const a of answers) {
    const k = a.value as StageKey;
    if (k in counts) counts[k]++;
  }

  const score = answers.length
    ? Math.round(answers.reduce((acc, a) => acc + a.w, 0) / answers.length)
    : 0;

  let best: StageKey = "umpisa";
  for (const k of STAGES) {
    if (counts[k] > counts[best]) best = k;
  }
  return { stage: best, label: STAGE_LABELS[best], score };
}

/* ============ NICHE FINDER ============ */

export const NICHES = {
  admin: "Admin Support",
  social: "Social Media Management",
  ecommerce: "E-commerce Support",
  bookkeeping: "Bookkeeping",
  customer: "Customer Support",
  content: "Content & Copywriting",
} as const;
export type NicheKey = keyof typeof NICHES;

export const nicheQuestions: QuizQuestion[] = [
  {
    q: "Which of these do you enjoy the most?",
    options: [
      { label: "Organizing files, calendars, and schedules", value: "admin" },
      { label: "Creating posts, captions, and curating content", value: "social" },
      { label: "Managing listings and processing orders", value: "ecommerce" },
      { label: "Balancing numbers and tracking expenses", value: "bookkeeping" },
      { label: "Helping people with problems, replying to messages", value: "customer" },
      { label: "Writing — emails, articles, scripts", value: "content" },
    ],
  },
  {
    q: "What do you usually do in your free time?",
    options: [
      { label: "Making lists and planning things out", value: "admin" },
      { label: "Scrolling and studying social media trends", value: "social" },
      { label: "Shopping online, researching products and sellers", value: "ecommerce" },
      { label: "Saving, budgeting, tracking expenses", value: "bookkeeping" },
      { label: "Answering people's questions, recommending services", value: "customer" },
      { label: "Writing in a journal, notes, or anything", value: "content" },
    ],
  },
  {
    q: "Which of these tools are you already familiar with?",
    options: [
      { label: "Gmail, Google Calendar, Docs, Sheets", value: "admin" },
      { label: "Canva, Facebook, Instagram, TikTok", value: "social" },
      { label: "Shopee, Lazada, or other marketplaces", value: "ecommerce" },
      { label: "Excel or Google Sheets — I use them for numbers", value: "bookkeeping" },
      { label: "Messenger, WhatsApp, or customer chat platforms", value: "customer" },
      { label: "Notion, Docs, or other writing tools", value: "content" },
    ],
  },
  {
    q: "How do you communicate in chat?",
    options: [
      { label: "Structured and bullet-pointed — straight to the point", value: "admin" },
      { label: "Short, sometimes humorous, easy to read", value: "social" },
      { label: "Detailed — I explain the process", value: "ecommerce" },
      { label: "Careful and exact — numbers matter", value: "bookkeeping" },
      { label: "Empathetic — I understand how the other person feels", value: "customer" },
      { label: "Storytelling — I tell stories well", value: "content" },
    ],
  },
  {
    q: "Which new skill are you most interested in learning?",
    options: [
      { label: "Document formatting and email management", value: "admin" },
      { label: "Content calendars and building a brand", value: "social" },
      { label: "Inventory and order management systems", value: "ecommerce" },
      { label: "Bank reconciliation and invoicing", value: "bookkeeping" },
      { label: "Customer support tools and escalation handling", value: "customer" },
      { label: "SEO basics and conversion-focused writing", value: "content" },
    ],
  },
  {
    q: "Which kind of 'done' is the most satisfying for you?",
    options: [
      { label: "An empty inbox and an updated calendar", value: "admin" },
      { label: "Published content with great engagement", value: "social" },
      { label: "Clean inventory and no pending orders", value: "ecommerce" },
      { label: "Balanced books with no discrepancies", value: "bookkeeping" },
      { label: "A customer's problem solved — they're happy", value: "customer" },
      { label: "A clear draft that needs no more changes", value: "content" },
    ],
  },
  {
    q: "How would you like your work and income to be structured?",
    options: [
      { label: "A fixed scope of work and one client", value: "admin" },
      { label: "Paid per output or per campaign", value: "social" },
      { label: "A mix — fixed plus performance bonus", value: "ecommerce" },
      { label: "Per hour — every minute is visible", value: "bookkeeping" },
      { label: "A fixed shift with clear hours", value: "customer" },
      { label: "Per article or per project", value: "content" },
    ],
  },
  {
    q: "What kind of client would you like to work with?",
    options: [
      { label: "A CEO or manager who needs an organizer", value: "admin" },
      { label: "A brand or business that wants to grow online", value: "social" },
      { label: "A shop owner with lots of sales and orders", value: "ecommerce" },
      { label: "An accountant or small business that needs clean books", value: "bookkeeping" },
      { label: "A startup or service business with many customers", value: "customer" },
      { label: "A marketing team that needs consistent output", value: "content" },
    ],
  },
];

export const NICHE_DETAILS: Record<
  NicheKey,
  { skills: string[]; tools: string[]; rate: string; desc: string }
> = {
  admin: {
    desc: "You're the bridge between the client and their business — email, calendar, data entry, and other organization.",
    skills: ["Email management", "Calendar & scheduling", "Google Workspace", "Data entry", "Transcription"],
    tools: ["Gmail/Outlook", "Google Calendar", "Notion", "Slack", "Trello"],
    rate: "₱30,000–₱60,000/month (entry to experienced)",
  },
  social: {
    desc: "You manage the client's social media presence — content calendar, posts, captions, and engagement.",
    skills: ["Content calendar", "Caption writing", "Canva/graphic basics", "Reels/Shorts basics", "Community management"],
    tools: ["Meta Business Suite", "Canva", "Buffer/Hootsuite", "CapCut"],
    rate: "₱35,000–₱70,000/month (entry to experienced)",
  },
  ecommerce: {
    desc: "You help online sellers — listings, orders, customer chats, and shop inventory.",
    skills: ["Product listing", "Order processing", "Inventory management", "Customer chat", "Fulfillment coordination"],
    tools: ["Shopify", "Amazon Seller Central", "Etsy", "Lazada/Shopee Seller Center"],
    rate: "₱30,000–₱65,000/month (entry to experienced)",
  },
  bookkeeping: {
    desc: "You take care of the business's numbers — transactions, invoices, and reconciliation for small businesses.",
    skills: ["Transaction data entry", "Invoicing", "Bank reconciliation", "Expense tracking", "QuickBooks basics"],
    tools: ["QuickBooks", "Xero", "Google Sheets", "Excel", "Receipt scanners"],
    rate: "₱35,000–₱80,000/month (entry to experienced)",
  },
  customer: {
    desc: "You're the first person the client's customers talk to — chats, emails, calls, and resolving concerns.",
    skills: ["Chat & email support", "Issue resolution", "Escalation handling", "Product knowledge", "Empathy"],
    tools: ["Zendesk", "Intercom", "LiveChat", "CRM tools", "VoIP apps"],
    rate: "₱30,000–₱55,000/month (entry to experienced)",
  },
  content: {
    desc: "You write for the client's business — blogs, emails, scripts, and anything the marketing needs.",
    skills: ["Blog writing", "Email copy", "Social captions", "SEO basics", "Editing"],
    tools: ["Google Docs", "Grammarly", "Notion", "Hemingway", "Ahrefs basics"],
    rate: "₱35,000–₱75,000/month (entry to experienced)",
  },
};

export function scoreNiche(answers: string[]): { niche: NicheKey; label: string } {
  const counts: Record<NicheKey, number> = {
    admin: 0,
    social: 0,
    ecommerce: 0,
    bookkeeping: 0,
    customer: 0,
    content: 0,
  };
  for (const a of answers) {
    const k = a as NicheKey;
    if (k in counts) counts[k]++;
  }
  let best: NicheKey = "admin";
  for (const k of Object.keys(counts) as NicheKey[]) {
    if (counts[k] > counts[best]) best = k;
  }
  return { niche: best, label: NICHES[best] };
}
