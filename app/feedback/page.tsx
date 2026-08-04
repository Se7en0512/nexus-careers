import type { Metadata } from "next";
import FeedbackSection from "@/components/FeedbackSection";

export const metadata: Metadata = {
  title: "Feedback",
  description: "Leave feedback about Thrive — your notes stay on the site for everyone to see.",
};

export default function FeedbackPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">Community</div>
          <h1>Feedback — tell us how the site can help you better.</h1>
          <p>
            What worked, what didn't, and what you want next. Approved feedback stays published
            on this page for every future member to see.
          </p>
        </div>
      </section>

      <div className="wrap py-16 max-w-3xl">
        <FeedbackSection />
      </div>
    </>
  );
}
