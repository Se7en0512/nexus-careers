import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import RedFlagChecker from "@/components/RedFlagChecker";

export const metadata: Metadata = { title: "Contract Red-Flag Checker" };

export const dynamic = "force-dynamic";

export default async function RedFlagCheckerPage() {
    const user = await getSessionUser();
    if (!user) redirect("/login?next=/tools/red-flag-checker");

    return (
        <>
            <section className="page-hero">
                <div className="wrap">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div>
                            <div className="eyebrow">Tool</div>
                            <h1 className="mb-0">Contract Red-Flag Checker</h1>
                            <p className="mt-4">
                                Paste a message, job post, or contract excerpt. Scam indicators are
                                detected automatically using our red-flag pattern library.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="wrap py-16">
                <RedFlagChecker />
            </div>
        </>
    );
}
