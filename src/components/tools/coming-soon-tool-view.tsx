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
    <div className="space-y-12">
      {/* Animated Coming Soon Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-brand-purple/30 bg-gradient-to-br from-card via-card to-brand-purple/5 p-6 sm:p-12 shadow-xl">
        {/* Glowing Orbs */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-cyan/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-purple/40 bg-brand-purple/10 text-brand-purple dark:text-purple-300 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            <span>Currently Under Active Development</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-brand-cyan/20 to-brand-purple/20 text-brand-purple dark:text-cyan-400 shadow-inner">
              <ToolIcon name={tool.icon} className="w-8 h-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-foreground">
              {tool.name}
            </h1>
          </div>

          <p className="text-base text-muted-foreground leading-relaxed">
            {tool.description}
          </p>

          {/* Progress Animation Bar */}
          <div className="space-y-2 max-w-md mx-auto pt-2">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5 text-brand-cyan" /> Development Progress
              </span>
              <span className="font-bold text-foreground">85% Complete</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden relative">
              <div className="h-full rounded-full brand-gradient-bg w-[85%] animate-pulse" />
            </div>
          </div>

          {/* Email Notify Form */}
          <div className="pt-4 max-w-md mx-auto">
            {status === "success" ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-200 font-medium">
                <CheckCircle2 className="w-5 h-5" />
                <span>You will be notified the instant {tool.name} launches!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="email"
                    required
                    placeholder="Enter your email to get early access..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-background/90"
                    disabled={status === "loading"}
                  />
                  <Button
                    type="submit"
                    variant="gradient"
                    className="h-11 px-6 shrink-0 gap-2 font-semibold"
                    disabled={status === "loading"}
                  >
                    <Bell className="w-4 h-4" />
                    <span>Notify Me</span>
                  </Button>
                </div>
                {status === "error" && (
                  <p className="text-xs text-destructive flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errorMessage}</span>
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground">
                  🔒 Zero spam. We only notify you once when this tool is live.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 400-700 Words Rich SEO Content */}
      {tool.content && (
        <div className="p-6 sm:p-10 rounded-2xl bg-card border border-border/80 space-y-6">
          <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground space-y-4 leading-relaxed">
            {tool.content.split("\n\n").map((block, idx) => {
              if (block.startsWith("## ")) {
                return (
                  <h2 key={idx} className="text-2xl font-heading font-bold text-foreground pt-4 border-b pb-2">
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              if (block.startsWith("### ")) {
                return (
                  <h3 key={idx} className="text-lg font-heading font-semibold text-foreground pt-3">
                    {block.replace("### ", "")}
                  </h3>
                );
              }
              if (block.startsWith("- ")) {
                const listItems = block.split("\n").map((item) => item.replace(/^- /, ""));
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1">
                    {listItems.map((li, i) => (
                      <li key={i}>{li}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={idx}>{block}</p>;
            })}
          </div>
        </div>
      )}

      {/* Related Active Tools Section */}
      {relatedTools.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-heading font-bold text-foreground">
              Try These Active Free Tools Today
            </h3>
            <Link href="/#tools-catalog" className="text-xs font-semibold text-brand-cyan hover:underline">
              View All Tools →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((rel) => (
              <Link key={rel.slug} href={`/tools/${rel.slug}`} className="group">
                <div className="p-4 rounded-xl bg-card border border-border/80 hover:border-brand-cyan/60 hover:-translate-y-0.5 transition-all space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-brand-cyan/10 text-brand-cyan">
                      <ToolIcon name={rel.icon} className="w-4 h-4" />
                    </div>
                    <span className="font-heading font-semibold text-sm text-foreground group-hover:text-brand-cyan transition-colors">
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
