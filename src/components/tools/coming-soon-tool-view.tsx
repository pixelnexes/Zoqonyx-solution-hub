"use client";

import * as React from "react";
import { Sparkles, Bell, CheckCircle2, AlertCircle, Clock, Rocket, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ToolIcon } from "@/components/common/tool-icon";

interface ComingSoonToolViewProps {
  tool: {
    slug: string;
    name: string;
    description: string;
    category: string;
    icon: string | null;
    content: string | null;
  };
  relatedTools: Array<{
    slug: string;
    name: string;
    description: string;
    category: string;
    icon: string | null;
  }>;
}

export function ComingSoonToolView({ tool, relatedTools }: ComingSoonToolViewProps) {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, toolSlug: tool.slug }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe.");
      }

      setStatus("success");
      setEmail("");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <div className="space-y-10">
      {/* Linear-Style Coming Soon Header Card */}
      <div className="relative overflow-hidden rounded-xl border border-border/80 dark:border-white/10 bg-card dark:bg-[#0B0F19] p-6 sm:p-10 shadow-sm">
        <div className="relative max-w-2xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span>DEV_STATUS: UNDER ACTIVE ENGINEERING</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <ToolIcon name={tool.icon} className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-foreground tracking-tight">
              {tool.name}
            </h1>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {tool.description}
          </p>

          {/* Progress Animation Bar */}
          <div className="space-y-2 max-w-md mx-auto pt-2">
            <div className="flex justify-between text-xs font-medium text-muted-foreground font-mono">
              <span className="flex items-center gap-1.5 text-teal-400">
                <Rocket className="w-3.5 h-3.5" /> Client Engine Build
              </span>
              <span className="font-bold text-foreground">85% Complete</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted/60 overflow-hidden relative">
              <div className="h-full rounded-full bg-teal-500 w-[85%] transition-all" />
            </div>
          </div>

          {/* Email Notify Form */}
          <div className="pt-3 max-w-md mx-auto">
            {status === "success" ? (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center justify-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>You will be notified the instant {tool.name} goes live!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="email"
                    required
                    placeholder="Enter your email for early access..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 bg-background/80 border-border/80 focus:border-teal-500 text-sm rounded-lg"
                    disabled={status === "loading"}
                  />
                  <Button
                    type="submit"
                    className="h-10 px-5 shrink-0 gap-2 font-semibold bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg transition-colors"
                    disabled={status === "loading"}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Notify Me</span>
                  </Button>
                </div>
                {status === "error" && (
                  <p className="text-xs text-destructive flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errorMessage}</span>
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground font-mono">
                  🔒 Zero spam. One-time notification upon deployment.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 400-700 Words Rich SEO Content */}
      {tool.content && (
        <div className="p-6 sm:p-8 rounded-xl bg-card border border-border/80 space-y-6">
          <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground space-y-4 leading-relaxed">
            {tool.content.split("\n\n").map((block, idx) => {
              if (block.startsWith("## ")) {
                return (
                  <h2 key={idx} className="text-xl font-heading font-bold text-foreground pt-4 border-b border-border/60 pb-2">
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              if (block.startsWith("### ")) {
                return (
                  <h3 key={idx} className="text-base font-heading font-semibold text-foreground pt-3">
                    {block.replace("### ", "")}
                  </h3>
                );
              }
              if (block.startsWith("- ")) {
                const listItems = block.split("\n").map((item) => item.replace(/^- /, ""));
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1 text-sm">
                    {listItems.map((li, i) => (
                      <li key={i}>{li}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={idx} className="text-sm leading-relaxed">{block}</p>;
            })}
          </div>
        </div>
      )}

      {/* Related Active Tools Section */}
      {relatedTools.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-heading font-bold text-foreground">
              Try These Active Free Tools Today
            </h3>
            <Link href="/tools" className="text-xs font-semibold text-teal-400 hover:underline">
              View All Tools →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((rel) => (
              <Link key={rel.slug} href={`/tools/${rel.slug}`} className="group">
                <div className="p-4 rounded-lg bg-card border border-border/80 hover:border-teal-500/50 hover:-translate-y-0.5 transition-all space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-md bg-teal-500/10 text-teal-400">
                      <ToolIcon name={rel.icon} className="w-4 h-4" />
                    </div>
                    <span className="font-heading font-semibold text-sm text-foreground group-hover:text-teal-400 transition-colors">
                      {rel.name}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {rel.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
