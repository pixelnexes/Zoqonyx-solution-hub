import type { Metadata } from "next";
import { PageHero } from "@/components/kit/page-kit";
import { ReviewForm } from "@/components/site/review-form";

export const metadata: Metadata = {
  title: { absolute: "Write a Review | Zoqonyx" },
  description: "Worked with Zoqonyx or used our free tools? Share a short review. Reviews are checked before they appear on the site.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://zoqonyx.com/review" },
};

export default function ReviewPage() {
  return (
    <div className="zq-page">
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Write a review" }]}
        title="Write a review"
        intro="Worked with us or used our tools? Tell others how it went. We read every review before it is published."
        image="/photos/u-review.webp"
      />
      <div className="container mx-auto max-w-2xl px-4 zq-section">
        <div className="zq-card p-6 sm:p-8">
          <ReviewForm />
        </div>
      </div>
    </div>
  );
}
