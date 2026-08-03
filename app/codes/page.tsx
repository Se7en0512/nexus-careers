import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { CODE_GROUPS } from "@/data/codes";
import CopyScript from "@/components/CopyScript";

export const metadata: Metadata = { title: "Codes for Efficiency" };

export const dynamic = "force-dynamic";

export default async function CodesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/signup?next=/codes");

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Codes for Efficiency</div>
          <h1>Copy-paste codes that <em className="italic text-gold-300">make you look fast</em>.</h1>
          <p>
            The formulas, filters, and shortcuts VAs actually use every day. Copy
            the code, adapt the example, and let your spreadsheets and inbox do
            the heavy lifting.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        {CODE_GROUPS.map((group) => (
          <section key={group.key} className="mb-20">
            <div className="mb-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold-400 mb-3">{group.eyebrow}</p>
              <h2 className="font-serif font-medium text-[28px]">{group.title}</h2>
              <p className="text-ink-300 max-w-[640px] mt-3">{group.lead}</p>
            </div>

            <div className="flex flex-col gap-4">
              {group.blocks.map((b) => (
                <div key={b.key} className="panel">
                  <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-navy-700">
                    <p className="font-mono text-[12.5px] text-gold-300">{b.label}</p>
                    <CopyScript script={b.content} />
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-[13px] text-ink-200 leading-relaxed p-6 bg-navy-950 max-h-[420px] overflow-y-auto">
                    {b.content}
                  </pre>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="grid md:grid-cols-2 gap-4">
          <a href="/tutorials" className="panel p-7 block group">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-2">Go deeper</p>
            <h3 className="font-serif font-medium text-[20px] mb-2 group-hover:text-gold-300 transition-colors">Tools Tutorials</h3>
            <p className="text-[13.5px] text-ink-400">Free official tutorials for all 8 tool categories — Google Workspace, project management, CRM, and more.</p>
            <span className="font-mono text-xs text-gold-400 mt-4 inline-block">Open the tutorials →</span>
          </a>
          <a href="/prompts" className="panel p-7 block group">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold-400 mb-2">AI co-pilot</p>
            <h3 className="font-serif font-medium text-[20px] mb-2 group-hover:text-gold-300 transition-colors">Prompt Library</h3>
            <p className="text-[13.5px] text-ink-400">Copy-paste prompts for resume, interview, client outreach, and everyday work.</p>
            <span className="font-mono text-xs text-gold-400 mt-4 inline-block">Open the prompts →</span>
          </a>
        </div>
      </div>
    </>
  );
}
