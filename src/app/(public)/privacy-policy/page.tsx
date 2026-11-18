import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { Lock, EyeOff, ServerOff } from "lucide-react";
import { MarkdownRenderer } from "@/components/common/markdown-renderer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Privacy Policy & Security Guarantee | Zoqonyx",
  },
  description:
    "Read the Zoqonyx Solution Hub privacy policy. Learn why client-side processing guarantees your private media, documents, and code remain 100% confidential.",
  alternates: {
    canonical: "https://zoqonyx.com/privacy-policy",
  },
};

const DEFAULT_PRIVACY_CONTENT = `## Absolute Client-Side Privacy Guarantee

At Zoqonyx Solution Hub, privacy is not a marketing promise—it is the foundational architecture of every tool we build. 

---

### Zero Remote File Uploads

When you compress an image, merge a PDF document, format a JSON payload, or compute cryptographic hashes on Zoqonyx, **your data never leaves your web browser**. 
- Processing executes locally inside your device's isolated browser sandbox via HTML5 Canvas, WebAssembly (WASM), and Web Workers.
- We do not operate remote processing servers that ingest, cache, or inspect user files.
- No third party, including Zoqonyx and Newix Tech Solutions, can access or view the documents or text you process.

---

### Volatile Session Memory

All working memory buffers (such as loaded image canvases or parsed PDF streams) exist strictly in your browser's temporary RAM for the active browser session.
- Once you close or refresh your tab, all memory is immediately released and permanently wiped.
- We do not store processed files on local storage or persistent disk cookies.

---

### Minimal Analytics & Cookies

We respect your digital autonomy:
- We do not use third-party tracking pixels, biometric trackers, or cross-site fingerprinting.
- Non-personally identifiable telemetry may be logged solely to monitor aggregate bandwidth usage, system uptime, and server health.
- We never monetize, package, or sell user traffic data to advertising brokers.`;

export default async function PrivacyPolicyPage() {
  let dbPage = null;
  try {
    dbPage = await prisma.page.findUnique({
      where: { slug: "privacy-policy" },
    });
  } catch (e) {
    console.error("Error fetching privacy policy page:", e);
  }

  const content = dbPage?.content || DEFAULT_PRIVACY_CONTENT;
  const title = dbPage?.title || "Privacy Policy & Zero Data Retention Guarantee";

  return (
    <div className="zq-page">
      <section className="zq-banner">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">Client-side data protection</p>
          <h1 className="zq-in-solid zq-display mt-4 max-w-3xl text-4xl sm:text-6xl font-extrabold leading-[1.03]">{title}</h1>
          <p className="zq-in mt-4 max-w-2xl text-[18px] leading-relaxed zq-on-dark-muted">Everything you process on Zoqonyx stays in your browser. No cloud storage, no tracking and no data sales.</p>
        </div>
      </section>
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 zq-section space-y-8">
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 -mt-16 relative">
          {[
            { I: ServerOff, g: "zq-g-indigo", t: "No cloud storage", d: "Files never touch remote servers" },
            { I: EyeOff, g: "zq-g-violet", t: "No tracking", d: "No cross-site cookies or telemetry" },
            { I: Lock, g: "zq-g-emerald", t: "Volatile memory", d: "Wiped when you close the tab" },
          ].map((x) => (
            <li key={x.t} className="zq-card p-5">
              <span className={`zq-chip zq-chip-sm ${x.g}`} aria-hidden="true">
                <x.I className="w-[18px] h-[18px]" />
              </span>
              <p className="mt-3 text-[16px] font-bold">{x.t}</p>
              <p className="text-sm text-[#4F5B57]">{x.d}</p>
            </li>
          ))}
        </ul>
        <div className="zq-card p-6 sm:p-10">
          <MarkdownRenderer content={content} />
        </div>
      </div>
    </div>
  );
}
