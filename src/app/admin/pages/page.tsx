"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, FileText, ArrowRight } from "lucide-react";

interface PageData {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaTitle: string | null;
  metaDesc: string | null;
}

export default function PagesManagerPage() {
  const [pages, setPages] = React.useState<PageData[]>([]);
  const [selectedSlug, setSelectedSlug] = React.useState<string>("about");
  const [title, setTitle] = React.useState("");
  const [metaTitle, setMetaTitle] = React.useState("");
  const [metaDesc, setMetaDesc] = React.useState("");
  const [content, setContent] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  React.useEffect(() => {
    async function loadPages() {
      try {
        const res = await fetch("/api/admin/pages");
        if (res.ok) {
          const data: PageData[] = await res.json();
          setPages(data);
          const current = data.find((p) => p.slug === selectedSlug) || data[0];
          if (current) {
            setSelectedSlug(current.slug);
            setTitle(current.title);
            setMetaTitle(current.metaTitle || "");
            setMetaDesc(current.metaDesc || "");
            setContent(current.content);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadPages();
  }, [selectedSlug]);

  const handleSelectPage = (slug: string) => {
    setSelectedSlug(slug);
    const p = pages.find((item) => item.slug === slug);
    if (p) {
      setTitle(p.title);
      setMetaTitle(p.metaTitle || "");
      setMetaDesc(p.metaDesc || "");
      setContent(p.content);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: selectedSlug,
          title,
          metaTitle,
          metaDesc,
          content,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setPages((prev) =>
          prev.map((item) => (item.slug === selectedSlug ? updated : item))
        );
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-black text-foreground">
          Pages & Content Manager
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Edit markdown body copy, SEO titles, and meta descriptions for static and institutional pages.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Page saved successfully! Changes reflect on public site immediately.</span>
        </div>
      )}

      {/* Page Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {pages.map((p) => (
          <button
            key={p.slug}
            onClick={() => handleSelectPage(p.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all border ${
              selectedSlug === p.slug
                ? "brand-gradient-bg text-white border-transparent shadow-sm"
                : "bg-card border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {p.slug.replace("-", " ")}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-card border border-border/80 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Page Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">SEO Meta Title</label>
            <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">SEO Meta Description</label>
          <Textarea
            rows={2}
            value={metaDesc}
            onChange={(e) => setMetaDesc(e.target.value)}
            className="font-sans text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Page Markdown Body Content</label>
          <Textarea
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="font-mono text-xs"
          />
        </div>

        <div className="pt-2 flex justify-between items-center">
          <Button type="submit" variant="gradient" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Page Content"}
          </Button>

          <a
            href={`/${selectedSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-cyan hover:underline inline-flex items-center gap-1 font-semibold"
          >
            <span>View /{selectedSlug} live</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </form>
    </div>
  );
}
