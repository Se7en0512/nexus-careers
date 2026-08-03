import type { Metadata } from "next";
import TimezoneConverter from "@/components/TimezoneConverter";

export const metadata: Metadata = { title: "Time Zone Converter" };

export default function TimezonePage() {
    return (
        <>
            <section className="page-hero">
                <div className="wrap">
                    <div className="eyebrow">Free Tool</div>
                    <h1>Time Zone Converter</h1>
                    <p>
                        Always be clear on your client's time. Live clock and manual conversion —
                        Daylight Saving Time is handled automatically for the US, UK, and Australia.
                    </p>
                </div>
            </section>

            <div className="wrap py-16">
                <TimezoneConverter />
            </div>
        </>
    );
}