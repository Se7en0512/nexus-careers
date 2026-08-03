import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { TEMPLATES } from "@/data/templates";
import DownloadTemplate from "@/components/DownloadTemplate";

export const metadata: Metadata = { title: "Templates" };

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/signup?next=/templates");

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Templates</div>
          <h1>The documents you should get signed — and sent — before you start working.</h1>
          <p>
            VA work isn't romantic — it's contracts and communication. Contracts protect you on
            scope and pay; resume, cover letter, and follow-up templates bring you closer to a
            "yes." Copy, fill in the [brackets], and send.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <div className="flex flex-col gap-8">
          {TEMPLATES.map((t) => (
            <section key={t.key} className="panel p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
                <div className="max-w-[560px]">
                  <h2 className="font-serif font-medium text-[24px] mb-2">{t.title}</h2>
                  <p className="text-[14.5px] text-ink-300">{t.desc}</p>
                </div>
                <DownloadTemplate filename={t.filename} content={t.content} />
              </div>
              <pre className="whitespace-pre-wrap font-sans text-[13.5px] text-ink-300 leading-relaxed bg-navy-950 border border-navy-700 p-6 rounded-[3px] max-h-[420px] overflow-y-auto">
                {t.content}
              </pre>
            </section>
          ))}
        </div>

        <div className="border-l-2 border-gold-400 pl-5 mt-12 max-w-[640px]">
          <p className="text-[15px] text-ink-300">
            <strong className="text-ink-50">How to use:</strong> download, fill in the
            brackets, and send to the client before you start — or in your first days of work. If
            a client refuses to sign the service agreement, ask yourself why they don't want the
            scope of work clear. For outreach and discovery call
            scripts, go to{" "}
            <a href="/closing-scripts" className="accent-link">Closing Scripts</a>.
          </p>
        </div>
      </div>
    </>
  );
}
