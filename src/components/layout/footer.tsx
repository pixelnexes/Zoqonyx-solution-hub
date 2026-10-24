import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Heart, Mail, ExternalLink, ShieldCheck, Zap, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/70 bg-card/60 backdrop-blur-sm text-foreground/80">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering creators, developers, designers, and marketers with fast, privacy-first, 100% free digital tools.
            </p>
            <div className="flex flex-col gap-1 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-500" /> Client-side zero data retention
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Instant execution, zero waiting
              </span>
            </div>
          </div>

          {/* Quick Tool Categories */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider mb-3">
              Tool Categories
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/tools" className="font-semibold text-foreground hover:text-brand-cyan transition-colors">
                  All Tools Directory
                </Link>
              </li>
              <li>
                <Link href="/category/image-tools" className="hover:text-brand-cyan transition-colors">
                  Image & Photo Tools
                </Link>
              </li>
              <li>
                <Link href="/category/css-design" className="hover:text-brand-cyan transition-colors">
                  CSS & Design Generators
                </Link>
              </li>
              <li>
                <Link href="/category/text-code" className="hover:text-brand-cyan transition-colors">
                  Text & Code Utilities
                </Link>
              </li>
              <li>
                <Link href="/category/developer-seo" className="hover:text-brand-cyan transition-colors">
                  Developer & SEO Tools
                </Link>
              </li>
              <li>
                <Link href="/category/calculators" className="hover:text-brand-cyan transition-colors">
                  Calculators & Math
                </Link>
              </li>
              <li>
                <Link href="/category/pdf-documents" className="hover:text-brand-cyan transition-colors">
                  PDF & Documents
                </Link>
              </li>
              <li>
                <Link href="/category/ai-tools" className="hover:text-brand-cyan transition-colors">
                  AI & Smart Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Resources */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider mb-3">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-brand-cyan transition-colors">
                  About Zoqonyx
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-cyan transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-brand-cyan transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-cyan transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-brand-purple transition-colors inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider mb-3">
              Get in Touch
            </h4>
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <a
                href="mailto:hello@zoqonyx.com"
                className="flex items-center gap-2 hover:text-brand-cyan transition-colors"
              >
                <Mail className="w-4 h-4 text-brand-cyan" />
                <span>hello@zoqonyx.com</span>
              </a>
              <a
                href="mailto:zawwar.ahmed2006@gmail.com"
                className="flex items-center gap-2 hover:text-brand-cyan transition-colors text-xs"
              >
                <Mail className="w-4 h-4 text-brand-purple" />
                <span>zawwar.ahmed2006@gmail.com</span>
              </a>
              <p className="text-xs text-muted-foreground/80 pt-2 leading-relaxed">
                Have a feature request or need a custom web tool built? Drop us a line anytime!
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar with mandatory credit */}
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Zoqonyx Solution Hub. All rights reserved.</p>

          <div className="flex items-center gap-1.5 font-medium">
            <span>Developed with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>by</span>
            <a
              href="https://newixtechsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-accent dark:text-brand-cyan hover:underline inline-flex items-center gap-0.5 font-semibold"
            >
              <span>Newix Tech Solutions</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
