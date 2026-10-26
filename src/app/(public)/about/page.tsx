import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { ShieldCheck, Zap, Lock, Cpu, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MarkdownRenderer } from "@/components/common/markdown-renderer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "About Zoqonyx Solution Hub | Free Online Tools",
  },
  description:
    "Learn about Zoqonyx Solution Hub, developed by Newix Tech Solutions. Our mission is to provide 113+ fast, privacy-first, zero-upload digital utilities with no subscriptions.",
  alternates: {
    canonical: "https://zoqonyx.com/about",
  },
};

const DEFAULT_ABOUT_CONTENT = `## Why We Built Zoqonyx Solution Hub

Most free online tools have become bloated, aggressive, and hostile to user privacy. You visit a site to compress a simple image or format a JSON payload, only to encounter:
- Mandatory sign-up walls and credit card requirements.
- Daily usage quotas that block your workflow after two conversions.
- Remote server uploads that send your confidential legal documents, client assets, and proprietary source code to unknown third-party cloud servers.
- Slow network upload times and annoying queue wait times.

Zoqonyx Solution Hub was created by **Newix Tech Solutions** to establish an uncompromising new standard: **high-performance digital utilities that execute 100% in your browser, completely free, with zero logins and zero data collection.**

---

### The Zero-Upload Browser Architecture

Every tool in our catalog is engineered to execute within your device's sandboxed browser runtime using modern Web APIs:
- **HTML5 Canvas & WebGL**: Hardware-accelerated image scaling, format transcoding, and bicubic bicompression on your local GPU/CPU.
- **Web Workers**: Background multi-threading that processes heavy batch operations (up to 50 files) without freezing your user interface.
- **WebAssembly (WASM)**: Native-speed PDF parsing, stream manipulation, and document reconstruction directly in client memory.
- **Web Crypto API**: High-entropy cryptographic hashing, key generation, and UUID generation with zero telemetry.

Because your files never leave your computer, your private data cannot be intercepted, logged, leaked, or monetized.

---

### Our Core Commitments to You

1. **Zero Mandatory Accounts**: No sign-ups, no email harvesting, no password management. Jump straight into the utility you need.
2. **100% Free Forever**: No surprise paywalls, watermark stamps, or artificial feature gating.
3. **Session-Only Memory**: All temporary processing buffers live strictly in volatile memory. When you close or refresh the tab, every byte is permanently cleared.
4. **Transparent Engineering**: Clean, minimal interfaces focused on density, speed, and precision.`;

export default async function AboutPage() {
  let dbPage = null;
  try {
    dbPage = await prisma.page.findUnique({
      where: { slug: "about" },
    });
  } catch (e) {
    console.error("Error fetching about page:", e);
  }

  const content = dbPage?.content || DEFAULT_ABOUT_CONTENT;
  const title = dbPage?.title || "About Zoqonyx Solution Hub";

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
      {/* Header Badge & Title */}
      <div className="space-y-4 mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-teal-500/20 bg-teal-500/10 text-xs font-mono text-teal-400">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
          <span>Engineered by Newix Tech Solutions</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-foreground">
          {title}
        </h1>

        <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
          A modern suite of 113+ professional digital utilities engineered for developers, designers, creators, and teams—running entirely client-side with zero remote data collection.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        <div className="p-4 rounded-xl border border-border bg-card/70 space-y-1">
          <p className="text-2xl font-black font-mono text-foreground">113+</p>
          <p className="text-xs text-muted-foreground font-medium">Live Free Tools</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card/70 space-y-1">
          <p className="text-2xl font-black font-mono text-teal-400">0 Bytes</p>
          <p className="text-xs text-muted-foreground font-medium">Uploaded to Cloud</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card/70 space-y-1">
          <p className="text-2xl font-black font-mono text-foreground">100%</p>
          <p className="text-xs text-muted-foreground font-medium">Free & No Login</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card/70 space-y-1">
          <p className="text-2xl font-black font-mono text-teal-400">0ms</p>
          <p className="text-xs text-muted-foreground font-medium">Upload Waiting</p>
        </div>
      </div>

      {/* Content Container */}
      <div className="rounded-xl border border-border/80 bg-card/90 p-6 sm:p-10 shadow-xs space-y-8">
        <MarkdownRenderer content={content} />

        {/* Feature Highlights Grid */}
        <div className="pt-8 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/20 border border-border/60 space-y-2">
            <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm">
              <Lock className="w-4 h-4" />
              <span>Strict Privacy By Design</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Files remain on your local machine. Ideal for HIPAA, GDPR, financial records, and confidential contracts.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-muted/20 border border-border/60 space-y-2">
            <div className="flex items-center gap-2 text-teal-400 font-semibold text-sm">
              <Zap className="w-4 h-4" />
              <span>Non-Blocking Bulk Batching</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Batch process up to 50 photos or documents simultaneously with responsive progress indicators.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-lg bg-teal-500/5 border border-teal-500/20">
          <div>
            <p className="text-sm font-bold text-foreground">Ready to streamline your workflow?</p>
            <p className="text-xs text-muted-foreground">Access all 113 free tools instantly with no sign-up.</p>
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
          >
            <span>Explore All 113 Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}