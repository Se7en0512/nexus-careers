import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import RateCardForm from "@/components/RateCardForm";

export const metadata: Metadata = { title: "Rate Card Generator" };

export const dynamic = "force-dynamic";

export default async function RateCardGeneratorPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/tools/rate-card-generator");

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="eyebrow">Tool</div>
              <h1 className="mb-0">Rate Card Generator</h1>
              <p className="mt-4">
                A clean, shareable page of your packages and rates — send it to prospects before
                the first call so you never negotiate from zero.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap py-16">
        <RateCardForm />
      </div>
    </>
  );
}