"use client";

import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { useSiteSettings } from "@/components/providers/site-settings-provider";

const LINK = "text-white/80 hover:text-white hover:underline underline-offset-4 rounded-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#7FCDB0]";

const TOOL_LINKS = [
  { label: "All tools", href: "/tools" },
  { label: "Images", href: "/category/image-tools" },
  { label: "PDF", href: "/category/pdf-documents" },
  { label: "Developer & SEO", href: "/category/developer-seo" },
  { label: "Text & code", href: "/category/text-code" },
  { label: "CSS & design", href: "/category/css-design" },
  { label: "Calculators", href: "/category/calculators" },
];

const SERVICE_LINKS = [
  { label: "All services", href: "/services" },
  { label: "App development", href: "/services/app-development" },
  { label: "Website development", href: "/services/website-development" },
  { label: "Game development", href: "/services/game-development" },
  { label: "Digital marketing", href: "/services/digital-marketing" },
  { label: "AI & NLP", href: "/services/ai-nlp-development" },
  { label: "Blog", href: "/blog" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms of service", href: "/terms" },
];

export function Footer() {
  const { settings } = useSiteSettings();
  const email = settings.contact_email_primary || "hello@zoqonyx.com";
  // The stored credit sometimes already starts with "Developed by"; strip it so it isn't shown twice.
  const credit = (settings.footer_credit || "Newix Tech Solutions").replace(/^\s*(developed|built|made)\s+by\s+/i, "");
  const siteName = settings.site_name || "Zoqonyx Solution Hub";

  return (
    <footer className="mt-auto text-white" style={{ background: "#16231F" }}>
      {/* CTA banner */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-14">
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12" style={{ background: "#16231F" }}>
          <div aria-hidden="true" className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/15 blur-2xl" />
          <div aria-hidden="true" className="absolute right-24 bottom-[-4rem] h-48 w-48 rounded-full bg-[#F2A81D]/40 blur-3xl" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="zq-display text-3xl sm:text-4xl font-extrabold leading-tight">Have a project in mind?</h2>
              <p className="mt-3 text-[17px] leading-relaxed text-white/90">Tell us what you want to build. We will reply with questions and next steps.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/#contact" className="zq-btn zq-btn-sun">
                Get a quote <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a href={`mailto:${email}`} className="zq-btn zq-btn-ghost">
                <Mail className="w-4 h-4" aria-hidden="true" /> {email}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr] gap-10">
          <div className="space-y-4 max-w-xs">
            <Logo size="md" onDark />
            <p className="text-[15px] leading-relaxed text-white/75">
              Software, apps and digital marketing services, and free online tools for images, PDFs, code and text.
            </p>
          </div>

          {[
            { title: "Tools", links: TOOL_LINKS },
            { title: "Services", links: SERVICE_LINKS },
            { title: "Company", links: COMPANY_LINKS },
          ].map((col) => (
            <div key={col.title}>
              <h2 className="text-base font-bold mb-3 text-white">{col.title}</h2>
              <ul className="space-y-2 text-[15px]">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={LINK}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="text-base font-bold mb-3 text-white">Contact</h2>
            <p className="text-[15px]">
              <a href={`mailto:${email}`} className={LINK}>
                {email}
              </a>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">Found a bug or want a tool we don&apos;t have? Email us.</p>
          </div>
        </div>

        <div className="mt-12 pt-5 border-t border-white/[0.12] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-white/70">
          <p>
            © {new Date().getFullYear()} {siteName}
          </p>
          <p>
            Built by{" "}
            <a href={settings.footer_url || "https://newixtechsolutions.com/"} target="_blank" rel="noopener noreferrer" className={`font-semibold ${LINK}`}>
              {credit}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
