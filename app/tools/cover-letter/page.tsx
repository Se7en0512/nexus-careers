import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import CoverLetterBuilder from "@/components/CoverLetterBuilder";
import LockedPreview from "@/components/LockedPreview";

export const metadata: Metadata = { title: "Cover Letter Builder" };

export const dynamic = "force-dynamic";

export default async function CoverLetterPage() {
  const user = await getSessionUser();
  if (!user)
    return (
      <LockedPreview
        eyebrow="Tool"
        title="Cover Letter Builder"
        description="Write a letter that sounds human — not an overused template that makes you sound like everyone else."
        highlights={[
          "Hook, fit, proof, ask — a proven structure",
          "Sounds human, not templated",
          "Save time with guided fields",
        ]}
        nextPath="/tools/cover-letter"
      />
    );

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Tool</div>
          <h1>Cover Letter Builder</h1>
          <p>
            Write a letter that sounds human — not an overused template that
            makes you sound like everyone else.
          </p>
        </div>
      </section>
      <div className="wrap py-16">
        <CoverLetterBuilder />
      </div>
    </>
  );
}
