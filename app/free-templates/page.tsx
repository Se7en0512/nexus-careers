import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import { TEMPLATES } from "@/data/templates";
import DownloadTemplate from "@/components/DownloadTemplate";
import LockedPreview from "@/components/LockedPreview";

export const metadata: Metadata = { title: "FREE Templates" };

export const dynamic = "force-dynamic";

export default async function FreeTemplatesPage() {
  const user = await getSessionUser();
  if (!user)
    return (
      <LockedPreview
        eyebrow="FREE Templates"
        title="Copy-paste templates for every step of the journey."
        description="Resume, cover letter, follow-up messages, service agreements, invoicing guides — all free. No subscription needed."
        highlights={[
          "Resume, cover letter & follow-up templates",
          "Service agreements and invoicing guides",
          "Copy, fill in the brackets, and send",
        ]}
        nextPath="/free-templates"
      />
    );

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">FREE Templates</div>
          <h1>Copy-paste templates for every step of the journey.</h1>
          <p>
            Resume, cover letter, follow-up messages, service agreements,
            invoicing guides — all free. No subscription needed.
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
              <pre className="whitespace-pre-wrap font-sans text-[13.5px] text-ink-300 leading-relaxed p-6 bg-navy-950 border border-navy-700 rounded-[3px] max-h-[460px] overflow-y-auto">
                {t.content}
              </pre>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}