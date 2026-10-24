"use client";

import * as React from "react";
import { Search, Plus, Edit, Trash2, Check, X, Sparkles, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ToolIcon } from "@/components/common/tool-icon";
import Link from "next/link";

export interface ToolItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  isComingSoon: boolean;
  icon: string | null;
  order: number;
  metaTitle: string | null;
  metaDesc: string | null;
  content: string | null;
  usageCount: number;
}

interface ToolsManagerClientProps {
  initialTools: ToolItem[];
}

export function ToolsManagerClient({ initialTools }: ToolsManagerClientProps) {
  const [tools, setTools] = React.useState<ToolItem[]>(initialTools);
  const [search, setSearch] = React.useState("");
  const [filterCat, setFilterCat] = React.useState("All");
  const [editingTool, setEditingTool] = React.useState<ToolItem | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  // New tool form state
  const [formName, setFormName] = React.useState("");
  const [formSlug, setFormSlug] = React.useState("");
  const [formDesc, setFormDesc] = React.useState("");
  const [formCat, setFormCat] = React.useState("Developer & SEO");
  const [formIcon, setFormIcon] = React.useState("Wrench");
  const [formActive, setFormActive] = React.useState(true);
  const [formComingSoon, setFormComingSoon] = React.useState(false);
  const [formOrder, setFormOrder] = React.useState(0);
  const [formMetaTitle, setFormMetaTitle] = React.useState("");
  const [formMetaDesc, setFormMetaDesc] = React.useState("");
  const [formContent, setFormContent] = React.useState("");

  const categories = React.useMemo(() => {
    const s = new Set<string>();
    tools.forEach((t) => s.add(t.category));
    return ["All", ...Array.from(s)];
  }, [tools]);

  const filtered = tools.filter((t) => {
    const matchesCat = filterCat === "All" || t.category === filterCat;
    const q = search.toLowerCase();
    const matchesSearch =
      q === "" ||
      t.name.toLowerCase().includes(q) ||
      t.slug.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const toggleStatus = async (id: string, field: "isActive" | "isComingSoon", currentVal: boolean) => {
    const newVal = !currentVal;
    // Optimistic update
    setTools((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: newVal } : t))
    );

    try {
      await fetch(`/api/admin/tools/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: newVal }),
      });
    } catch (e) {
      console.error(e);
      // Revert on fail
      setTools((prev) =>
        prev.map((t) => (t.id === id ? { ...t, [field]: currentVal } : t))
      );
    }
  };

  const handleEditClick = (t: ToolItem) => {
    setEditingTool(t);
    setIsCreating(false);
    setFormName(t.name);
    setFormSlug(t.slug);
    setFormDesc(t.description);
    setFormCat(t.category);
    setFormIcon(t.icon || "Wrench");
    setFormActive(t.isActive);
    setFormComingSoon(t.isComingSoon);
    setFormOrder(t.order);
    setFormMetaTitle(t.metaTitle || "");
    setFormMetaDesc(t.metaDesc || "");
    setFormContent(t.content || "");
  };

  const handleCreateClick = () => {
    setEditingTool(null);
    setIsCreating(true);
    setFormName("");
    setFormSlug("");
    setFormDesc("");
    setFormCat("Image Tools");
    setFormIcon("Wrench");
    setFormActive(true);
    setFormComingSoon(false);
    setFormOrder(0);
    setFormMetaTitle("");
    setFormMetaDesc("");
    setFormContent("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (isCreating) {
        const res = await fetch("/api/admin/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName,
            slug: formSlug,
            description: formDesc,
            category: formCat,
            icon: formIcon,
            isActive: formActive,
            isComingSoon: formComingSoon,
            order: formOrder,
            metaTitle: formMetaTitle,
            metaDesc: formMetaDesc,
            content: formContent,
          }),
        });
        const created = await res.json();
        if (res.ok) {
          setTools((prev) => [created, ...prev]);
          setIsCreating(false);
        }
      } else if (editingTool) {
        const res = await fetch(`/api/admin/tools/${editingTool.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName,
            slug: formSlug,
            description: formDesc,
            category: formCat,
            icon: formIcon,
            isActive: formActive,
            isComingSoon: formComingSoon,
            order: formOrder,
            metaTitle: formMetaTitle,
            metaDesc: formMetaDesc,
            content: formContent,
          }),
        });
        const updated = await res.json();
        if (res.ok) {
          setTools((prev) =>
            prev.map((t) => (t.id === editingTool.id ? updated : t))
          );
          setEditingTool(null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tool permanently?")) return;

    try {
      await fetch(`/api/admin/tools/${id}`, { method: "DELETE" });
      setTools((prev) => prev.filter((t) => t.id !== id));
      if (editingTool?.id === id) setEditingTool(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tools by name, slug, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="h-10 px-3 rounded-lg border border-border bg-card text-xs font-semibold"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <Button onClick={handleCreateClick} variant="gradient" size="sm" className="gap-1.5 shrink-0">
            <Plus className="w-4 h-4" />
            <span>Add Tool</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: List + Edit Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Table of tools */}
        <div className={editingTool || isCreating ? "lg:col-span-2" : "lg:col-span-3"}>
          <div className="rounded-2xl border border-border/80 bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-muted-foreground border-b border-border/60 bg-muted/20">
                  <tr>
                    <th className="p-3.5 font-semibold">Tool</th>
                    <th className="p-3.5 font-semibold">Category</th>
                    <th className="p-3.5 font-semibold text-center">Active</th>
                    <th className="p-3.5 font-semibold text-center">Coming Soon</th>
                    <th className="p-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filtered.map((tool) => (
                    <tr key={tool.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted/60 shrink-0">
                            <ToolIcon name={tool.icon} className="w-4 h-4 text-brand-cyan" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm leading-tight">{tool.name}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">/{tool.slug}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 text-xs text-muted-foreground">{tool.category}</td>

                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => toggleStatus(tool.id, "isActive", tool.isActive)}
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-colors ${
                            tool.isActive
                              ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                          title="Toggle Active Status"
                        >
                          {tool.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </button>
                      </td>

                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => toggleStatus(tool.id, "isComingSoon", tool.isComingSoon)}
                          className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                            tool.isComingSoon
                              ? "bg-brand-purple/10 text-brand-purple border border-brand-purple/30"
                              : "bg-muted/60 text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {tool.isComingSoon ? "Yes" : "Live"}
                        </button>
                      </td>

                      <td className="p-3.5 text-right space-x-1">
                        <Link
                          href={`/tools/${tool.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg hover:bg-muted inline-flex items-center text-muted-foreground hover:text-foreground"
                          title="View on site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleEditClick(tool)}
                          className="p-1.5 rounded-lg hover:bg-muted inline-flex items-center text-brand-cyan"
                          title="Edit Tool"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(tool.id)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 inline-flex items-center text-destructive"
                          title="Delete Tool"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Edit / Create Form Panel */}
        {(editingTool || isCreating) && (
          <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-4 shadow-lg sticky top-20">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <h3 className="font-heading font-bold text-base text-foreground">
                {isCreating ? "Add New Tool" : `Edit: ${editingTool?.name}`}
              </h3>
              <button
                onClick={() => {
                  setEditingTool(null);
                  setIsCreating(false);
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Tool Name</label>
                <Input
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Slug (URL path)</label>
                <Input
                  required
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Category</label>
                  <Input
                    required
                    value={formCat}
                    onChange={(e) => setFormCat(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Lucide Icon</label>
                  <Input
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Short Description</label>
                <Textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="text-xs font-sans min-h-[50px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={formActive}
                    onChange={(e) => setFormActive(e.target.checked)}
                    className="rounded accent-cyan-500"
                  />
                  <span>Is Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={formComingSoon}
                    onChange={(e) => setFormComingSoon(e.target.checked)}
                    className="rounded accent-purple-500"
                  />
                  <span>Is Coming Soon</span>
                </label>
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Display Order</label>
                <Input
                  type="number"
                  value={formOrder}
                  onChange={(e) => setFormOrder(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">SEO Meta Title</label>
                <Input
                  value={formMetaTitle}
                  onChange={(e) => setFormMetaTitle(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">SEO Meta Description</label>
                <Textarea
                  rows={2}
                  value={formMetaDesc}
                  onChange={(e) => setFormMetaDesc(e.target.value)}
                  className="text-xs font-sans min-h-[50px]"
                />
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Long SEO Content (Markdown)</label>
                <Textarea
                  rows={6}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <Button type="submit" variant="gradient" size="sm" className="w-full" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingTool(null);
                    setIsCreating(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
