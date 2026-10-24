"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo size="md" />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/tools"
            className={cn(
              "transition-colors hover:text-brand-cyan",
              pathname === "/tools" ? "text-brand-cyan font-semibold" : "text-muted-foreground"
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
                "inline-flex items-center gap-1 transition-colors hover:text-brand-cyan py-2",
                pathname.startsWith("/category")
                  ? "text-brand-cyan font-semibold"
                  : "text-muted-foreground"
              )}
            >
              <span>Categories</span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  categoriesOpen && "rotate-180 text-brand-cyan"
                )}
              />
            </button>

            {categoriesOpen && (
              <div className="absolute top-full left-0 w-64 pt-2 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="rounded-2xl border border-border/80 bg-card/95 backdrop-blur-xl p-2 shadow-xl space-y-1">
                  {NAV_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      onClick={() => setCategoriesOpen(false)}
                      className={cn(
                        "block px-3 py-2 rounded-xl text-xs font-semibold transition-colors hover:bg-muted/70 hover:text-brand-cyan",
                        pathname === cat.href ? "bg-muted text-brand-cyan" : "text-foreground"
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
              "transition-colors hover:text-brand-cyan",
              pathname === "/about" ? "text-brand-cyan font-semibold" : "text-muted-foreground"
            )}
          >
            About
          </Link>

          <Link
            href="/contact"
            className={cn(
              "transition-colors hover:text-brand-cyan",
              pathname === "/contact" ? "text-brand-cyan font-semibold" : "text-muted-foreground"
            )}
          >
            Contact
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          <Link href="/tools">
            <Button variant="gradient" size="sm" className="gap-1.5 shadow-sm">
              <Zap className="w-3.5 h-3.5" />
              <span>Explore Tools</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
                <span>Explore 35+ Free Tools</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
