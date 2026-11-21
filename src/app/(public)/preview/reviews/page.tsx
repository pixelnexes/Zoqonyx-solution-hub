import type { Metadata } from "next";
import { TestimonialsSection } from "@/components/site/reviews-section";
import type { TestimonialItem } from "@/lib/content";

// Design preview for partners. Not linked, not in the sitemap, and hidden from search engines.
export const metadata: Metadata = {
  title: { absolute: "Review section preview | Zoqonyx" },
  robots: { index: false, follow: false },
};

const SAMPLE_TEXT = [
  "Sample text: the team explained every step clearly and kept us updated each week.",
  "Sample text: delivery was on schedule and the final result matched what we discussed.",
  "Sample text: communication was easy, even across different time zones.",
  "Sample text: they suggested simpler options that saved us time and budget.",
  "Sample text: the first version was ready quickly and we could click through it early.",
  "Sample text: questions got clear answers, and changes were handled without fuss.",
  "Sample text: the website loads fast and looks good on phones.",
  "Sample text: the handover was tidy, with notes our own team could follow.",
  "Sample text: support after launch was prompt and polite.",
  "Sample text: the app works smoothly and our users find it easy to use.",
  "Sample text: they asked good questions before writing any code.",
  "Sample text: pricing and scope were explained in plain words from the start.",
  "Sample text: our search visibility improved after the technical fixes were made.",
  "Sample text: the free tools are quick and do not ask for sign-up.",
  "Sample text: the design felt modern and matched our brand.",
  "Sample text: they were honest about what could be done within our budget.",
  "Sample text: testing was thorough, and we found very few issues after release.",
  "Sample text: the CRM setup saved our sales team a lot of manual work.",
  "Sample text: weekly demos made it easy to give feedback early.",
  "Sample text: a reliable team that we would work with again.",
];

const SAMPLES: TestimonialItem[] = SAMPLE_TEXT.map((quote, i) => ({
  id: `sample-${i}`,
  name: "Client name",
  role: "Role",
  company: "Company",
  quote,
  rating: i % 5 === 3 ? 4 : 5,
  serviceSlug: "",
}));

export default function ReviewsPreviewPage() {
  return (
    <div className="zq-page">
      <div className="bg-amber-100 px-4 py-3 text-center text-sm font-semibold text-amber-900">
        Design preview only. These are sample cards with placeholder text, not real client reviews. Real reviews replace them before this goes on the public pages.
      </div>
      <div className="py-10">
        <TestimonialsSection items={SAMPLES} />
      </div>
    </div>
  );
}
