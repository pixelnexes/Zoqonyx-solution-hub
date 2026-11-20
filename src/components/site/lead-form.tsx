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
  "w-full rounded-xl border border-[#E7E1F6] bg-[#FAF8FF] px-3.5 py-2.5 text-[15px] text-[#1B1340] placeholder:text-[#7B7699] transition-colors hover:border-[#CFC7E8] focus:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#7C3AED]";

export function LeadForm({ services, defaultService = "" }: { services: ServiceOption[]; defaultService?: string }) {
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
      const res = await fetch("/api/leads", {
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
      <div role="status" className="p-6 rounded-2xl bg-[#F1EBFF] border border-[#DDD0FA]">
        <h3 className="text-xl font-bold text-[#1B1340]">Thank you, we have your message.</h3>
        <p className="mt-2 text-[15px] text-[#5C5878]">We will read it and reply to the email address you gave us.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="lf-name" className="block text-sm font-semibold mb-1">
            Name
          </label>
          <input id="lf-name" name="name" required autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor="lf-email" className="block text-sm font-semibold mb-1">
            Email
          </label>
          <input id="lf-email" name="email" type="email" required autoComplete="email" className={field} />
        </div>
        <div>
          <label htmlFor="lf-phone" className="block text-sm font-semibold mb-1">
            Phone or WhatsApp
          </label>
          <input id="lf-phone" name="phone" type="tel" required minLength={7} inputMode="tel" placeholder="+1 555 123 4567 (with country code)" autoComplete="tel" className={field} />
        </div>
        <div>
          <label htmlFor="lf-company" className="block text-sm font-semibold mb-1">
            Company <span className="font-normal text-[#5C5878]">(optional)</span>
          </label>
          <input id="lf-company" name="company" autoComplete="organization" className={field} />
        </div>
        <div>
          <label htmlFor="lf-service" className="block text-sm font-semibold mb-1">
            What do you need?
          </label>
          <select id="lf-service" name="service" defaultValue={defaultService} className={field}>
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
          <label htmlFor="lf-budget" className="block text-sm font-semibold mb-1">
            Budget <span className="font-normal text-[#5C5878]">(optional)</span>
          </label>
          <select id="lf-budget" name="budget" defaultValue="" className={field}>
            <option value="">Choose a range</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="lf-message" className="block text-sm font-semibold mb-1">
          Tell us about your project
        </label>
        <textarea id="lf-message" name="message" required rows={5} minLength={10} className={field} />
      </div>
      {/* Honeypot: hidden from people, visible to simple bots. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
        <label htmlFor="lf-website">Leave this field empty</label>
        <input id="lf-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={status === "sending"} className="zq-btn zq-btn-indigo h-12 px-7 text-[15px]">
          {status === "sending" ? "Sending…" : "Send message"}
        </Button>
        <p className="text-sm text-[#5C5878]">Or email us at hello@zoqonyx.com</p>
      </div>
      {status === "error" && (
        <p role="alert" className="text-sm text-rose-700">
          {error}
        </p>
      )}
    </form>
  );
}
