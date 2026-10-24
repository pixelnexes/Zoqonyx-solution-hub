import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, iconOnly = false, size = "md" }: LogoProps) {
  const iconDimensions = {
    sm: { w: 28, h: 28 },
    md: { w: 36, h: 36 },
    lg: { w: 48, h: 48 },
  }[size];

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 transition-transform hover:scale-[1.02] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded-lg",
        className
      )}
      aria-label="Zoqonyx Solution Hub Home"
    >
      <div className="relative flex items-center justify-center shrink-0 drop-shadow-sm">
        <Image
          src="/logo/zoqonyx-icon.png"
          alt="Zoqonyx Icon"
          width={iconDimensions.w}
          height={iconDimensions.h}
          className="object-contain"
          priority
        />
      </div>

      {!iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-center leading-none tracking-tight">
            <span className="font-heading font-black text-xl tracking-wider text-slate-900 dark:text-white">
              ZOQONY
            </span>
            <span className="font-heading font-black text-xl tracking-wider brand-gradient-text">
              X
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-brand-gray dark:text-slate-400 mt-0.5">
            Solution Hub
          </span>
        </div>
      )}
    </Link>
  );
}
