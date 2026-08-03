export interface InterviewItem {
  q: string;
  why: string;
  how: string;
  example?: string;
}

export interface InterviewGroup {
  group: string;
  items: InterviewItem[];
}

export const INTERVIEW_GROUPS: InterviewGroup[] = [
  {
    group: "About you",
    items: [
      {
        q: "Tell me about yourself.",
        why: "This is your most important answer. It is not your life story — it is your pitch.",
        how: "Use the 60-second formula: your name + one skill + one proof + what you want. Practice out loud until the flow feels natural. No reading off your resume, no life story.",
        example:
          "I'm [name], a virtual assistant focused on admin support. I completed the Google Workspace certificate and built a sample inbox system that I attached to my application. I'm looking for a long-term client where I can grow and keep delivering.",
      },
      {
        q: "Why do you want to be a virtual assistant?",
        why: "They want to know that you really want this job, not just that you had no other options.",
        how: "Ground your answer in three honest things: you enjoy the actual work, you mesh with the discipline of remote work, and you see a long-term future here. Avoid 'I need the money' and 'I couldn't find an office job' — those may be true, but they don't sell you.",
        example:
          "I genuinely enjoy organizing things and helping people stay on top of their week. In every circle of friends I'm the one they call when their inbox implodes. And the freedom in this job fits me, so I built the discipline that makes me reliable from anywhere.",
      },
      {
        q: "Where do you see yourself in two years?",
        why: "They're measuring whether you're a long-term hire or just passing through, especially if they'll invest in training you. Clients fear turnover.",
        how: "Show stability, not ambition somewhere else. Tie your roadmap to their company: a deeper specialty, more responsibility, and better systems — inside THEIR business.",
        example:
          "I want two years from now to look like a deeper version of this same long-term relationship: more responsibility, more skills, and cleaner systems. I grow inside the company, not out of it.",
      },
    ],
  },
  {
    group: "Experience and skills",
    items: [
      {
        q: "Do you have experience as a VA?",
        why: "They want to hear how you handle having no experience yet — not about how tired you feel.",
        how: "Never apologize. Reframe your preparation as your experience: the certificate you finished, the samples you built, and your over-communication. Then show one sample right away.",
        example:
          "This is my first paid VA role, which is exactly why I prepared this hard: I finished the [certificate], built a sample [task] project you can see, and I over-communicate so you always know where things stand. May I jump straight into it?",
      },
      {
        q: "What skills do you bring?",
        why: "They don't need your whole autobiography — just the three skills that match that posting.",
        how: "Pick three skills that fit the posting, then pair each with one concrete example. A list of skills with no proof just gets forgotten.",
        example:
          "For this role: reliable inbox management — I keep it at zero; calendar scheduling that never double-books; and clear written updates so you always know the status.",
      },
      {
        q: "Walk me through how you would handle [the task].",
        why: "The point is about your process, not only that you work hard.",
        how: "Use one simple three-step structure: clarify → execute → report. Show you'll ask a couple of questions first, raise the flag early if something shifts, then end with a short notice.",
        example:
          "First, two or three short questions so \"done\" is defined. Then I get to work and flag anything unexpected in real time. At the end I send a summary: what I did, where it lives, and what's next.",
      },
      {
        q: "What tools are you comfortable with?",
        why: "They need to know if you can hit the ground running or would need days of training.",
        how: "Order by relevance: the tools you use daily first, then any certificates. Finish with one line that shows you absorb new tools fast.",
        example:
          "Daily: Gmail, Outlook, Google Workspace, Zoom, Slack, Canva, Trello/Asana. I've also taken the free certification courses for X and Y. And I learn new tools fast — I started [tool] from zero and built a working sample in a weekend.",
      },
      {
        q: "Tell me about a time you made a mistake.",
        why: "It tests your integrity and your ability to learn from a misstep.",
        how: "The formula: a real mistake + what you did next + what changed. Never answer 'I make no mistakes' — every client has heard that one and sees through it.",
        example:
          "Once I misread a time zone and scheduled a client one hour early. I caught it the same day, rescheduled, and apologized with a corrected calendar attached ahead of the appointment. Now I confirm time zones in writing before I book anything.",
      },
      {
        q: "How do you handle heavy multitasking?",
        why: "Many VA roles juggle several things at once — they want to see a method, not a motivational quote.",
        how: "Walk them through a sequence: list → prioritize → time-block → report. Use the same method in your personal week if you have no formal experience yet.",
        example:
          "I put everything into one visible list and mark the dependencies first. Then I time-box the top two and batch the rest. The client gets one calm daily summary, so they see the progress from the plan and don't feel the juggling.",
      },
      {
q: "What do you do when you don't know how to do something?",
        why: "The answer they want is not 'I know how' but 'I can find out' — and that you know how to ask a sharp question.",
        how: "The chain: research a bit → structure what you can understand → ask one precise question. Ask a model question like, 'I looked at this, here's what I understand — am I on the right track?'",
        example:
          "I look up the docs and work through tutorials on my own first. If I'm still stuck, I ask once with the context I already have, so the answer is quick. That way they didn't have to explain from zero, and I didn't just guess.",
      },
    ],
  },
  {
    group: "Working style",
    items: [
      {
        q: "How do you prioritize when everything is urgent?",
        why: "They want you to lower their stress, not add to it.",
        how: "Separate 'urgent and important' from 'noisy but small'. Then confirm that order with the client in two lines and keep the list visible.",
        example:
          "Deadlines and anything blocking the client's work come first; everything else waits. I don't try to do it all in the same hour. I set the order and show the client what goes first and why.",
      },
      {
        q: "How do you handle a difficult client?",
        why: "A lot of conflicts come from expectations that were never said out loud. That is exactly the part they want to see you can own.",
        how: "Three steps: stay calm → confirm what they said → fix it. Restate the concern in your own words until they agree, then solve it or ask one clarifying question.",
        example:
          "I first say what I heard: 'So what's blocking is X — is that right?' Once they confirm, we're working on the same problem. Then I make the smallest fix that unlocks it, and the \"difficult\" situation always de-escalates because the expectation finally becomes clear.",
      },
      {
        q: "How do you react to criticism?",
        why: "They confirm that you can take feedback and adjust — not take everything to heart.",
        how: "Say thank you, write it down, adjust right away, and demonstrate the fix on the next deliverable.",
        example:
          "If the feedback is about the format, the next version already has the correction in it. I treat feedback as free data for improving, not as a personal attack.",
      },
      {
        q: "Are you comfortable working with minimal supervision?",
        why: "Clients fear a VA that needs to be supervised 100% of the time. Show that you communicate more, not less.",
        how: "Show your system: a visible task list, updates that come without being asked, and problem flags that go up early.",
        example: "Yes — and that means I will actually communicate more, not less. You can always see my progress and my calendar, and at each step there is a short update. I am a calm, independent operator, not someone who needs constant supervision.",
      },
      {
        q: "What does a good work week look like to you?",
        why: "It reveals how you define success: by deliverables, not by busywork.",
        how: "Frame it as the client's experience of the week: inbox at zero, tasks updated, every request done.",
        example: "By Wednesday the list is already 90% done, and by Friday everything is complete and reviewed, with one calm status message to the client. That kind of quiet, complete week is the best week for me.",
      },
      {
        q: "Why did you leave your previous job? (if you have experience)",
        why: "They aren't after the novella — they're watching how you speak about your previous employer.",
        how: "Keep it neutral and growth-focused. Example: \"I've outgrown my scope and I'm ready for more responsibility.\" Never judge the old boss.",
      },
    ],
  },
  {
    group: "Equipment and environment",
    items: [
      {
        q: "What's your internet setup? What if it goes down?",
        why: "A remote client's greatest fear is you suddenly going offline. Bring a backup plan, not just a promise.",
        how: "Name exact facts: your main speed, your backup connection (for example mobile data), and how quickly you can switch. Concrete numbers beat vague promises.",
        example:
          "I'm on a main fiber line, plus a pocket Wi-Fi and a phone hotspot as backup. If the fiber drops, the backup kicks in within minutes and I message you the same minute. Best case I'm back in under ten minutes, never away while my work is waiting.",
      },
      {
        q: "Do you have a quiet workspace?",
        why: "It matters whether your calls sound professional or get drowned out by background noise.",
        how: "If you don't have a quiet space yet, share the concrete plan to fix it. If you do, walk them through it — from the door closing to the microphone.",
        example:
          "Yes — a dedicated room, door closed, noise-isolated. I test the microphone before every meeting and I use a good headset as well, so calls come through clean.",
      },
      {
        q: "What if your computer breaks mid-task?",
        why: "They're checking that your work won't be held hostage by a single machine.",
        how: "Cover the cloud, a fallback device, and a real backup routine. Answer should cover both the data and the expected recovery time.",
        example:
          "Everything I work on is already on the cloud or backed up every morning. If the machine breaks mid-task, I switch to a spare device and I message you right away — recovery takes minutes, not a day.",
      },
      {
        q: "Are you comfortable learning new tools?",
        why: "Every client works with their own stack of tools, so they need someone who adapts fast.",
        how: "Give one real example: a tool you learned recently and how quickly it took. Prove it, don't just claim 'I learn fast'.",
        example: "In one previous role I was dropped into [software] with no training. I was productive by day three — I ran their main features from the docs and tutorials to pick up the rest. I never let a tool be the reason work stops.",
      },
    ],
  },
  {
    group: "Rate and commitment",
    items: [
      {
        q: "What's your rate?",
        why: "This question filters you in or out — you need a real number you can defend.",
        how: "State it with what's included: 'my rate is $X per hour, which covers scope A.' If the scope hasn't been defined yet, give a range and anchor it to the tasks you'll own. Be honest about your bottom line and hold it.",
        example: "For this scope (admin tasks, inbox + calendar): the range is $[X]–$[Y] per hour or per month, depending on estimated hours. That is the full scope, no hidden add-ons.",
      },
      {
        q: "Are you available during our timezone?",
        why: "Working out the timezone math out loud instantly proves you are prepared long before they decide.",
        how: "Show the overlap using their clock, explain the morning/evening boundary, and if the hours don't fully overlap, offer a clear window. Say exactly which of your hours sit inside their time.",
        example:
          "My normal schedule is [X, Philippine time], which gives us about 4 hours of overlap with your hours. For a scheduled meeting I can even shift up to a few hours to match. So the alignment works in practice.",
      },
      {
        q: "How many clients are you working with right now?",
        why: "They want to know that they will get your full attention, not that you are fourth in line.",
        how: "Give the honest count and quantify your free capacity: 'Right now I have one client in the morning, but your workload fits the afternoon I keep open.' Say clearly which time is dedicated to them.",
        example: "Right now it is one ongoing client, which leaves [hours each week] free — enough for this workload. Thanks to time blocking, those hours are fully yours.",
      },
      {
        q: "Will you still be available in six months?",
        why: "Turnover is the most expensive outcome for a client; they want the reassurance of a long-term person.",
        how: "Say the clear thing: 'This is a career, not just a chapter.' If you plan to stay for a year or more in the same role, say it.",
        example: "Yes — this is the kind of relationship I build for the long run. Stability is exactly what I want to bring: I stay, so you don't have to re-hire or re-train.",
      },
      {
        q: "Can you sign a contract or NDA?",
        why: "It tests if you are professional — and whether you will protect their information.",
        how: "Yes, keep it simple: confidentiality, scope, and consequences summarized in words they trust. You can even ask their lawyer for a reviewed version.",
        example: "Yes — the NDA and a written scope of work. Confidentiality is part of my promise, and a short contract protects both sides cleanly.",
      },
    ],
  },
  {
    group: "Curveballs",
    items: [
      {
        q: "Why should we hire you over more experienced VAs?",
        why: "They don't buy years on paper — they buy results. Deliver value, not a résumé page.",
        how: "Name what makes you different: the exact sample you made for their role, your availability, a better rate-to-quality ratio than seniors, proactive updates, and a long-term mindset.",
        example:
          "Because you filter for results, not tenure. I built ready-made samples for the way you work, I'm available full-time, my rate beats a senior's in value, and you'll see proactive updates from day one."
      },
      {
        q: "What's your biggest weakness?",
        why: "They're listening for real self-awareness with a system — not a rehearsed \"I work too hard\".",
        how: "Pick one real, fixable weakness and pair it with the concrete system you built to keep it in check.",
        example:
          "I can over-focus on small details. So before every task I set a strict checklist and a timebox to stop the polish from eating the schedule.",
      },
      {
        q: "How do you handle requests outside your scope?",
        why: "This reveals whether you say yes to everything and burn out, or set healthy boundaries. Answer with fairness and calm.",
        how: "Ask for the detail, then answer straight: \"That's outside the work we agreed, but I can quote it fairly and we can add it.\" Simple, honest, no drama.",
        example:
          "I'd take the extra ask, price it clearly, and confirm before starting. If it's beyond my ability, I say so early and point them to the right person — so your deadline is never at risk.",
      },
      {
        q: "Why are you new to this, or why is there no work history?",
        why: "This is about honesty, and about showing that a clean start often means you built it on purpose, not that something is broken.",
        how: "Talk about the real work you did to fill the gap: the training you finished, the practice projects you delivered. Own the newness, but show the depth.",
        example:
          "That gap was full of deliberate building: practice projects, finished courses, and samples I can show. Ask to see the work — you'll get proof, not promises.",
      },
      {
        q: "Why should we hire you?",
        why: "They're testing whether you know your value and whether you truly studied this role.",
        how: "Name 2–3 precise reasons you win this role, and tie each one to what the job actually needs. Confidence shows in the details.",
      },
      {
        q: "Do you have any questions for us?",
        why: "Saying 'no question' can sound like low interest. A couple of smart questions show real engagement.",
        how: "Prepare three good ones: about the workload, about how the team collaborates, and about next steps. Example: \"What's the biggest problem this role has to solve in the first 6 weeks?\"",
      },
    ],
  },
];