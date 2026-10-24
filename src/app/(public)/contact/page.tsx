"use client";

import * as React from "react";
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
        <h1 className="text-3xl sm:text-4xl font-heading font-black text-foreground">
          Contact <span className="brand-gradient-text">Zoqonyx</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Have an idea for a new tool, found a bug, or want to partner? Send us a message and we’ll get back to you promptly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Card */}
        <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-6 h-fit">
          <div>
            <h3 className="font-heading font-bold text-base text-foreground mb-1">Direct Inquiries</h3>
            <p className="text-xs text-muted-foreground">Feel free to email our engineering & product team directly.</p>
          </div>

          <div className="space-y-4 text-sm">
            <a
              href="mailto:hello@zoqonyx.com"
              className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors"
            >
              <Mail className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground">General Support</p>
                <p className="text-xs text-muted-foreground">hello@zoqonyx.com</p>
              </div>
            </a>

            <a
              href="mailto:zawwar.ahmed2006@gmail.com"
              className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors"
            >
              <Mail className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground">Founder / Technical Lead</p>
                <p className="text-xs text-muted-foreground">zawwar.ahmed2006@gmail.com</p>
              </div>
            </a>
          </div>

          <div className="p-4 rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Newix Tech Solutions</p>
            <p>Official Developer & Maintainer</p>
            <a
              href="https://newixtechsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-cyan hover:underline inline-block mt-1"
            >
              newixtechsolutions.com →
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 p-6 sm:p-8 rounded-2xl bg-card border border-border/80">
          {status === "success" ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-heading font-bold text-foreground">Message Dispatched!</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Thank you for reaching out. We have logged your request and will reply via email shortly.
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === "error" && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Your Name</label>
                <Input
                  required
                  placeholder="e.g. Alex Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={status === "loading"}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Email Address</label>
                <Input
                  required
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Message or Request</label>
                <Textarea
                  required
                  rows={5}
                  placeholder="Tell us what tool you'd like added, report an issue, or ask a question..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={status === "loading"}
                />
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full gap-2 mt-2"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <span>Sending Message...</span>
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
      </div>
    </div>
  );
}
