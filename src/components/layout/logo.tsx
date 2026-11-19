"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/components/providers/site-settings-provider";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
  /** Use light lettering on a dark background. */
  onDark?: boolean;
}

export function Logo({ className, iconOnly = false, size = "md", onDark = false }: LogoProps) {
  const { settings } = useSiteSettings();

  const dimensions = {
    sm: { iconW: 26, iconH: 26, logoW: 110, logoH: 28, textMain: "text-base", textSub: "text-[8.5px]" },
    md: { iconW: 32, iconH: 32, logoW: 140, logoH: 34, textMain: "text-lg sm:text-xl", textSub: "text-[9.5px]" },
    lg: { iconW: 42, iconH: 42, logoW: 180, logoH: 44, textMain: "text-2xl", textSub: "text-xs" },
  }[size];

  const iconSrc = settings.icon_path || "/logo/zoqonyx-icon.png";
  const lightLogoSrc = settings.light_logo_path || settings.logo_path || "/logo/zoqonyx-logo.png";

  const siteName = settings.site_name || "ZOQONYX Solution Hub";
  const tagline = settings.site_tagline || "Solution Hub";

  // If user chose full image logo and not iconOnly:
  if (!iconOnly && settings.logo_type === "image" && lightLogoSrc) {
    return (
      <Link
        href="/"
        className={cn(
          "inline-flex items-center transition-transform hover:scale-[1.01] group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-600 rounded-md",
          className
        )}
        aria-label={siteName}
      >
        <Image
          src={lightLogoSrc}
          alt={siteName}
          width={dimensions.logoW}
          height={dimensions.logoH}
          className="object-contain h-8 w-auto max-w-[190px]"
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
        "inline-flex items-center gap-2.5 group rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E9F6E]",
        className
      )}
      aria-label={siteName}
    >
      {/* Brand Icon */}
      <div className="relative flex items-center justify-center shrink-0">
        <Image
          src={iconSrc}
          alt="Zoqonyx Icon"
          width={dimensions.iconW}
          height={dimensions.iconH}
          className="object-contain"
          priority
          unoptimized
        />
      </div>

      {/* Brand Typography (Crisp Deep Charcoal + Electric Teal) */}
      {!iconOnly && (
        <div className="flex flex-col select-none">
          <div className="flex items-center leading-none tracking-tight">
            {siteName.toUpperCase().includes("ZOQONYX") ? (
              <>
                <span className={cn("font-heading font-bold tracking-[0.04em] text-[#0B1F3A]", onDark && "text-white", dimensions.textMain)}>
                  ZOQONY
                </span>
                <span className={cn("font-heading font-bold tracking-[0.04em] text-[#0E9F6E]", onDark && "text-[#4ADE9F]", dimensions.textMain)}>
                  X
                </span>
              </>
            ) : (
              <span className={cn("font-heading font-bold tracking-[0.04em] text-[#0B1F3A]", onDark && "text-white", dimensions.textMain)}>
                {siteName}
              </span>
            )}
          </div>
          {/* Tagline kept for screen readers only; the visible uppercase tagline read as template chrome. */}
          <span className="sr-only">{tagline}</span>
        </div>
      )}
    </Link>
  );
}
