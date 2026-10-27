"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SessionHistoryModal } from "@/components/common/session-history-modal";

const NAV_CATEGORIES = [
  { label: "Image & Photo Tools", href: "/category/image-tools", icon: "FileArchive" },
  { label: "CSS & Design Generators", href: "/category/css-design", icon: "Layers" },
  { label: "Text & Code Utilities", href: "/category/text-code", icon: "Code2" },
  { label: "Developer & SEO Tools", href: "/category/developer-seo", icon: "Globe" },
  { label: "Calculators & Math", href: "/category/calculators", icon: "Calculator" },
  { label: "PDF & Documents", href: "/category/pdf-documents", icon: "FileEdit" },
  { label: "AI & Smart Tools", href: "/category/ai-tools", icon: "Cpu" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [categoriesOpen, setCategoriesOpen] = React.useState(false);
  const pathname = usePathname();

  // Don't show public header on /admin paths
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="container mx-auto flex h-14 sm:h-15 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo size="md" />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-5 text-xs lg:text-sm font-medium">
          <Link
            href="/tools"
            className={cn(
              "transition-colors hover:text-teal-600 font-medium py-1 px-2 rounded-md hover:bg-slate-50",
              pathname === "/tools" ? "text-teal-600 font-semibold" : "text-slate-600"
            )}
          >
            All Tools
          </Link>

          {/* Categories Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className={cn(
                "inline-flex items-center gap-1 transition-colors hover:text-teal-600 py-1 px-2 rounded-md hover:bg-slate-50",
                pathname.startsWith("/category")
                  ? "text-teal-600 font-semibold"
                  : "text-slate-600"
              )}
            >
              <span>Categories</span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  categoriesOpen && "rotate-180 text-teal-600"
                )}
              />
            </button>

            {categoriesOpen && (
              <div className="absolute top-full left-0 w-64 pt-2 animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                <div className="rounded-[10px] border border-slate-200/90 bg-white p-2 shadow-[0_12px_28px_-6px_rgba(15,23,42,0.12),0_4px_10px_-2px_rgba(15,23,42,0.05)] space-y-0.5">
                  {NAV_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      onClick={() => setCategoriesOpen(false)}
                      className={cn(
                        "block px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors hover:bg-slate-100/80 hover:text-teal-700",
                        pathname === cat.href ? "bg-teal-50 text-teal-800 font-bold" : "text-slate-700"
                      )}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/about"
            className={cn(
              "transition-colors hover:text-teal-600 font-semibold py-1 px-2.5 rounded-md hover:bg-slate-100/60",
              pathname === "/about" ? "text-teal-700 font-bold" : "text-slate-600"
            )}
          >
            About
          </Link>

          <Link
            href="/contact"
            className={cn(
              "transition-colors hover:text-teal-600 font-semibold py-1 px-2.5 rounded-md hover:bg-slate-100/60",
              pathname === "/contact" ? "text-teal-700 font-bold" : "text-slate-600"
            )}
          >
            Contact
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <SessionHistoryModal />

          <Link href="/tools">
            <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white rounded-[7px] text-xs font-semibold px-3.5 h-8 gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-sm transition-all">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>All 113 Tools</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <SessionHistoryModal />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="w-8 h-8 rounded-md hover:bg-slate-100 text-slate-800"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border/80 bg-background/95 backdrop-blur-lg px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/tools"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              All Tools
            </Link>

            <div className="py-1 px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Categories
            </div>
            {NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-brand-cyan transition-colors"
              >
                {cat.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-border/40 space-y-1">
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Contact
              </Link>
            </div>
          </nav>

          <div className="pt-2">
            <Link href="/tools" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="gradient" className="w-full gap-2">
                <Zap className="w-4 h-4" />
                <span>Explore 100+ Free Tools</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
