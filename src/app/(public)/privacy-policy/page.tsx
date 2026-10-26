import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { ShieldCheck, Lock, EyeOff, ServerOff } from "lucide-react";
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
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <div className="space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-teal-500/20 bg-teal-500/10 text-xs font-mono text-teal-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Client-Side Data Protection Standards</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
          Everything you process on Zoqonyx remains strictly within your browser sandbox. Zero cloud storage, zero tracking, and zero data monetization.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        <div className="p-4 rounded-xl border border-border bg-card/70 space-y-1">
          <ServerOff className="w-5 h-5 text-teal-400 mb-1" />
          <p className="text-sm font-bold text-foreground">Zero Cloud Storage</p>
          <p className="text-xs text-muted-foreground">Files never touch remote servers</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card/70 space-y-1">
          <EyeOff className="w-5 h-5 text-teal-400 mb-1" />
          <p className="text-sm font-bold text-foreground">Zero Data Tracking</p>
          <p className="text-xs text-muted-foreground">No cross-site cookies or telemetry</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card/70 space-y-1">
          <Lock className="w-5 h-5 text-teal-400 mb-1" />
          <p className="text-sm font-bold text-foreground">Volatile Memory</p>
          <p className="text-xs text-muted-foreground">Wiped instantly on tab close</p>
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-card/90 p-6 sm:p-10 shadow-xs">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
}