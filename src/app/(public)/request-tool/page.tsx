import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/kit/page-kit";
import { LeadForm } from "@/components/site/lead-form";

const URL = "https://zoqonyx.com/request-tool";
const TITLE = "Request a Free Custom Online Tool | Zoqonyx";
const DESCRIPTION = "Need a tool that does not exist yet? Describe it and send a free request. We build useful ones and add them to Zoqonyx.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    type: "website",
    images: [{ url: "https://zoqonyx.com/logo/zoqonyx-og-v2.png", width: 1200, height: 630, alt: "Zoqonyx: free online tools by Newix Tech Solutions" }],
  },
};

const FAQ = [
  {
    q: "Is a tool request really free?",
    a: "Yes. Sending a request costs nothing, and tools we build from requests are free to use on Zoqonyx.",
  },
  {
    q: "Will every request be built?",
    a: "No. We choose requests that are useful to many people and can work as an online tool. We reply by email.",
  },
  {
    q: "Can I get a private tool only for my company?",
    a: "Yes, as a custom software project. It is quoted separately from free requests.",
  },
  {
    q: "What should I include?",
    a: "The task, one example input with the result you expect, and who would use it. Use made-up data in examples.",
  },
];

export default function RequestToolPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div className="zq-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Request a tool" }]}
        title="Need a custom tool? Ask for it free"
        intro="Tell us the task you want a tool for. We build the useful ones and add them to Zoqonyx, free to use."
        image="/photos/u-wireframe.webp"
      />
      <div className="container mx-auto max-w-3xl px-4 zq-section space-y-12">
        <section aria-labelledby="request-form" className="zq-card p-6 sm:p-10">
          <h2 id="request-form" className="zq-display text-2xl font-semibold text-[#161513]">
            Describe your tool
          </h2>
          <p className="mt-2 mb-6 text-[15px] text-[#5E5B55]">
            We reply by email. Need something private for your company instead? See{" "}
            <Link href="/services/custom-software-development" className="font-semibold underline underline-offset-4">
              custom software development
            </Link>
            .
          </p>
          <LeadForm services={[]} variant="tool" />
        </section>

        <section aria-labelledby="request-faq">
          <h2 id="request-faq" className="zq-display text-2xl font-semibold text-[#161513]">
            Questions about tool requests
          </h2>
          <dl className="mt-5 divide-y divide-[#E5E2DC]">
            {FAQ.map((f) => (
              <div key={f.q} className="py-4">
                <dt className="font-semibold text-[#161513]">{f.q}</dt>
                <dd className="mt-1 text-[15px] leading-relaxed text-[#5E5B55]">{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-[15px] text-[#5E5B55]">
            Or check whether it already exists in{" "}
            <Link href="/tools" className="font-semibold underline underline-offset-4">
              all free tools
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
