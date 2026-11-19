import { prisma } from "@/lib/prisma";
import { photoAlt } from "@/lib/photos";
import { PageHero } from "@/components/kit/page-kit";
import type { Metadata } from "next";
import { ShieldCheck, Zap, Lock, Cpu, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MarkdownRenderer } from "@/components/common/markdown-renderer";

export const revalidate = 300;

export const metadata: Metadata = {
  title: {
    absolute: "About Zoqonyx Solution Hub | Free Online Tools",
  },
  description:
    "Learn about Zoqonyx Solution Hub, developed by Newix Tech Solutions. Our mission is to provide 148+ fast, privacy-first, zero-upload digital utilities with no subscriptions.",
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
- **Web Workers & Chunked Streaming**: Background multi-threading that processes heavy batch operations (up to 100 files and 1 GB combined capacity) without freezing your user interface.
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

  const stats = [
    { v: "148+", l: "Live free tools", g: "zq-g-indigo", I: Cpu },
    { v: "0 bytes", l: "Uploaded to the cloud", g: "zq-g-aqua", I: Globe },
    { v: "100%", l: "Free, no login", g: "zq-g-emerald", I: ShieldCheck },
    { v: "0 ms", l: "Upload waiting", g: "zq-g-sun", I: Zap },
  ];
  const features = [
    { I: Lock, g: "zq-g-violet", t: "Privacy by design", d: "Files stay on your device. Suitable for confidential contracts, financial records and GDPR-sensitive work." },
    { I: Zap, g: "zq-g-coral", t: "Fast bulk processing", d: "Process up to 100 photos or documents (1 GB combined) at once, with clear progress indicators." },
  ];

  return (
    <div className="zq-page">
      <PageHero crumbs={[{ label: "Home", href: "/" }, { label: "About" }]} title={title} intro="A suite of free utilities for developers, designers, creators and teams that run in your browser, with no remote data collection." badge="Built by Newix Tech Solutions" image="/photos/u-office2.webp" />

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 zq-section space-y-10">
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 -mt-6 relative">
          {stats.map((x) => (
            <li key={x.l} className="zq-card p-5">
              <span className={`zq-chip zq-chip-sm ${x.g}`} aria-hidden="true">
                <x.I className="w-[18px] h-[18px]" />
              </span>
              <p className="zq-display mt-3 text-2xl font-extrabold">{x.v}</p>
              <p className="text-sm text-[#5C5878]">{x.l}</p>
            </li>
          ))}
        </ul>

        <div className="grid gap-4 sm:grid-cols-3">
          {["u-team", "u-dev", "u-server"].map((n) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={n} src={`/photos/${n}.webp`} alt={photoAlt(n)} width={1200} height={800} loading="lazy" className="h-48 w-full rounded-xl object-cover" />
          ))}
        </div>

        <div className="zq-card p-6 sm:p-10">
          <MarkdownRenderer content={content} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <div key={f.t} className="zq-card p-6">
              <span className={`zq-chip ${f.g}`} aria-hidden="true">
                <f.I className="w-6 h-6" />
              </span>
              <h2 className="mt-4 text-xl font-bold">{f.t}</h2>
              <p className="mt-1.5 text-[15px] leading-relaxed text-[#5C5878]">{f.d}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[22px] p-7 sm:p-9 text-white flex flex-col sm:flex-row items-center justify-between gap-5" style={{ background: "#1B1340" }}>
          <div>
            <p className="zq-display text-2xl font-extrabold">Ready to try a tool?</p>
            <p className="mt-1 zq-on-dark-muted">Open any of the free tools. No sign-up needed.</p>
          </div>
          <Link href="/tools" className="zq-btn zq-btn-sun shrink-0">
            Explore all tools <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
