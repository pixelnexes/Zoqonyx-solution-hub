import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { CheckCircle2, Shield } from "lucide-react";
import { MarkdownRenderer } from "@/components/common/markdown-renderer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Terms of Service & Usage Policy | Zoqonyx",
  },
  description:
    "Review the Terms of Service governing the usage of Zoqonyx Solution Hub online tools and services. Free for personal and commercial applications.",
  alternates: {
    canonical: "https://zoqonyx.com/terms",
  },
};

const DEFAULT_TERMS_CONTENT = `## Terms of Service & Acceptable Use

By accessing or utilizing Zoqonyx Solution Hub, you agree to comply with and be bound by the following terms and conditions.

---

### 1. Permitted Use & Commercial Rights

- **Universal Free Access**: All utilities on Zoqonyx are provided completely free of charge.
- **Unrestricted Commercial Output**: Any file, image, code snippet, CSS stylesheet, or document generated using our tools is 100% yours. You are free to use generated assets in personal, commercial, and enterprise client deliverables without watermarks or attribution requirements.
- **No Reverse Engineering of Infrastructure**: You agree not to attempt to disrupt, exploit, or overwhelm the web application infrastructure through automated denial-of-service (DoS) attacks or abusive scraping bots.

---

### 2. Intellectual Property & Privacy

- Zoqonyx Solution Hub does not claim ownership of any content you process through our tools.
- Because all processing occurs client-side in your local browser sandbox, we do not store, view, or retain copies of your files.

---

### 3. Disclaimer of Warranties

All tools, calculators, and converters are provided on an "as is" and "as available" basis without warranties of any kind. While our algorithms undergo strict mathematical and algorithmic validation, Zoqonyx Solution Hub and Newix Tech Solutions shall not be liable for any indirect damages resulting from calculations or document modifications.

---

### 4. Continuous Service Evolution

We frequently deploy feature enhancements and performance updates. We reserve the right to modify tool interfaces, expand capabilities, or retire deprecated legacy utilities without prior individual notice.`;

export default async function TermsPage() {
  let dbPage = null;
  try {
    dbPage = await prisma.page.findUnique({
      where: { slug: "terms" },
    });
  } catch (e) {
    console.error("Error fetching terms page:", e);
  }

  const content = dbPage?.content || DEFAULT_TERMS_CONTENT;
  const title = dbPage?.title || "Terms of Service";

  return (
    <div className="zq-page">
      <section className="zq-banner">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">Fair and transparent usage</p>
          <h1 className="zq-in-solid zq-display mt-4 max-w-3xl text-4xl sm:text-6xl font-extrabold leading-[1.03]">{title}</h1>
          <p className="zq-in mt-4 max-w-2xl text-[18px] leading-relaxed zq-on-dark-muted">Clear terms that allow personal and commercial use of everything you create with the tools.</p>
        </div>
      </section>
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 zq-section space-y-8">
        <div className="zq-card p-6 sm:p-10">
          <MarkdownRenderer content={content} />
        </div>
      </div>
    </div>
  );
}
