export interface MockWin {
  name: string;
  role: string;
  quote: string;
  result: string;
}

// MOCK CONTENT — these are still illustrative for the homepage design.
// Will be replaced with real testimonials as soon as they're available.
export const MOCK_WINS: MockWin[] = [
  {
    name: "Jenna R.",
    role: "Social Media VA",
    quote:
      "At first, I thought I had to finish every course before applying. The Readiness Check showed me I could already start while still learning.",
    result: "First client within 3 weeks",
  },
  {
    name: "Mark T.",
    role: "E-commerce VA",
    quote:
      "The Equipment Guide helped me figure out which setup my budget could handle without needing to take out a loan for a laptop.",
    result: "Started with a second-hand laptop, now has 2 regular clients",
  },
  {
    name: "Anna L.",
    role: "Admin Support VA",
    quote:
      "The Red Flags page is why I didn't end up taking an offer that charged a 'training fee' before I even got interviewed.",
    result: "Avoided a scam, found a legit client within 1 month",
  },
];
