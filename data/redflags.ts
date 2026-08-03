export interface RedFlag {
  num: string;
  title: string;
  body: string;
}

export const RED_FLAGS: RedFlag[] = [
  {
    num: "1",
    title: "You're asked to pay before you're even hired",
    body: "Training fee, starter kit, 'reservation fee' — whatever it's called, a real employer won't make you pay just to get in.",
  },
  {
    num: "2",
    title: "No clear job description",
    body: "If you can't answer 'what exactly will I be doing' after the conversation, the other side isn't ready to hire — or the role isn't real.",
  },
  {
    num: "3",
    title: "Offer is way too good for the process",
    body: "Big salary, no interview, no questions about your skills — that's usually a sign the offer isn't genuine.",
  },
  {
    num: "4",
    title: "Payment only to a personal account, not a company account",
    body: "If they ask for GCash or a bank transfer to a personal name (not a business) before you've even started, stop right there.",
  },
  {
    num: "5",
    title: "Avoids video calls or has no traceable company presence",
    body: "If you can't find a website, LinkedIn, or any trace of the business, ask directly before agreeing to anything.",
  },
  {
    num: "6",
    title: "The process moves suspiciously fast",
    body: "'You're hired' with no interview or any conversation about the role — real hiring processes don't move that fast.",
  },
];

export const SCAM_STEPS = [
  {
    n: "01",
    title: "Stop sending anything more",
    body: "However close the 'next step' seems, halt any further payments or personal information.",
  },
  {
    n: "02",
    title: "Screenshot everything",
    body: "Chat history, job post, account names — document it all before it's deleted or you're blocked.",
  },
  {
    n: "03",
    title: "Verify with the community",
    body: "Chances are someone has already experienced the same pattern. Ask around before you decide.",
  },
  {
    n: "04",
    title: "Report it to the platform",
    body: "If it came from a job board or social media, report the account so others are protected too.",
  },
];