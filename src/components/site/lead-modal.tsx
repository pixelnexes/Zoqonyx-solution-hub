"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { LeadForm, type LeadVariant, type ServiceOption } from "@/components/site/lead-form";

const COPY: Record<LeadVariant, { title: string; intro: string }> = {
  quote: { title: "Get a quote", intro: "Tell us about your project. We reply by email with questions and next steps." },
  contact: { title: "Contact us", intro: "Send a question, feedback or a bug report. We reply by email." },
  tool: { title: "Request a free tool", intro: "Describe the tool you need. We build the useful ones and add them to Zoqonyx." },
};

type Open = { variant: LeadVariant; service: string; subject: string; id: number };

/** Which popup a link should open, or null to let the link work normally. */
function intentOf(a: HTMLAnchorElement, pathname: string): { variant: LeadVariant; subject: string } | null {
  const explicit = a.dataset.lead as LeadVariant | undefined;
  if (explicit) return { variant: explicit, subject: "" };
  if (a.origin !== window.location.origin) return null;
  if (a.hash === "#contact") return { variant: "quote", subject: "" };
  if (a.pathname === "/contact" && pathname !== "/contact") {
    const subject = new URLSearchParams(a.search).get("subject") || "";
    return { variant: /tool request/i.test(subject) ? "tool" : "contact", subject };
  }
  if (a.pathname === "/request-tool" && pathname !== "/request-tool") return { variant: "tool", subject: "" };
  return null;
}

/**
 * Opens the matching form in a popup when a quote, contact or tool-request link is clicked.
 * The links keep their real addresses, so they still work without scripts, in new tabs and for crawlers.
 */
export function LeadModal({ services }: { services: ServiceOption[] }) {
  const pathname = usePathname();
  const ref = React.useRef<HTMLDialogElement>(null);
  const [open, setOpen] = React.useState<Open | null>(null);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank" || ref.current?.contains(a)) return;
      const intent = intentOf(a, window.location.pathname);
      if (!intent) return;
      e.preventDefault();
      const slug = window.location.pathname.match(/^\/services\/([^/]+)/)?.[1];
      const service = a.dataset.service || services.find((s) => s.slug === slug)?.name || "";
      setOpen({ ...intent, service, id: Date.now() });
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [services]);

  React.useEffect(() => {
    if (open && !ref.current?.open) ref.current?.showModal();
  }, [open]);

  React.useEffect(() => {
    ref.current?.close();
  }, [pathname]);

  const copy = open ? COPY[open.variant] : null;

  return (
    <dialog
      ref={ref}
      aria-labelledby="lead-modal-title"
      onClose={() => setOpen(null)}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      className="zq-dialog"
    >
      {open && copy && (
        <div className="p-5 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="lead-modal-title" className="zq-display text-2xl font-semibold text-[#161513]">
                {copy.title}
              </h2>
              <p className="mt-1 text-[15px] leading-relaxed text-[#5E5B55]">{copy.intro}</p>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close"
              className="-mr-2 -mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg hover:bg-[#F5F4F2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D63A14]"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-5">
            <LeadForm
              key={open.id}
              services={services}
              variant={open.variant}
              defaultService={open.service}
              defaultSubject={open.subject}
              idPrefix="pop"
            />
          </div>
        </div>
      )}
    </dialog>
  );
}
