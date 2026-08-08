import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import JobTracker, { JobApplication } from "@/components/JobTracker";
import LockedPreview from "@/components/LockedPreview";

export const metadata: Metadata = { title: "Application Tracker" };

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
    const user = await getSessionUser();
    if (!user)
        return (
            <LockedPreview
                eyebrow="Tool"
                title="Job Application Tracker"
                description="Track all your applications, follow-up dates, and status — unlimited and free."
                highlights={[
                    "Track every application in one place",
                    "Follow-up dates so no lead goes cold",
                    "Unlimited and free for account holders",
                ]}
                nextPath="/applications"
            />
        );

    const initialApplications = db
        .prepare("SELECT * FROM job_applications WHERE user_id = ? ORDER BY applied_date DESC, id DESC")
        .all(user.id) as unknown as JobApplication[];

    return (
        <>
            <section className="page-hero">
                <div className="wrap">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div>
                            <div className="eyebrow">Tool</div>
                            <h1 className="mb-0">Job Application Tracker</h1>
                            <p className="mt-4">
                                Track all your applications, follow-up dates, and status — unlimited and free.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="wrap py-16">
                <JobTracker initialApplications={initialApplications} isGuest={false} />
            </div>
        </>
    );
}