export interface TutorialTool {
  name: string;
  desc: string;
  url: string;
  label: string;
}

export interface TutorialCategory {
  key: string;
  num: string;
  title: string;
  lead: string;
  tools: TutorialTool[];
}

export const TUTORIAL_CATEGORIES: TutorialCategory[] = [
  {
    key: "workspace",
    num: "01",
    title: "Google Workspace & Microsoft",
    lead: "The two offices almost every client uses. Master the Google set first — it's free and most common with small clients.",
    tools: [
      {
        name: "Gmail",
        desc: "Filters, labels, canned responses, and search operators — the day-to-day core of admin VAs. Study the shortcuts page after the first week.",
        url: "https://support.google.com/mail/",
        label: "Official help",
      },
      {
        name: "Google Sheets",
        desc: "This is where a VA proves themselves. Learn formulas, filters, and data validation — the Codes page is a great starting point.",
        url: "https://support.google.com/sheets/",
        label: "Official help",
      },
      {
        name: "Google Docs & Drive",
        desc: "Documents, folders, sharing permissions, and version history. Organize your drive the way you'd organize your desk.",
        url: "https://support.google.com/drive/",
        label: "Official help",
      },
      {
        name: "Excel, Word & Outlook",
        desc: "The corporate ecosystem. If a client says 'I'm an Outlook person' — this is your stack. Excel skills are always in demand.",
        url: "https://support.microsoft.com/en-us/office/excel-help-and-learning-9d053643-8f9e-4590-9208-f7f5a0d2d2e1",
        label: "Official help",
      },
      {
        name: "Free beginner walkthroughs",
        desc: "GCF Global's free tutorials are step-by-step with screenshots — perfect for true beginners. Zero signup, zero cost.",
        url: "https://edu.gcfglobal.org/en/topics/google/",
        label: "Open tutorials",
      },
    ],
  },
  {
    key: "communication",
    num: "02",
    title: "Communication tools",
    lead: "This is where the real work happens. Manage your status, learn the channels, and never miss a client message.",
    tools: [
      {
        name: "Slack",
        desc: "The most common remote-work chat app. Learn channels, threads, mentions, and how to be honest about your status.",
        url: "https://slack.com/help",
        label: "Official help",
      },
      {
        name: "WhatsApp Business",
        desc: "Many small clients live in WhatsApp. Learn labels, quick replies, and desktop mode so you're not typing on your phone all day.",
        url: "https://faq.whatsapp.com/",
        label: "Official help",
      },
      {
        name: "Telegram",
        desc: "Fast, secure, and popular with international clients. Folders, pinned messages, and saved messages keep the work organized.",
        url: "https://telegram.org/faq",
        label: "Official FAQ",
      },
    ],
  },
  {
    key: "project",
    num: "03",
    title: "Project management & productivity",
    lead: "The task trackers that explain why you look organized — because you are. Pick ONE to learn deeply; the rest will feel familiar.",
    tools: [
      {
        name: "Asana",
        desc: "Tasks, projects, and boards for teams. Asana has its own free academy with a VA-relevant path.",
        url: "https://academy.asana.com/",
        label: "Free academy",
      },
      {
        name: "Trello",
        desc: "The simplest kanban boards. Learn cards, labels, due dates, and power-ups like calendar view.",
        url: "https://trello.com/guide",
        label: "Official guide",
      },
      {
        name: "Notion",
        desc: "Docs + databases + wikis in one. Clients love a VA who can maintain a team wiki or client dashboard in Notion.",
        url: "https://www.notion.com/help",
        label: "Official help",
      },
      {
        name: "Todoist",
        desc: "A to-do list done properly — great for your own day-to-day planning before the pile of work arrives.",
        url: "https://todoist.com/help",
        label: "Official help",
      },
    ],
  },
  {
    key: "crm",
    num: "04",
    title: "Customer relationship management (CRM)",
    lead: "The systems clients use to track leads, deals, and customers. Even a basic understanding puts you ahead of most applicants.",
    tools: [
      {
        name: "HubSpot",
        desc: "The free CRM most small businesses start with. HubSpot Academy's free courses come with a certificate — a double win.",
        url: "https://academy.hubspot.com/",
        label: "Free academy",
      },
      {
        name: "Zoho CRM",
        desc: "Popular among growing businesses. Learn modules, pipelines, and how to log meetings like a professional.",
        url: "https://www.zoho.com/crm/help/",
        label: "Official help",
      },
      {
        name: "Salesforce",
        desc: "The big enterprise CRM. Trailhead is Salesforce's free learning platform — the admin path is long, but the basics are free.",
        url: "https://trailhead.salesforce.com/",
        label: "Free Trailhead",
      },
    ],
  },
  {
    key: "passwords",
    num: "05",
    title: "Password management",
    lead: "Clients will trust you with logins — dozens of them. How you handle them decides how safe they feel.",
    tools: [
      {
        name: "Bitwarden",
        desc: "Free, open-source, and a VA community favorite. Learn vaults, folders, sharing, and browser extensions. Never store client passwords in a notes app.",
        url: "https://bitwarden.com/help/",
        label: "Official help",
      },
      {
        name: "Google Password Manager",
        desc: "Built into Chrome — the zero-setup option. Great for your own accounts; for client credentials, still use a manager.",
        url: "https://support.google.com/chrome/answer/95606",
        label: "Official help",
      },
    ],
  },
  {
    key: "marketing",
    num: "06",
    title: "Marketing & design",
    lead: "Social media, email, and simple design — the most in-demand VA niches after admin. All of these have free official training.",
    tools: [
      {
        name: "Canva",
        desc: "Design even if you're not a designer. Canva Design School teaches layouts, branding, and social templates — free.",
        url: "https://www.canva.com/designschool/",
        label: "Design School",
      },
      {
        name: "Meta Blueprint",
        desc: "Facebook and Instagram advertising, free from Meta itself. Great for social media manager roles.",
        url: "https://www.facebook.com/business/learn",
        label: "Free courses",
      },
      {
        name: "Google Skillshop",
        desc: "Google's free training hub — ads, analytics, and more, with free certificates.",
        url: "https://skillshop.exceedlms.com/",
        label: "Free courses",
      },
      {
        name: "Mailchimp",
        desc: "Email marketing for small business. Learn audiences, campaigns, and automations — their library is free.",
        url: "https://mailchimp.com/resources/",
        label: "Free resources",
      },
    ],
  },
  {
    key: "meetings",
    num: "07",
    title: "Conferencing & meetings",
    lead: "This is where interviews and client calls live. If you know the tools well, there's no fumbling when it matters.",
    tools: [
      {
        name: "Zoom",
        desc: "Hosting, scheduling, waiting rooms, and meeting recordings — learn these before your first interview.",
        url: "https://support.zoom.com/",
        label: "Official help",
      },
      {
        name: "Google Meet",
        desc: "Built into Google Workspace — nothing to install. Learn captions, recording, and how to set the right background.",
        url: "https://support.google.com/meet/",
        label: "Official help",
      },
      {
        name: "Microsoft Teams",
        desc: "The corporate meeting app. Teams has its own free training hub inside Microsoft Learn.",
        url: "https://support.microsoft.com/en-us/teams",
        label: "Official help",
      },
    ],
  },
  {
    key: "finance",
    num: "08",
    title: "Finance & payments",
    lead: "Your money first — invoicing, tracking, and getting paid by clients abroad. After that, you'll be able to help with theirs too.",
    tools: [
      {
        name: "Wise",
        desc: "Get paid by international clients at real exchange rates. Their help center explains how VA payments work.",
        url: "https://www.wise.com/help/",
        label: "Official help",
      },
      {
        name: "PayPal",
        desc: "The most common payment method on platforms. Learn invoicing and how to keep personal and business money separate.",
        url: "https://www.paypal.com/support",
        label: "Official help",
      },
      {
        name: "Wave",
        desc: "Free accounting software — invoices, receipts, and bookkeeping basics. Their help center walks you through invoicing from start to finish.",
        url: "https://support.waveapps.com/",
        label: "Official help",
      },
      {
        name: "Income tracker (Sheets)",
        desc: "Track every payment: date, client, amount, method, and tax share. The template is a filtered list — copy the FILTER formula from the Codes page.",
        url: "/codes",
        label: "Get the codes",
      },
    ],
  },
];