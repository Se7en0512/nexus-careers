export interface ToolHint {
  path: string;
  label: string;
  blurb: string;
}

// Shared between GuestHintBar (rotating/general) and the signup page
// (specific copy based on the `next` redirect param).
export const TOOL_HINTS: ToolHint[] = [
  { path: "/tools/resume-builder", label: "Resume Builder", blurb: "Build a client-ready resume in minutes." },
  { path: "/portfolio-builder", label: "Portfolio Builder", blurb: "Create a shareable online portfolio." },
  { path: "/tools/cover-letter", label: "Cover Letter Builder", blurb: "Generate a tailored cover letter." },
  { path: "/tools/interview-coach", label: "Interview Coach", blurb: "Practice answering real client questions." },
  { path: "/tools/mock-interview", label: "Mock Interview", blurb: "Run a timed mock interview session." },
  { path: "/tools/niche-finder", label: "Niche Finder", blurb: "Find the VA niche that fits you best." },
  { path: "/tools/readiness", label: "Readiness Quiz", blurb: "Check how ready you are to start VA work." },
  { path: "/tools/red-flag-checker", label: "Red Flag Checker", blurb: "Screen job offers for common scam signs." },
  { path: "/tools/invoice-generator", label: "Invoice Generator", blurb: "Create clean, professional invoices." },
  { path: "/tools/pitch-calculator", label: "Pitch Calculator", blurb: "Price your services with confidence." },
  { path: "/tools/tracker", label: "Application Tracker", blurb: "Track every job application in one place." },
];

export function findToolHint(path: string | null | undefined): ToolHint | null {
  if (!path) return null;
  return TOOL_HINTS.find((t) => path.startsWith(t.path)) ?? null;
}