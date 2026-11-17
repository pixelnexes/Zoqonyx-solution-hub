"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SessionHistoryModal } from "@/components/common/session-history-modal";

// Same names and order as the homepage drawer.
const NAV_CATEGORIES = [
  { label: "Images", href: "/category/image-tools" },
  { label: "PDF", href: "/category/pdf-documents" },
  { label: "Developer & SEO", href: "/category/developer-seo" },
  { label: "Text & code", href: "/category/text-code" },
  { label: "CSS & design", href: "/category/css-design" },
  { label: "Calculators", href: "/category/calculators" },
];

const INK = "text-[#14213D]";
const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14213D]";

function NavLink({
  href,
  active,
  children,
  onClick,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "py-1 text-[15px] font-medium rounded-[2px] border-b-2 transition-colors",
        INK,
        FOCUS,
        active ? "border-[#14213D]" : "border-transparent hover:border-[#D5DCE4]"
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

  // Close menus when the route changes.
  React.useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
  }, [pathname]);

  // Don't show public header on /admin paths
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D5DCE4] bg-white">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo size="md" />

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden md:flex items-center gap-7">
          <NavLink href="/tools" active={pathname === "/tools"}>
            All tools
          </NavLink>

          <div
            className="relative"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button
              type="button"
              aria-expanded={categoriesOpen}
              aria-controls="nav-categories"
              onClick={() => setCategoriesOpen((v) => !v)}
              onKeyDown={(e) => e.key === "Escape" && setCategoriesOpen(false)}
              className={cn(
                "inline-flex items-center gap-1 py-1 text-[15px] font-medium rounded-[2px] border-b-2",
                INK,
                FOCUS,
                pathname.startsWith("/category") ? "border-[#14213D]" : "border-transparent hover:border-[#D5DCE4]"
              )}
            >
              Categories
              <ChevronDown
                aria-hidden="true"
                className={cn("w-4 h-4 transition-transform motion-reduce:transition-none", categoriesOpen && "rotate-180")}
              />
            </button>

            {categoriesOpen && (
              <div id="nav-categories" className="absolute top-full left-[-12px] pt-2 z-50">
                <ul className="w-56 border border-[#D5DCE4] bg-white rounded-[6px] py-1.5 shadow-[0_8px_24px_-8px_rgba(20,33,61,0.25)]">
                  {NAV_CATEGORIES.map((cat) => (
                    <li key={cat.href}>
                      <Link
                        href={cat.href}
                        aria-current={pathname === cat.href ? "page" : undefined}
                        className={cn(
                          "block px-3.5 py-2 text-[15px] hover:bg-[#F3F5F8]",
                          INK,
                          FOCUS,
                          pathname === cat.href && "font-semibold"
                        )}
                      >
                        {cat.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <NavLink href="/about" active={pathname === "/about"}>
            About
          </NavLink>
          <NavLink href="/contact" active={pathname === "/contact"}>
            Contact
          </NavLink>
        </nav>

        <div className="hidden md:flex items-center">
          <SessionHistoryModal />
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-1">
          <SessionHistoryModal />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className={cn("w-11 h-11 inline-flex items-center justify-center rounded-[4px] hover:bg-[#F3F5F8]", INK, FOCUS)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav id="mobile-menu" aria-label="Main" className="md:hidden border-t border-[#D5DCE4] bg-white px-4 pb-4">
          <ul>
            {[{ label: "All tools", href: "/tools" }, ...NAV_CATEGORIES, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" }].map(
              (item) => (
                <li key={item.href} className="border-b border-[#D5DCE4]">
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={cn("block py-3 text-base", INK, FOCUS, pathname === item.href ? "font-semibold" : "font-medium")}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
