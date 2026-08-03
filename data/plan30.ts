export interface DayTask {
  day: number;
  title: string;
  body: string;
  link?: { label: string; href: string };
}

export const PLAN_30: DayTask[] = [
  { day: 1, title: "Create a professional email address", body: "firstname.lastname@gmail.com — the email you use for job applications shouldn't be cute or personal." },
  { day: 2, title: "Set up Google Drive folders", body: "Build a folder structure: Documents, Templates, Clients. Start practicing clean file organization early — it's your job someday." },
  { day: 3, title: "Join the Filipino VA community", body: "Find a Facebook group or Discord where the conversations are serious. Observe the questions that keep recurring — they'll tell you what your job will be." },
  { day: 4, title: "Set aside a fixed time each day", body: "Even 30 minutes is fine. Treat it like a job — not 'when I have time.' Consistency is what kills procrastination." },
  { day: 5, title: "Test your internet and plan a backup", body: "Run speed tests at 3 times of day (morning, afternoon, evening). Find out whether you need a backup mobile data plan." },
  { day: 6, title: "Create a resume draft", body: "Use the Templates page as a guide. It doesn't need to be perfect — it's a draft you can update every day." },
  { day: 7, title: "Sign up for your first job board", body: "Create an account on OnlineJobs.ph (free). Fill out the profile as much as you can. The door is now open." },
  { day: 8, title: "Take the VA Readiness Check", body: "8 questions, 2 minutes. It tells you which stage to start at — and your baseline VA Score." },
  { day: 9, title: "Take the Niche Finder", body: "Find out which specialization fits you. It can change — it's a recommendation, not a sentence." },
  { day: 10, title: "Tidy up your workspace", body: "Lighting, chair, headset test on a voice call. Work is like sports — a good environment is what lets you focus." },
  { day: 11, title: "Study email etiquette", body: "Subject lines, formal greetings, filing emails. Read 2 sample email exchanges in the community." },
  { day: 12, title: "Practice Google Sheets basics", body: "Formatting, filters, SUM, and basic formulas. Tutorials are free — just 30 minutes of practice today." },
  { day: 13, title: "Create 1 sample design in Canva", body: "Any design — a poster, profile banner, or social post. The ability to make clean visuals is a bonus in almost every VA role." },
  { day: 14, title: "Practice video call basics", body: "Zoom and Google Meet — screen sharing, mute/unmute, virtual backgrounds. Record yourself to hear how you actually sound." },
  { day: 15, title: "Create a portfolio draft", body: "Use the Portfolio Builder. No job experience needed — the samples you made on Day 13 and your resume are enough." },
  { day: 16, title: "Polish your resume", body: "Based on the job posts you've read, adjust your skills and descriptions to match what clients are looking for." },
  { day: 17, title: "Write a cover letter template", body: "A base letter you can customize for each application. Don't mass-send — a generic letter is instantly recognizable." },
  { day: 18, title: "Record your 30-second pitch", body: "Who you are, what you do, why you fit. Record on your phone, listen back, repeat. Even 5 times — the fifth will be better." },
  { day: 19, title: "List 10 potential job posts", body: "Use the Apply Here directory and the jobs feed. Don't apply yet — just save the candidates." },
  { day: 20, title: "Verify 2 clients using Red Flags", body: "Revisit the 2 posts you picked and check them against the 6 scam patterns. This habit will save you." },
  { day: 21, title: "Apply to your first 3 clients", body: "Here's your first real step. Customize each application — no copy-paste." },
  { day: 22, title: "Apply to 3 more", body: "6 applications in total. Don't lose heart yet — the numbers game is just getting started." },
  { day: 23, title: "Review the Red Flags page — 30 minutes", body: "Read it again. When you apply to something with a red flag, you'll know what to do." },
  { day: 24, title: "Apply to 4 more", body: "10 applications in total. Now follow up with the 2 you liked best using the Closing Scripts page." },
  { day: 25, title: "Update your portfolio", body: "Based on the job posts you've read, add the skills that keep appearing in your niche." },
  { day: 26, title: "Apply to 3 more", body: "13+ applications in total. Watch your response rate — if it's zero, the problem is your pitch, not you." },
  { day: 27, title: "Practice interview questions", body: "The 8 most common ones — answer out loud, not in your head. Use the prompts on the Prompt Library page for mock questions." },
  { day: 28, title: "Follow up with everyone you applied to", body: "One polite message to those who haven't replied. 80% of people never follow up — that's how 80% of opportunities get lost." },
  { day: 29, title: "Review your progress", body: "Look back at the dashboard. What got done? What didn't? Adjust the plan for the next 30 days — no more starting from zero." },
  { day: 30, title: "Plan the next 30 days", body: "Continue the cycle: apply to 3–4 each day, practice interviews, and update your portfolio weekly. Retake the Readiness Check to watch your score improve." },
];

export const planDay = (day: number): DayTask | undefined => PLAN_30.find((d) => d.day === day);