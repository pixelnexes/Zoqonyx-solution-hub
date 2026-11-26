import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Invites visitors to ask for a tool that is missing. Opens the contact form with the subject filled in. */
export function RequestTool() {
  return (
    <div className="zq-card flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
      <div>
        <h2 className="zq-display text-xl font-semibold text-[#161513]">Missing a tool?</h2>
        <p className="mt-1 max-w-xl text-[15px] leading-relaxed text-[#5E5B55]">
          Tell us which tool you need. We keep adding to Zoqonyx based on what people ask for.
        </p>
      </div>
      <Link href="/contact?subject=Tool%20request" className="zq-btn zq-btn-indigo shrink-0">
        Request a tool <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
