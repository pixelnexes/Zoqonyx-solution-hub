"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export interface ServiceOption {
  slug: string;
  name: string;
}

const BUDGETS = ["Not sure yet", "Under $2,000", "$2,000 – $10,000", "$10,000 – $50,000", "$50,000+"];

const field =
  "w-full rounded-xl border border-[#E5E2DC] bg-[#F7F6F4] px-3.5 py-2.5 text-[15px] text-[#161513] placeholder:text-[#6F6B64] transition-colors hover:border-[#CFCBC3] focus:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#D63A14]";

export type LeadVariant = "quote" | "contact" | "tool";

export function LeadForm({
  services,
  defaultService = "",
  defaultSubject = "",
  variant = "quote",
  idPrefix = "lf",
}: {
  services: ServiceOption[];
  defaultService?: string;
  defaultSubject?: string;
  /** quote: project enquiry. contact: general message. tool: free tool request. */
  variant?: LeadVariant;
  /** Keeps field ids unique when the popup form sits on a page that already has a form. */
  idPrefix?: string;
}) {
  const id = (name: string) => `${idPrefix}-${name}`;
  const pathname = usePathname();
  const [status, setStatus] = React.useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = React.useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const problems: string[] = [];
    if (!String(data.name || "").trim()) problems.push("your name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(data.email || "").trim())) problems.push("a valid email");
    if (String(data.phone || "").replace(/\D/g, "").length < 7) problems.push("a phone or WhatsApp number");
    if (String(data.message || "").trim().length < 10) problems.push("a message of at least 10 characters");
    if (problems.length) {
      setError("Please add " + problems.join(", ") + ".");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch(variant === "contact" ? "/api/contact" : "/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, sourcePage: pathname }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
      setStatus("done");
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="p-6 rounded-2xl bg-[#F5F4F2] border border-[#E5E2DC]">
        <h3 className="text-xl font-semibold text-[#161513]">Thank you, we have your message.</h3>
        <p className="mt-2 text-[15px] text-[#5E5B55]">We will read it and reply to the email address you gave us.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={id("name")} className="block text-sm font-semibold mb-1">
            Name
          </label>
          <input id={id("name")} name="name" required autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor={id("email")} className="block text-sm font-semibold mb-1">
            Email
          </label>
          <input id={id("email")} name="email" type="email" required autoComplete="email" className={field} />
        </div>
        <div>
          <label htmlFor={id("phone")} className="block text-sm font-semibold mb-1">
            Phone or WhatsApp
          </label>
          <input id={id("phone")} name="phone" type="tel" required minLength={7} inputMode="tel" placeholder="+1 555 123 4567 (with country code)" autoComplete="tel" className={field} />
        </div>
        {variant === "contact" && (
          <div>
            <label htmlFor={id("subject")} className="block text-sm font-semibold mb-1">
              Subject <span className="font-normal text-[#5E5B55]">(optional)</span>
            </label>
            <input id={id("subject")} name="subject" defaultValue={defaultSubject} className={field} />
          </div>
        )}
        {variant === "quote" && (
          <>
        <div>
          <label htmlFor={id("company")} className="block text-sm font-semibold mb-1">
            Company <span className="font-normal text-[#5E5B55]">(optional)</span>
          </label>
          <input id={id("company")} name="company" autoComplete="organization" className={field} />
        </div>
        <div>
          <label htmlFor={id("service")} className="block text-sm font-semibold mb-1">
            What do you need?
          </label>
          <select id={id("service")} name="service" defaultValue={defaultService} className={field}>
            <option value="">Choose a service</option>
            {services.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
            <option value="Something else">Something else</option>
          </select>
        </div>
        <div>
          <label htmlFor={id("budget")} className="block text-sm font-semibold mb-1">
            Budget <span className="font-normal text-[#5E5B55]">(optional)</span>
          </label>
          <select id={id("budget")} name="budget" defaultValue="" className={field}>
            <option value="">Choose a range</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
          </>
        )}
      </div>
      <div>
        <label htmlFor={id("message")} className="block text-sm font-semibold mb-1">
          {variant === "tool" ? "Which tool do you need, and what should it do?" : variant === "contact" ? "Message" : "Tell us about your project"}
        </label>
        <textarea id={id("message")} name="message" required rows={5} minLength={10} className={field} />
      </div>
      {variant === "tool" && <input type="hidden" name="service" value="Free custom tool request" />}
      {/* Honeypot: hidden from people, visible to simple bots. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
        <label htmlFor={id("website")}>Leave this field empty</label>
        <input id={id("website")} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={status === "sending"} className="zq-btn zq-btn-indigo h-12 px-7 text-[15px]">
          {status === "sending" ? "Sending…" : variant === "tool" ? "Send tool request" : variant === "quote" ? "Request quote" : "Send message"}
        </Button>
        <p className="text-sm text-[#5E5B55]">Or email us at hello@zoqonyx.com</p>
      </div>
      {status === "error" && (
        <p role="alert" className="text-sm text-rose-700">
          {error}
        </p>
      )}
    </form>
  );
}
