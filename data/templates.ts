export interface TemplateDoc {
  key: string;
  title: string;
  desc: string;
  filename: string;
  content: string;
}

export const TEMPLATES: TemplateDoc[] = [
  {
    key: "service-agreement",
    title: "Service Agreement",
    desc: "Contract between you and the client — scope of work, pay, and how the relationship ends.",
    filename: "service-agreement.md",
    content: `# SERVICE AGREEMENT
### (Unified version for Filipino VAs)

**This agreement is between:**
- Service Provider: [Your name] ("Provider")
- Client: [Client or company name] ("Client")

**Date of Agreement:** [Date]

---

## 1. SCOPE OF SERVICES
The Provider will provide the following services:
- [Service 1, e.g. Email management — up to 50 emails/day]
- [Service 2]
- [Service 3]

Services outside this list are not covered by this fee.
If additional work is requested, a new discussion — and possibly a new fee — will follow.

## 2. PAYMENT AND PAYMENT METHOD
- Rate: [₱____ or $____] per [hour/month]
- Payment method: [PayPal / GCash / Wise / bank transfer]
- Invoice is issued every [week/month]. Payment is due within [7/14] days of the invoice.
- No work begins on the next cycle until the previous invoice is paid.

## 3. HOURS AND AVAILABILITY
- Working hours: [e.g. Mon–Fri, 9:00 AM–5:00 PM PH Time]
- Turnaround time for tasks: [e.g. 24 hours]
- Emergency/after-hours: [Billable / Not included]

## 4. CONFIDENTIALITY
The Provider will not disclose any information of the Client —
processes, data, credentials, and materials — to anyone who is not authorized.
This remains in effect even after the contract ends.

## 5. OWNERSHIP OF DELIVERABLES
Deliverables that have already been paid for belong to the Client.
The Provider may show sample work in a portfolio
(after redacting sensitive information) unless the Client does not permit it.

## 6. TERMINATION
- Either party may end the contract with [7/30] days' notice.
- Any unpaid work will be paid out on the date of termination.
- The confidentiality and ownership clauses remain in force.

## 7. OTHER TERMS
- The Provider works as an independent contractor, not an employee.
- Unforeseen events (force majeure) are not the responsibility of the Provider.
- In cases of disagreement, both parties will talk it out first before escalating.

---

Signatures:
Provider: ______________________  Date: ________
Client: ________________________  Date: ________`,
  },
  {
    key: "scope-of-work",
    title: "Scope of Work",
    desc: "A clear list of what you'll be doing — the most effective defense against scope creep.",
    filename: "scope-of-work.md",
    content: `# SCOPE OF WORK
### (Template for each client)

**Client:** [Name]
**Provider:** [Your name]
**Date:** [Date]
**Coverage:** [e.g. First 30 days]

---

## 1. TASKS (INCLUDED)
| # | Task | Frequency | Estimated time |
|---|--------|-------|-----------------|
| 1 | [e.g. Email triage and sorting] | Daily | 30 min |
| 2 | [e.g. Calendar management] | Daily | 15 min |
| 3 | [e.g. 2 blog posts] | Weekly | 3 hours |
| 4 | [e.g. Sales reports] | Monthly | 2 hours |

## 2. NOT INCLUDED (EXCLUDED)
- [e.g. Managing social media accounts]
- [e.g. Graphic design — separate project]
- [e.g. Answering phone calls]

## 3. COMMON QUESTIONS TO ANSWER BEFORE SIGNING
- Who will let me know I properly understood the tasks?
- When will they give me a feedback — essential.
- How and when will I receive feedback?
- What happens if I miss a deadline?
- What turnaround time do you want for tasks?
- How will we communicate — which channel and time is preferred?

## 4. PAYMENT FREQUENCY
- [Weekly] / [Twice a month] / [Monthly]
- Payment date: [e.g. the 15th and 30th]
- Overtime or extra scope pay: [e.g. 1.5x hourly rate]

---

Signatures:
Provider: ______________________  Date: ________
Client: ________________________  Date: ________`,
  },
  {
    key: "invoicing-guide",
    title: "Invoicing Guide",
    desc: "A guide to creating professional invoices, so you don't get paid late.",
    filename: "invoicing-guide.md",
    content: `# INVOICING GUIDE
### How to invoice if you don't want late payments

## WHAT IS AN INVOICE?
A formal record of the work you've finished and the amount that's due.
It's not an email. It's a document — it should be complete and nothing left out.

## THE ESSENTIAL PARTS (8 total)
1. **Invoice number** — e.g. INV-2026-001 (goes up, never repeated)
2. **Date** — when you issued the invoice
3. **Your details** — name, email, payment info (PayPal/GCash/BPI, etc.)
4. **Client details** — client or company name
5. **List of work** — each task with date, time, or price
6. **Total** — a clear total in the agreed currency
7. **Due date** — e.g. "Due within 7 days of the date of this invoice"
8. **Greeting and closing** — "Thank you! In the next cycle, here's the work..."

## SAMPLE FORMAT

    INVOICE #INV-2025-001
    Date: 2025-08-15
    Due: 2025-08-22

    From:
    [Your name]
    [Your email]
    [PayPal: email@example.com | GCash: 0917xxxxxxx]

    For:
    [Client name]
    [Company]

    ------------------------------------------------
    DESCRIPTION                     HOURS   AMOUNT
    ------------------------------------------------
    Email management (Aug 1–14)     28 hrs  $224.00
    Calendar & scheduling            6 hrs   $48.00
    ------------------------------------------------
    TOTAL                                    $272.00
    ------------------------------------------------

    Terms: Due within 7 days. Thank you!

## STEPS TO REMEMBER
1. Invoice **on the same day** each cycle — don't let them pile up.
2. Keep issuing invoice numbers in order. No changing it.
3. Always record the hours you spend — as you work, not at the end of the month.
4. If payment hasn't arrived by the due date, follow up **on the first day** of lateness.
5. If it's over 14 days late, pause the work and remind the client of the agreement. It's professional — not rude.
6. Keep a PDF copy of every invoice — and proof of payment.

## TOOLS YOU CAN USE
- **Wave** (free) — generates a PDF invoice and tracks payments
- **Google Sheets** — for your own template
- **FreshBooks / QuickBooks** — if the client already has one, use theirs`,
  },
  {
    key: "resume",
    title: "Resume Template",
    desc: "A flash-light one-page resume guiding you line by line. Skill headline up top, numbers in every bullet — so it survives the 6-second scan.",
    filename: "resume-template.md",
    content: `# [FULL NAME]
[City, Province] | [email] | [phone] | [linkedin.com/in/yourname]

## VIRTUAL ASSISTANT — [Niche, e.g. ADMIN SUPPORT FOR REAL ESTATE]

Detail-focused VA who helps [type of business] in [your main skill]
so they can stay focused on [the result]. Certified in [certificate],
comfortable with [tool] and [tool].

## SKILLS
[8 skills, comma-separated]
Email management, calendar scheduling, Google Sheets, Canva, Zoom, Slack,
data entry (75+ WPM), social media scheduling

## EXPERIENCE

[Role or title] | [Company, Organization, or "Sample Project"] | [Year–Year]
- [Action + number/result]. e.g. "Managed a 3,000-contact inbox; cleared
  daily, answered 90% of inquiries within 24 hours."
- [Action + number/result]. e.g. "Scheduled 40+ client appointments a
  month, zero double-bookings."
- [Action + result]. e.g. "Built a monthly expense tracker used by the
  entire team."

[Secondary role] | [Company] | [Year–Year]
- [Same format as above]

## CERTIFICATES
- [Certificate name] — [Provider], [Year]
- [Certificate name] — [Provider], [Year]

## EDUCATION
[Degree or track] | [School] | [Year]

TIP: Swap every adjective for a number. "Fast" becomes
"75+ WPM." "Organized" becomes "zero double-bookings."`,
  },
  {
    key: "cover-letter-a",
    title: "Cover Letter A — Job Post or Agency Application",
    desc: "The hook/fit/proof/ask method for formal applications. Hook on the first line, sample proof in the middle, a specific CTA at the end.",
    filename: "cover-letter-a.md",
    content: `Subject: [Role] — [Your Name], [Niche] VA

Hi [Name or "Hiring Team"],

[Hook] I noticed you're looking for help with [their problem, from the
post], and I actually have time that exact kind of work for [who], and
it's my favorite part of the job.

[Fit] I'm a [niche] VA with [certificate] and day-to-day experience with
[tool] and [tool]. I keep things [one strength],
[one strength], and I never miss a deadline.

[Proof] I've attached a quick sample: [what it is — an organized inbox,
calendar template, social calendar]. That's what you'd get before you
even hire me.

[Ask] Could we schedule a 15-minute call this week? I'm free [Tuesday or
Thursday] [AM/PM] Philippine time.

Thank you for my consideration,

[Your name]
[Links: LinkedIn / portfolio]`,
  },
  {
    key: "cover-letter-b",
    title: "Cover Letter B — Short Version for Marketplaces",
    desc: "For Upwork, OnlineJobs.ph, and other platforms. The first line is the most important — it must be specific to their post.",
    filename: "cover-letter-b.md",
    content: `Hi [Name],

[Specific line from their posting — it's the only part you change for
each application, and it matters most]

I'm a [niche] VA — [certificate], comfortable with [tool], and I've
done [a sample you can see in my profile]. For [one task they
mention], I'd [specific detail from their post] and report weekly.

Would a 15-minute call this week work for you?

— [Your Name]`,
  },
  {
    key: "thank-you-message",
    title: "Thank-You Message After an Interview",
    desc: "Send within 24 hours of the interview. One paragraph: thanks, one thing you liked, one reason you fit, and a warm question.",
    filename: "thank-you-message.md",
    content: `Hi [Name],

Thank you again for the call today — I really enjoyed learning about
[one thing about their business].

I've been thinking about [the problem they mentioned], and I'd genuinely
like to help there in particular. As I mentioned, I've done
[one related thing you're able to do].

I'm available to start [date] with [day/hour] overlap. Let me know what
the next step is whenever you're ready.

Best regards,
[Your Name]`,
  },
  {
    key: "follow-up-message",
    title: "Follow-Up When You're Ghosted",
    desc: "Send once, 3–4 days later. It gives your application a quick bump without looking desperate.",
    filename: "follow-up-message.md",
    content: `Hi [Name],

Just bumping my application — I know the inbox gets crowded. I've
re-attached my sample work in case it got missed.

If the role's already filled, that's fine — if anything disfort opportunity
opens up, I'm here. Thanks for your time regardless!

[Your Name]`,
  },
  {
    key: "acceptance-message",
    title: "Acceptance Message — Lock In the Details While They're Excited",
    desc: "Send right after they say 'yes'. Lay out everything you discussed — start date, hours, rate, payment method, tasks, tools — before day one.",
    filename: "acceptance-message.md",
    content: `Hi [Name],

Thrilled to get started! To lock everything in and sync our expectations
for day one:

- Start date: [date]
- Working hours: [timezone, overlap hours]
- Rate: [amount] per [hour/week] via [PayPal / Payoneer / Wise / bank]
- Main first-week tasks: [list from the call]
- Tools we'll use: [Slack / Asana / Google Workspace, etc.]

If anything looks wrong, tell me and I'll adjust it. If not, I'll
have everything ready before day one. Looking forward to it!

[Your Name]`,
  },
  {
    key: "mutual-nda",
    title: "Mutual NDA (Non-Disclosure Agreement)",
    desc: "A standard Mutual Non-Disclosure Agreement to protect your client's data, credentials, and business info, while ensuring your own proprietary processes are secure.",
    filename: "mutual-nda.md",
    content: `# MUTUAL NON-DISCLOSURE AGREEMENT (NDA)

**This Agreement is entered into by and between:**
- **Client**: [Client Name / Company] ("Disclosing Party")
- **Service Provider**: [Your Name] ("Receiving Party")

**Effective Date:** [Date]

---

## 1. PURPOSE
The parties wish to explore a business relationship where the Client may share confidential information regarding business plans, access credentials, processes, and tools, and the Provider may share proprietary methods.

## 2. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means any proprietary information, technical data, trade secrets, passwords, client lists, designs, code, financial logs, or business methods disclosed by either party, whether orally or in writing.

## 3. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party agrees:
- To keep all Confidential Information strictly confidential and not disclose it to any third party.
- To use the Confidential Information solely for the performance of VA/Freelance services.
- To use at least the same degree of care as they use to protect their own confidential data.

## 4. EXCLUSIONS
Confidential Information does not include information that:
- Is or becomes publicly known through no breach of this agreement.
- Was already in the Receiving Party's possession prior to disclosure.
- Is independently developed without reference to the Disclosing Party's information.

## 5. TERM AND RETURN OF DATA
This agreement remains in effect during the service term. Upon request or contract termination, the Receiving Party will immediately delete or return all digital files, credentials, and documents of the Disclosing Party.

---

Signatures:
Provider: ______________________  Date: ________
Client: ________________________  Date: ________`
  },
  {
    key: "client-onboarding",
    title: "Client Onboarding Checklist & Kickoff Call Deck",
    desc: "Checklist for your first kickoff call with a new client. Sync expectations, get proper access, and start on the right foot.",
    filename: "client-onboarding.md",
    content: `# CLIENT ONBOARDING CHECKLIST
### Use this in your first Kickoff Call to sync everything.

---

## 1. MEETING AGENDA (KICKOFF DECK)
- **Introduction**: Say hello, thank them, confirm working hours and overlap.
- **Goals of the Month**: What are the top 3 priorities for this month?
- **Communication Channels**:
  - Daily updates: [Slack / WhatsApp / Email]
  - Task board: [Asana / ClickUp / Trello]
  - Video check-ins: [Weekly Zoom / Google Meet, e.g. Monday 9 AM EST]

## 2. ACCESS CHECKLIST (Never ask for raw passwords if possible)
- [ ] **Password Manager**: Share credentials via LastPass/1Password.
- [ ] **Google Workspace**: Invite your email address as a contributor or admin.
- [ ] **Social Accounts**: Log in via Meta Business Suite (do not share main password).
- [ ] **Specific Tools**: [Shopify, HubSpot, CRM, Xero, Stripe, etc.]

## 3. DEFINING "DONE"
- How do we mark tasks as complete?
- Where do I save deliverables? [Drive folder link]
- Who reviews my work, and what is the typical approval turnaround?

## 4. INVOICING & PAYMENT CONFIRMATION
- Billing frequency: [Weekly / Bi-weekly / Monthly]
- Direct details: [Wise email / PayPal / Bank account details]
- Who should receive the invoice? [Client's email or billing manager]`
  },
  {
    key: "weekly-progress-report",
    title: "Weekly Progress Report",
    desc: "A simple, clean weekly update template to send your client. Demonstrates high agency, transparency, and structure without them having to ask.",
    filename: "weekly-progress-report.md",
    content: `# WEEKLY PROGRESS REPORT
**Date:** [Date]
**VA:** [Your Name]
**Client:** [Client Name]

---

## 1. WHAT WAS ACCOMPLISHED THIS WEEK
- **[Task Category 1, e.g. Inbox & Calendar]**:
  - Triaged 180+ emails; inbox maintained at Inbox Zero.
  - Scheduled 8 discovery calls; verified time zones with clients.
- **[Task Category 2, e.g. Social Media]**:
  - Scheduled 5 LinkedIn posts via Buffer.
  - Designed 3 templates in Canva for upcoming product launch.

## 2. KEY METRICS / RESULTS
- Invoice status: Issued INV-2026-04.
- Total hours logged: [e.g. 20.5 hours].
- Response time average: under 1 hour during overlap.

## 3. BLOCKERS / HELP NEEDED
- [ ] Need approval on the new Canva designs before scheduling for next week.
- [ ] Need access to the updated client list in HubSpot.

## 4. PLAN FOR NEXT WEEK
- Set up CRM automation rules for new incoming leads.
- Follow up on outstanding client proposals.
- Clean up draft archives in Google Drive.`
  }
];