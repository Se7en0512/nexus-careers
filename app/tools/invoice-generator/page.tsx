import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import InvoiceGenerator from "@/components/InvoiceGenerator";
import LockedPreview from "@/components/LockedPreview";

export const metadata: Metadata = { title: "Invoice Generator" };

export const dynamic = "force-dynamic";

export default async function InvoiceGeneratorPage() {
    const user = await getSessionUser();
    if (!user)
        return (
            <LockedPreview
                eyebrow="Tool"
                title="Invoice Generator"
                description="Create clean invoices for your clients. Dynamic line items, PHP/USD currency toggle, and instant print/save-as-PDF."
                highlights={[
                    "Dynamic line items for any scope of work",
                    "PHP/USD currency toggle",
                    "Print or save as PDF instantly",
                ]}
                nextPath="/tools/invoice-generator"
            />
        );

    return (
        <>
            <section className="page-hero">
                <div className="wrap">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div>
                            <div className="eyebrow">Tool</div>
                            <h1 className="mb-0">Invoice Generator</h1>
                            <p className="mt-4">
                                Create clean invoices for your clients. Dynamic line items, PHP/USD
                                currency toggle, and instant print/save-as-PDF.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="wrap py-16">
                <InvoiceGenerator />
            </div>
        </>
    );
}
