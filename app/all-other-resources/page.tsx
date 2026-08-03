import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = { title: "All Other Resources" };

export const dynamic = "force-dynamic";

export default async function AllOtherResourcesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/signup?next=/all-other-resources");

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">All Other Resources</div>
          <h1>Everything else — guides, codes, and tutorials.</h1>
          <p>
            Free resources organized by category. No signup needed.
            No catch.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <div className="flex flex-col gap-16">
          {/* FREE Resources */}
          <section>
            <h2 className="font-serif font-medium text-[24px] mb-6">FREE Resources</h2>
            <div className="flex flex-col gap-4">
              <a href="/codes" className="panel p-6 block group">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-2">Codes for Efficiency</p>
                <h3 className="font-serif font-medium text-[18px] mb-2 group-hover:text-gold-300 transition-colors">Google Sheets, Gmail &amp; Windows shortcuts</h3>
                <p className="text-[13.5px] text-ink-400">Six Sheets formulas, Gmail search operators, keyboard shortcuts, and canned responses.</p>
                <span className="font-mono text-xs text-gold-400 mt-4 inline-block">Open the Codes →</span>
              </a>
              <a href="/tutorials" className="panel p-6 block group">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-2">Tools Tutorials</p>
                <h3 className="font-serif font-medium text-[18px] mb-2 group-hover:text-gold-300 transition-colors">Google Workspace, Communication, CRM &amp; more</h3>
                <p className="text-[13.5px] text-ink-400">Step-by-step guides for every tool a VA needs — with free official training links.</p>
                <span className="font-mono text-xs text-gold-400 mt-4 inline-block">Open the Tutorials →</span>
              </a>
              <a href="/tips" className="panel p-6 block group">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-2">Tips</p>
                <h3 className="font-serif font-medium text-[18px] mb-2 group-hover:text-gold-300 transition-colors">Practical advice for every stage</h3>
                <p className="text-[13.5px] text-ink-400">Before you apply, during the grind, once you're in — and keeping the job.</p>
                <span className="font-mono text-xs text-gold-400 mt-4 inline-block">Open the Tips →</span>
              </a>
            </div>
          </section>

          {/* Tools Tutorials Compilation */}
          <section>
            <h2 className="font-serif font-medium text-[24px] mb-6">Tools Tutorials Compilation</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "Google Workspace &amp; Microsoft", desc: "Gmail, Sheets, Docs, Drive, Excel, Word, Outlook — free official training for every tool.", href: "/tutorials" },
                { title: "Communication Tools", desc: "Slack, WhatsApp Business, Telegram — channels, labels, quick replies, and desktop mode.", href: "/tutorials" },
                { title: "Project Management &amp; Productivity", desc: "Asana, Trello, Notion, Todoist — pick one and learn it deeply.", href: "/tutorials" },
                { title: "Customer Relationship Management (CRM)", desc: "HubSpot, Zoho CRM, Salesforce — even basic knowledge puts you ahead.", href: "/tutorials" },
                { title: "Password Management", desc: "Bitwarden, Google Password Manager — how to handle client logins safely.", href: "/tutorials" },
                { title: "Marketing &amp; Design", desc: "Canva, Meta Blueprint, Google Skillshop, Mailchimp — free official training.", href: "/tutorials" },
                { title: "Conferencing &amp; Meetings", desc: "Zoom, Google Meet, Microsoft Teams — hosting, scheduling, and recordings.", href: "/tutorials" },
                { title: "Finance &amp; Expense Management", desc: "Wise, PayPal, Wave — invoicing, tracking, and getting paid internationally.", href: "/tutorials" },
              ].map((item) => (
                <a key={item.title} href={item.href} className="panel p-6 block group">
                  <h3 className="font-serif font-medium text-[17px] mb-2 group-hover:text-gold-300 transition-colors">{item.title}</h3>
                  <p className="text-[13.5px] text-ink-400">{item.desc}</p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}