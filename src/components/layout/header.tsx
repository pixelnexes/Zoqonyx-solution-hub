"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SessionHistoryModal } from "@/components/common/session-history-modal";
import { categoryStyle } from "@/components/kit/icons";

// Same names and order as the homepage drawer.
const NAV_CATEGORIES = [
  { label: "Images", href: "/category/image-tools" },
  { label: "PDF", href: "/category/pdf-documents" },
  { label: "Developer & SEO", href: "/category/developer-seo" },
  { label: "Text & code", href: "/category/text-code" },
  { label: "CSS & design", href: "/category/css-design" },
  { label: "Calculators", href: "/category/calculators" },
];

const FOCUS = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#D63A14]";

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative py-1.5 text-[15px] font-semibold rounded-md text-[#161513]/80 hover:text-[#161513] transition-colors",
        "after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[3px] after:rounded-full after:bg-[#D63A14] after:origin-left after:transition-transform after:duration-200",
        active ? "text-[#161513] after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
        FOCUS
      )}
    >
      {children}
    </Link>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [categoriesOpen, setCategoriesOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E2DC] bg-white">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo size="md" />

        <nav aria-label="Main" className="hidden lg:flex items-center gap-7">
          <NavLink href="/services" active={pathname.startsWith("/services")}>
            Services
          </NavLink>
          <NavLink href="/tools" active={pathname === "/tools"}>
            Tools
          </NavLink>

          <div className="relative" onMouseEnter={() => setCategoriesOpen(true)} onMouseLeave={() => setCategoriesOpen(false)}>
            <button
              type="button"
              aria-expanded={categoriesOpen}
              aria-controls="nav-categories"
              onClick={() => setCategoriesOpen((v) => !v)}
              onKeyDown={(e) => e.key === "Escape" && setCategoriesOpen(false)}
              className={cn(
                "inline-flex items-center gap-1 py-1.5 text-[15px] font-semibold rounded-md text-[#161513]/80 hover:text-[#161513]",
                pathname.startsWith("/category") && "text-[#161513]",
                FOCUS
              )}
            >
              Categories
              <ChevronDown aria-hidden="true" className={cn("w-4 h-4 transition-transform motion-reduce:transition-none", categoriesOpen && "rotate-180")} />
            </button>

            {categoriesOpen && (
              <div id="nav-categories" className="absolute top-full left-[-12px] pt-3 z-50">
                <ul className="w-60 rounded-2xl border border-[#E5E2DC] bg-white p-2 shadow-[0_24px_50px_-16px_rgba(22,21,19,.5)]">
                  {NAV_CATEGORIES.map((cat) => {
                    const { Icon, accent } = categoryStyle(cat.label);
                    return (
                      <li key={cat.href}>
                        <Link
                          href={cat.href}
                          aria-current={pathname === cat.href ? "page" : undefined}
                          className={cn("flex items-center gap-3 px-2.5 py-2 rounded-xl text-[15px] font-medium text-[#161513] hover:bg-[#F7F6F4]", pathname === cat.href && "bg-[#F7F6F4] font-semibold", FOCUS)}
                        >
                          <span className={cn("zq-chip zq-chip-sm", accent.chip)}>
                            <Icon className="w-[18px] h-[18px]" />
                          </span>
                          {cat.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <NavLink href="/blog" active={pathname.startsWith("/blog")}>
            Blog
          </NavLink>
          <NavLink href="/about" active={pathname === "/about"}>
            About
          </NavLink>
          <NavLink href="/contact" active={pathname === "/contact"}>
            Contact
          </NavLink>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <SessionHistoryModal />
          <Link href="/contact" data-lead="quote" className="zq-btn zq-btn-sun !h-10 !px-5 !text-[15px]">
            Get a quote <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="flex lg:hidden items-center gap-1">
          <SessionHistoryModal />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className={cn("w-11 h-11 inline-flex items-center justify-center rounded-lg text-[#161513] hover:bg-[#F5F4F2]", FOCUS)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav id="mobile-menu" onClick={(e) => (e.target as Element).closest("a") && setMobileMenuOpen(false)} aria-label="Main" className="lg:hidden border-t border-[#E5E2DC] bg-white px-4 pb-5 max-h-[80vh] overflow-y-auto">
          <ul>
            {[{ label: "Services", href: "/services" }, { label: "Blog", href: "/blog" }, { label: "All tools", href: "/tools" }, ...NAV_CATEGORIES, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" }].map((item) => (
              <li key={item.href} className="border-b border-[#E5E2DC]">
                <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined} className={cn("block py-3 text-base text-[#161513]/90", pathname === item.href ? "font-semibold text-[#161513]" : "font-medium", FOCUS)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact" data-lead="quote" className="zq-btn zq-btn-sun mt-4 w-full">
            Get a quote
          </Link>
        </nav>
      )}
    </header>
  );
}
