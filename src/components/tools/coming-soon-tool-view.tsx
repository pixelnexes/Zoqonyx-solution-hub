"use client";

import * as React from "react";
import { Bell, CheckCircle2, AlertCircle, Clock, Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="space-y-8">
      {/* Coming Soon Header Card */}
      <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-6 sm:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="relative max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-amber-200 bg-amber-50 text-amber-800 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
            <span>ENGINEERING ROADMAP: ACTIVE DEVELOPMENT</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="p-2.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
              <ToolIcon name={tool.icon} className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 tracking-tight">
              {tool.name}
            </h1>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            {tool.description}
          </p>

          {/* Progress Animation Bar */}
          <div className="space-y-1.5 max-w-md mx-auto pt-2">
            <div className="flex justify-between text-xs font-medium text-slate-600 font-mono">
              <span className="flex items-center gap-1.5 text-teal-700">
                <Rocket className="w-3.5 h-3.5" /> Client Engine Build
              </span>
              <span className="font-bold text-slate-900">85% Complete</span>
            </div>
            <div className="w-full h-2 rounded-md bg-slate-100 overflow-hidden relative">
              <div className="h-full rounded-md bg-teal-600 w-[85%] transition-all" />
            </div>
          </div>

          {/* Email Notify Form */}
          <div className="pt-2 max-w-md mx-auto">
            {status === "success" ? (
              <div className="p-3.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>You will be notified the instant {tool.name} goes live!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="email"
                    required
                    placeholder="Enter your email for early access..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 bg-slate-50 text-slate-900 border-slate-200 focus-visible:ring-1 focus-visible:ring-teal-600 text-sm rounded-md"
                    disabled={status === "loading"}
                  />
                  <Button
                    type="submit"
                    className="h-10 px-5 shrink-0 gap-2 font-semibold bg-teal-700 hover:bg-teal-800 text-white rounded-md transition-colors"
                    disabled={status === "loading"}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Notify Me</span>
                  </Button>
                </div>
                {status === "error" && (
                  <p className="text-xs text-rose-600 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errorMessage}</span>
                  </p>
                )}
                <p className="text-[11px] text-slate-500 font-mono">
                  🔒 Zero spam. One-time notification upon deployment.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Rich SEO Content */}
      {tool.content && (
        <div className="p-6 sm:p-8 rounded-lg bg-white border border-slate-200 space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="prose prose-slate max-w-none text-slate-600 space-y-4 leading-relaxed text-sm">
            {tool.content.split("\n\n").map((block, idx) => {
              if (block.startsWith("## ")) {
                return (
                  <h2 key={idx} className="text-xl font-heading font-bold text-slate-900 pt-3 border-b border-slate-100 pb-2">
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              if (block.startsWith("### ")) {
                return (
                  <h3 key={idx} className="text-base font-heading font-semibold text-slate-900 pt-2">
                    {block.replace("### ", "")}
                  </h3>
                );
              }
              if (block.startsWith("- ")) {
                const listItems = block.split("\n").map((item) => item.replace(/^- /, ""));
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                    {listItems.map((li, i) => (
                      <li key={i}>{li}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={idx} className="text-sm leading-relaxed text-slate-600">{block}</p>;
            })}
          </div>
        </div>
      )}

      {/* Related Active Tools Section */}
      {relatedTools.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-heading font-bold text-slate-900">
              Try These Active Free Tools Today
            </h3>
            <Link href="/tools" className="text-xs font-semibold text-teal-700 hover:underline inline-flex items-center gap-1">
              <span>View All Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {relatedTools.map((rel) => (
              <Link key={rel.slug} href={`/tools/${rel.slug}`} className="group">
                <div className="p-4 rounded-lg bg-white border border-slate-200 hover:border-teal-500 hover:shadow-[0_4px_16px_rgba(13,148,136,0.1)] transition-all space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                      <ToolIcon name={rel.icon} className="w-4 h-4" />
                    </div>
                    <span className="font-heading font-semibold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">
                      {rel.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">
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
