import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import RedFlagChecker from "@/components/RedFlagChecker";
import LockedPreview from "@/components/LockedPreview";

export const metadata: Metadata = { title: "Contract Red-Flag Checker" };

export const dynamic = "force-dynamic";

export default async function RedFlagCheckerPage() {
    const user = await getSessionUser();
    if (!user)
        return (
            <LockedPreview
                eyebrow="Tool"
                title="Contract Red-Flag Checker"
                description="Paste a message, job post, or contract excerpt. Scam indicators are detected automatically using our red-flag pattern library."
                highlights={[
                    "Paste any message, post, or contract excerpt",
                    "Automatic detection of scam indicators",
                    "Get flagged patterns explained before you reply",
                ]}
                nextPath="/tools/red-flag-checker"
            />
        );

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
