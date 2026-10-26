import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { CheckCircle2, Shield, FileText } from "lucide-react";
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
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <div className="space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-teal-500/20 bg-teal-500/10 text-xs font-mono text-teal-400">
          <FileText className="w-3.5 h-3.5" />
          <span>Fair & Transparent Usage Guidelines</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
          Clear, developer-friendly terms granting 100% unrestricted personal and commercial use of all generated output.
        </p>
      </div>

      <div className="rounded-xl border border-border/80 bg-card/90 p-6 sm:p-10 shadow-xs">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
}