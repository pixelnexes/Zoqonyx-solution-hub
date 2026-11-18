"use client";

import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { useSiteSettings } from "@/components/providers/site-settings-provider";

const FOCUS =
  "rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14213D]";
const LINK = `text-[#14213D] hover:underline underline-offset-4 ${FOCUS}`;

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
    <footer className="mt-auto border-t-2 border-[#14213D] bg-white text-[#14213D]">
      <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr] gap-10">
          <div className="space-y-3 max-w-xs">
            <Logo size="md" />
            <p className="text-[15px] leading-relaxed text-[#4A5568]">
              Software, apps and digital marketing services, and free online tools for images, PDFs, code and text.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold mb-3">Tools</h2>
            <ul className="space-y-2 text-[15px]">
              {TOOL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={LINK}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold mb-3">Services</h2>
            <ul className="space-y-2 text-[15px]">
              {SERVICE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={LINK}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold mb-3">Company</h2>
            <ul className="space-y-2 text-[15px]">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={LINK}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold mb-3">Contact</h2>
            <p className="text-[15px]">
              <a href={`mailto:${email}`} className={LINK}>
                {email}
              </a>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#4A5568]">
              Found a bug or want a tool we don&apos;t have? Email us.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-5 border-t border-[#D5DCE4] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-[#4A5568]">
          <p>
            © {new Date().getFullYear()} {siteName}
          </p>
          <p>
            Built by{" "}
            <a
              href={settings.footer_url || "https://newixtechsolutions.com/"}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-semibold ${LINK}`}
            >
              {credit}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
