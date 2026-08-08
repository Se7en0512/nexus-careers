import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import ResumeBuilder from "@/components/ResumeBuilder";
import LockedPreview from "@/components/LockedPreview";

export const metadata: Metadata = { title: "Resume Builder" };

export const dynamic = "force-dynamic";

export default async function ResumeBuilderPage() {
  const user = await getSessionUser();
  if (!user)
    return (
      <LockedPreview
        eyebrow="Free Tool"
        title="Resume Builder"
        description="A clean, client-ready resume in minutes. Fill in the form, watch the preview update live, then save it as a PDF."
        highlights={[
          "Live preview as you fill the form",
          "Export to PDF in minutes",
          "Built for VA roles, by niche",
        ]}
        nextPath="/tools/resume-builder"
      />
    );

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
