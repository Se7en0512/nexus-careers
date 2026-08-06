export interface DailyMotivationItem {
  type: "tip" | "advice" | "challenge" | "quote";
  emoji: string;
  title: string;
  content: string;
}

export const DAILY_MOTIVATION: DailyMotivationItem[] = [
  {
    type: "tip",
    emoji: "💡",
    title: "Tip of the Day",
    content: "Always respond to client messages within 24 hours — even if it's just to say you're working on it. Reliability builds trust faster than skill.",
  },
  {
    type: "advice",
    emoji: "🚀",
    title: "Today's Career Advice",
    content: "Your first client doesn't have to be your dream client. Start small, deliver great work, and let testimonials snowball into bigger opportunities.",
  },
  {
    type: "challenge",
    emoji: "🎯",
    title: "Daily Challenge",
    content: "Send 3 job applications today. Quality over quantity — personalize each cover letter with one specific detail about the company.",
  },
  {
    type: "quote",
    emoji: "💬",
    title: "Inspirational Quote",
    content: "\"The best time to plant a tree was 20 years ago. The second best time is now.\" — Chinese Proverb",
  },
  {
    type: "tip",
    emoji: "💡",
    title: "Tip of the Day",
    content: "Create a dedicated workspace, even if it's just a corner of your room. Physical boundaries help your brain switch into work mode.",
  },
  {
    type: "advice",
    emoji: "🚀",
    title: "Today's Career Advice",
    content: "Track every application you send. Knowing your numbers (10 applications → 3 interviews → 1 offer) helps you improve your approach.",
  },
  {
    type: "challenge",
    emoji: "🎯",
    title: "Daily Challenge",
    content: "Update your portfolio today. Add one new skill, project, or testimonial — even a small update keeps it fresh for recruiters.",
  },
  {
    type: "quote",
    emoji: "💬",
    title: "Inspirational Quote",
    content: "\"Success is not final, failure is not fatal: it is the courage to continue that counts.\" — Winston Churchill",
  },
  {
    type: "tip",
    emoji: "💡",
    title: "Tip of the Day",
    content: "Use the Pomodoro technique: 25 minutes of focused work, 5-minute break. It's especially effective for deep-focus tasks like writing or coding.",
  },
  {
    type: "advice",
    emoji: "🚀",
    title: "Today's Career Advice",
    content: "Build a 'proof of work' portfolio — even if you have no clients yet. Create sample projects that demonstrate your skills in real scenarios.",
  },
  {
    type: "challenge",
    emoji: "🎯",
    title: "Daily Challenge",
    content: "Practice one interview question today. Record yourself answering \"Tell me about yourself\" and watch it back.",
  },
  {
    type: "quote",
    emoji: "💬",
    title: "Inspirational Quote",
    content: "\"Don't watch the clock; do what it does. Keep going.\" — Sam Levenson",
  },
  {
    type: "tip",
    emoji: "💡",
    title: "Tip of the Day",
    content: "Set up automatic backups of your work files. Use Google Drive or Dropbox — losing client work is the fastest way to lose a contract.",
  },
  {
    type: "advice",
    emoji: "🚀",
    title: "Today's Career Advice",
    content: "Your rate should reflect your value, not your location. If you deliver the same quality as someone in the US, charge accordingly.",
  },
  {
    type: "challenge",
    emoji: "🎯",
    title: "Daily Challenge",
    content: "Research one new VA niche today. Read about the skills required, typical rates, and what clients in that niche are looking for.",
  },
  {
    type: "quote",
    emoji: "💬",
    title: "Inspirational Quote",
    content: "\"It does not matter how slowly you go as long as you do not stop.\" — Confucius",
  },
  {
    type: "tip",
    emoji: "💡",
    title: "Tip of the Day",
    content: "Always get a written agreement before starting work. Even a simple email confirming scope, rate, and payment terms protects both you and the client.",
  },
  {
    type: "advice",
    emoji: "🚀",
    title: "Today's Career Advice",
    content: "Join Filipino VA communities on Facebook. The job leads shared in these groups are often exclusive and less competitive than public job boards.",
  },
  {
    type: "challenge",
    emoji: "🎯",
    title: "Daily Challenge",
    content: "Complete one module of a free course today. Even 30 minutes of learning adds a new skill to your toolkit.",
  },
  {
    type: "quote",
    emoji: "💬",
    title: "Inspirational Quote",
    content: "\"The only way to do great work is to love what you do.\" — Steve Jobs",
  },
  {
    type: "tip",
    emoji: "💡",
    title: "Tip of the Day",
    content: "Time-zone awareness is a superpower. If your client is in the US, learn their timezone and be available during their core hours — even partially.",
  },
  {
    type: "advice",
    emoji: "🚀",
    title: "Today's Career Advice",
    content: "Start building your personal brand on LinkedIn. Post about your VA journey — clients love seeing growth and dedication.",
  },
  {
    type: "challenge",
    emoji: "🎯",
    title: "Daily Challenge",
    content: "Reach out to one person in your network today. A simple \"How are you?\" can lead to unexpected opportunities.",
  },
  {
    type: "quote",
    emoji: "💬",
    title: "Inspirational Quote",
    content: "\"Opportunities don't happen. You create them.\" — Chris Grosser",
  },
  {
    type: "tip",
    emoji: "💡",
    title: "Tip of the Day",
    content: "Use a password manager. Reusing passwords across client accounts is a security risk that can cost you your reputation.",
  },
  {
    type: "advice",
    emoji: "🚀",
    title: "Today's Career Advice",
    content: "Don't undervalue yourself because you're new. Fresh perspective and eagerness to learn are valuable traits that experienced VAs sometimes lose.",
  },
  {
    type: "challenge",
    emoji: "🎯",
    title: "Daily Challenge",
    content: "Update your resume today. Add one new achievement or skill — keep it current so you're always ready to apply.",
  },
  {
    type: "quote",
    emoji: "💬",
    title: "Inspirational Quote",
    content: "\"Your limitation—it's only your imagination.\" — Unknown",
  },
  {
    type: "tip",
    emoji: "💡",
    title: "Tip of the Day",
    content: "Always over-deliver on your first project with a new client. The first impression sets the tone for the entire relationship.",
  },
  {
    type: "advice",
    emoji: "🚀",
    title: "Today's Career Advice",
    content: "Learn to say no. Taking on too many clients leads to burnout and poor quality. Better to have 3 great clients than 10 mediocre ones.",
  },
];

/** Returns a deterministic item for today based on the date string */
export function getTodayMotivation(): DailyMotivationItem {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return DAILY_MOTIVATION[dayOfYear % DAILY_MOTIVATION.length];
}
