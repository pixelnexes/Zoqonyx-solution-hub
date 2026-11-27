"use client";

import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { useSiteSettings } from "@/components/providers/site-settings-provider";

const LINK = "text-white/75 hover:text-white hover:underline underline-offset-4 rounded-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFA487]";

const TOOL_LINKS = [
  { label: "All tools", href: "/tools" },
  { label: "Images", href: "/category/image-tools" },
  { label: "PDF", href: "/category/pdf-documents" },
  { label: "Developer & SEO", href: "/category/developer-seo" },
  { label: "Text & code", href: "/category/text-code" },
  { label: "CSS & design", href: "/category/css-design" },
  { label: "Calculators", href: "/category/calculators" },
  { label: "Backlink checker", href: "/tools/backlink-checker" },
  { label: "Schema markup generator", href: "/tools/schema-markup-generator" },
  { label: "Request a tool", href: "/request-tool" },
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
    <footer className="mt-auto text-white">
      <div className="bg-[#161513] pt-14">
        <div className="container mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
            <div className="max-w-xs space-y-4">
              <Logo size="md" onDark />
              <p className="text-[15px] leading-relaxed text-white/70">
                Software, apps and digital marketing services, and free online tools for images, PDFs, code and text.
              </p>
            </div>

            {[
              { title: "Tools", links: TOOL_LINKS },
              { title: "Services", links: SERVICE_LINKS },
              { title: "Company", links: COMPANY_LINKS },
            ].map((col) => (
              <div key={col.title}>
                <h2 className="mb-3 text-base font-semibold text-white">{col.title}</h2>
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
              <h2 className="mb-3 text-base font-semibold text-white">Contact</h2>
              <p className="text-[15px]">
                <a href={`mailto:${email}`} className={LINK}>
                  {email}
                </a>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">Found a bug or want a tool we don&apos;t have? Email us.</p>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-5 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {siteName}
            </p>
            <p>
              A product of{" "}
              <a href={settings.footer_url || "https://newixtechsolutions.com/"} target="_blank" rel="noopener noreferrer" className={`font-semibold ${LINK}`}>
                {credit}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </div>
          <a href="https://nicklaunches.com/products/zoqonyx/" target="_blank" rel="noopener" className="mt-4 inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://nicklaunches.com/badges/featured-dark.png" alt="Zoqonyx on Nick Launches" width={244} height={56} loading="lazy" />
          </a>
        </div>
      </div>
    </footer>
  );
}
