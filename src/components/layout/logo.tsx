"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useSiteSettings } from "@/components/providers/site-settings-provider";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, iconOnly = false, size = "md" }: LogoProps) {
  const { settings } = useSiteSettings();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const dimensions = {
    sm: { iconW: 28, iconH: 28, logoW: 120, logoH: 32, textMain: "text-lg", textSub: "text-[9px]" },
    md: { iconW: 36, iconH: 36, logoW: 150, logoH: 40, textMain: "text-xl", textSub: "text-[10px]" },
    lg: { iconW: 48, iconH: 48, logoW: 190, logoH: 48, textMain: "text-2xl", textSub: "text-xs" },
  }[size];

  // In SSR / pre-mount, default to dark mode style to match primary palette
  const isDark = mounted ? resolvedTheme === "dark" : true;

  const iconSrc = settings.icon_path || "/logo/zoqonyx-icon.png";
  const lightLogoSrc = settings.light_logo_path || settings.logo_path || "/logo/zoqonyx-logo.png";
  const darkLogoSrc = settings.dark_logo_path || settings.logo_path || "/logo/zoqonyx-logo.png";
  const activeLogoSrc = isDark ? darkLogoSrc : lightLogoSrc;

  // Split site name for stylish gradient treatment on the last character if "ZOQONYX"
  const siteName = settings.site_name || "ZOQONYX Solution Hub";
  const tagline = settings.site_tagline || "Solution Hub";

  // If user chose full image logo and not iconOnly:
  if (!iconOnly && settings.logo_type === "image" && (settings.light_logo_path || settings.dark_logo_path)) {
    return (
      <Link
        href="/"
        className={cn(
          "inline-flex items-center transition-transform hover:scale-[1.02] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded-lg",
          className
        )}
        aria-label={siteName}
      >
        <Image
          src={activeLogoSrc}
          alt={siteName}
          width={dimensions.logoW}
          height={dimensions.logoH}
          className="object-contain h-8 sm:h-9 w-auto max-w-[200px]"
          priority
          unoptimized
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 transition-transform hover:scale-[1.02] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded-lg",
        className
      )}
      aria-label={siteName}
    >
      {/* Brand Icon */}
      <div className="relative flex items-center justify-center shrink-0 drop-shadow-sm">
        <Image
          src={iconSrc}
          alt="Site Icon"
          width={dimensions.iconW}
          height={dimensions.iconH}
          className="object-contain"
          priority
          unoptimized
        />
      </div>

      {/* Brand Typography */}
      {!iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-center leading-none tracking-tight">
            {siteName.toUpperCase().includes("ZOQONYX") ? (
              <>
                <span className={cn("font-heading font-black tracking-wider text-slate-900 dark:text-white", dimensions.textMain)}>
                  ZOQONY
                </span>
                <span className={cn("font-heading font-black tracking-wider brand-gradient-text", dimensions.textMain)}>
                  X
                </span>
              </>
            ) : (
              <span className={cn("font-heading font-black tracking-wider text-foreground", dimensions.textMain)}>
                {siteName}
              </span>
            )}
          </div>
          <span className={cn("uppercase font-bold tracking-[0.25em] text-brand-gray dark:text-slate-400 mt-0.5", dimensions.textSub)}>
            {tagline}
          </span>
        </div>
      )}
    </Link>
  );
}
