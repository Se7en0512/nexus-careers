export interface StageChecklist {
  key: string;
  num: string;
  title: string;
  goal: string;
  timeline: string;
  items: string[];
  resources: { label: string; href: string }[];
}

export const ROADMAP: StageChecklist[] = [
  {
    key: "umpisa",
    num: "01",
    title: "Getting Started",
    goal: "Find out if you're ready — equipment, mindset, and your first step.",
    timeline: "1–4 weeks",
    items: [
      "Have a reliable laptop and internet connection",
      "Set up a proper workspace and backup internet plan",
      "Have a functional email address for applications",
      "Created a basic resume for VA roles",
      "Read the Equipment Guide and Red Flags page",
      "Set a weekly schedule for your VA journey",
      "Completed the VA Readiness Check",
    ],
    resources: [
      { label: "Equipment Guide", href: "/equipment" },
      { label: "Red Flags & Scams", href: "/red-flags" },
      { label: "VA Readiness Check", href: "/tools/readiness" },
      { label: "Course Library", href: "/courses" },
      { label: "VA Tips", href: "/tips" },
    ],
  },
  {
    key: "get-hired",
    num: "02",
    title: "Get Hired",
    goal: "Apply with confidence using real templates and scripts.",
    timeline: "1–3 months",
    items: [
      "Polished your resume and profile for 1–2 platforms",
      "Chose a target niche using the Niche Finder",
      "Built a portfolio or sample work for your niche",
      "Applied consistently to 5+ clients each week",
      "Prepared answers to the 5 most common interview questions",
      "Verified 3 potential clients before applying",
      "Landed your first interview",
    ],
    resources: [
      { label: "Niche Finder", href: "/tools/niche-finder" },
      { label: "Apply Here", href: "/apply-here" },
      { label: "Templates", href: "/free-templates" },
      { label: "Prompt Library", href: "/prompts" },
      { label: "Tools Tutorials", href: "/tutorials" },
    ],
  },
  {
    key: "thrive",
    num: "03",
    title: "Thrive",
    goal: "Keep the momentum going — boundaries, time, and your first client wins.",
    timeline: "First 90 days with your client",
    items: [
      "Scheduled an onboarding meeting in the first week",
      "Documented your workflow and client access",
      "Set clear working hours and boundaries",
      "Sent weekly updates without being asked",
      "Reviewed your scope of work at the end of the first month",
      "Read the First 90 Days page and applied its lessons",
      "Requested feedback from your client",
    ],
    resources: [
      { label: "First 90 Days", href: "/first-90-days" },
      { label: "Templates", href: "/free-templates" },
      { label: "Pitch Calculator", href: "/tools/pitch-calculator" },
      { label: "Codes for Efficiency", href: "/codes" },
      { label: "Prompt Library", href: "/prompts" },
    ],
  },
  {
    key: "level-up",
    num: "04",
    title: "Level Up",
    goal: "Raise your rate, expand your skills, find your niche.",
    timeline: "Month 4 and up",
    items: [
      "Reviewed your rate vs. actual workload (Pitch Calculator)",
      "Negotiated a new rate or add-on scope",
      "Added 1 new skill tied to your niche",
      "Applied for 1 bigger client or role",
      "Built a 3-month savings or income buffer",
      "Taught or shared knowledge with the community",
      "Planned the next 6 months of your career",
    ],
    resources: [
      { label: "Pitch Calculator", href: "/tools/pitch-calculator" },
      { label: "Cover Letter Builder", href: "/tools/cover-letter" },
      { label: "Wins", href: "/wins" },
      { label: "Course Library", href: "/courses" },
      { label: "Tools Tutorials", href: "/tutorials" },
    ],
  },
];

export const stageFromKey = (key: string): StageChecklist | undefined =>
  ROADMAP.find((s) => s.key === key);