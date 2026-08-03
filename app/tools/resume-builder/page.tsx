import type { Metadata } from "next";
import ResumeBuilder from "@/components/ResumeBuilder";

export const metadata: Metadata = { title: "Resume Builder" };

export default function ResumeBuilderPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Free Tool</div>
          <h1>Resume Builder</h1>
          <p>
            A clean, client-ready resume in minutes. Fill in the form, watch the
            preview update live, then save it as a PDF — free, no account needed.
          </p>
        </div>
      </section>

      <div className="wrap py-16">
        <ResumeBuilder />
      </div>
    </>
  );
}
