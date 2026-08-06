import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import ResumeBuilder from "@/components/ResumeBuilder";

export const metadata: Metadata = { title: "Resume Builder" };

export const dynamic = "force-dynamic";

export default async function ResumeBuilderPage() {
  const user = await getSessionUser();
  if (!user) redirect("/signup?next=/tools/resume-builder");

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Free Tool</div>
          <h1>Resume Builder</h1>
          <p>
            A clean, client-ready resume in minutes. Fill in the form, watch the
            preview update live, then save it as a PDF.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <ResumeBuilder />
      </div>
    </>
  );
}
