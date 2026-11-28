"use client";

import * as React from "react";
import Link from "next/link";
import { PageHero } from "@/components/kit/page-kit";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  const honeypot = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("subject");
    if (s) setSubject(s.slice(0, 80));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) || phone.replace(/\D/g, "").length < 7 || message.trim().length < 10) {
      setErrorMessage("Please fill in your name, a valid email, a phone or WhatsApp number and a message of at least 10 characters.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message, website: honeypot.current?.value || "" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
    }
  };

  return (
    <div className="zq-page">
      <PageHero crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]} title="Contact Zoqonyx" intro="Ask about a project, send feedback, report a problem or request a tool. We reply by email." image="/photos/u-support.webp" />
      <div className="container mx-auto max-w-3xl px-4 zq-section">
      {/* Form Container */}
      <div className="relative zq-card p-6 sm:p-10 -mt-6">

        {status === "success" ? (
          <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-heading font-semibold text-foreground">Message sent</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Thank you for contacting Zoqonyx. We have your message and will reply by email.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStatus("idle")}
              className="mt-4"
            >
              Send Another Message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
              <label htmlFor="ct-website">Leave this field empty</label>
              <input ref={honeypot} id="ct-website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            {status === "error" && (
              <div className="p-3.5 rounded-xl bg-destructive/10 text-destructive text-sm flex items-center gap-2.5 border border-destructive/20 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Full Name <span className="text-[#D63A14]">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={status === "loading"}
                  className="h-11 rounded-xl bg-background/60 focus:bg-background transition-colors"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Email Address <span className="text-[#D63A14]">*</span>
                </label>
                <Input
                  required
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="h-11 rounded-xl bg-background/60 focus:bg-background transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone Number Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Phone or WhatsApp <span className="text-[#D63A14]">*</span>
                </label>
                <Input
                  required
                  type="tel"
                  placeholder="+1 555 123 4567 (with country code)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={status === "loading"}
                  className="h-11 rounded-xl bg-background/60 focus:bg-background transition-colors"
                />
              </div>

              {/* Subject Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Subject
                </label>
                <Input
                  placeholder="e.g. Tool Request / Feature Suggestion"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={status === "loading"}
                  className="h-11 rounded-xl bg-background/60 focus:bg-background transition-colors"
                />
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Message <span className="text-[#D63A14]">*</span>
              </label>
              <Textarea
                required
                rows={5}
                placeholder="Write your message here... tell us how we can help or what tool you need."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === "loading"}
                className="rounded-xl bg-background/60 focus:bg-background transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              
              className="zq-btn zq-btn-indigo w-full"
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending</span>
                </div>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </Button>
          </form>
        )}
      </div>

      <div className="mt-14 space-y-10 text-[16px] leading-relaxed text-[#2E2C28]">
        <section aria-labelledby="which-form">
          <h2 id="which-form" className="zq-display text-2xl font-semibold text-[#161513]">Which form should you use?</h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="font-semibold">A question, feedback or a bug</dt>
              <dd className="text-[#5E5B55]">Use the form above. Tell us the page or tool and what happened.</dd>
            </div>
            <div>
              <dt className="font-semibold">A project: website, app, software, AI or marketing</dt>
              <dd className="text-[#5E5B55]">
                <a href="/contact" data-lead="quote" className="font-semibold text-[#B02E0E] underline underline-offset-4">Get a quote</a> and choose the service. A budget range is optional and helps us suggest a sensible scope.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">A tool that does not exist yet</dt>
              <dd className="text-[#5E5B55]">
                <Link href="/request-tool" className="font-semibold text-[#B02E0E] underline underline-offset-4">Send a free tool request</Link> with one example of the input and the result you expect.
              </dd>
            </div>
          </dl>
        </section>
        <section aria-labelledby="include">
          <h2 id="include" className="zq-display text-2xl font-semibold text-[#161513]">What helps us answer quickly</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5">
            <li>What you want to achieve, in a few sentences</li>
            <li>Who will use it, and any system it must connect to</li>
            <li>Your timing, and a budget range if you have one</li>
            <li>Your phone or WhatsApp number with country code</li>
          </ul>
          <p className="mt-3 text-[#5E5B55]">Please do not send passwords or private customer data through the form.</p>
        </section>
        <section aria-labelledby="services-list">
          <h2 id="services-list" className="zq-display text-2xl font-semibold text-[#161513]">What we work on</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              ["Website development", "website-development"],
              ["App development", "app-development"],
              ["Game development", "game-development"],
              ["Custom software", "custom-software-development"],
              ["AI and NLP", "ai-nlp-development"],
              ["Digital marketing", "digital-marketing"],
              ["ERP and CRM", "erp-crm-development"],
              ["Staff augmentation", "staff-augmentation"],
            ].map(([label, slug]) => (
              <li key={slug}>
                <Link href={`/services/${slug}`} className="font-semibold underline underline-offset-4 hover:text-[#B02E0E]">{label}</Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
      </div>
    </div>
  );
}
