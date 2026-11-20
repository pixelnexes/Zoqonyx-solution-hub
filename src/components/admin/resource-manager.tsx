"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, ArrowLeft, Search } from "lucide-react";
import type { ResourceDef, FieldDef } from "@/lib/content-resources";

type Row = Record<string, unknown> & { id: string };

function toLocalInput(v: unknown): string {
  if (!v) return "";
  const d = new Date(String(v));
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function cell(v: unknown): string {
  if (v == null || v === "") return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v)) return new Date(v).toLocaleDateString();
  return String(v).slice(0, 60);
}

export function ResourceManager({ def }: { def: ResourceDef }) {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [editing, setEditing] = React.useState<Row | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState("");

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/content/${def.key}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not load.");
      setRows(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load.");
    } finally {
      setLoading(false);
    }
  }, [def.key]);

  React.useEffect(() => {
    load();
  }, [load]);

  const startNew = () => {
    const blank: Row = { id: "" };
    for (const f of def.fields) {
      blank[f.key] = f.type === "boolean" ? f.key === "isActive" : f.type === "number" ? (f.key === "rating" ? 5 : 0) : f.type === "select" ? f.options?.[0] ?? "" : "";
    }
    setEditing(blank);
    setIsNew(true);
    setNotice(null);
  };

  const setField = (key: string, value: unknown) => setEditing((e) => (e ? { ...e, [key]: value } : e));

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    setNotice(null);
    try {
      const fromSeed = String(editing.id).startsWith("seed:");
      const create = isNew || fromSeed;
      const res = await fetch(create ? `/api/admin/content/${def.key}` : `/api/admin/content/${def.key}/${editing.id}`, {
        method: create ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not save.");
      setEditing(json);
      setIsNew(false);
      setNotice("Saved.");
      load();
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!editing || isNew) return;
    if (!window.confirm(`Delete this ${def.singular}? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/content/${def.key}/${editing.id}`, { method: "DELETE" });
    if (res.ok) {
      setEditing(null);
      load();
    } else {
      setNotice("Could not delete.");
    }
  };

  const renderField = (f: FieldDef) => {
    const v = editing?.[f.key];
    const id = `f-${f.key}`;
    if (f.type === "boolean") {
      return (
        <label className="flex items-center gap-2 text-sm">
          <input id={id} type="checkbox" checked={Boolean(v)} onChange={(e) => setField(f.key, e.target.checked)} />
          {f.label}
        </label>
      );
    }
    return (
      <div className="space-y-1.5">
        <Label htmlFor={id} className="text-sm font-semibold">
          {f.label}
          {f.required ? " *" : ""}
        </Label>
        {f.type === "textarea" || f.type === "markdown" ? (
          <Textarea
            id={id}
            value={String(v ?? "")}
            onChange={(e) => setField(f.key, e.target.value)}
            rows={f.type === "markdown" ? 18 : 4}
            className={f.type === "markdown" ? "font-mono text-sm" : ""}
          />
        ) : f.type === "select" ? (
          <select
            id={id}
            value={String(v ?? "")}
            onChange={(e) => setField(f.key, e.target.value)}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            {f.options?.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : f.type === "datetime" ? (
          <Input id={id} type="datetime-local" value={toLocalInput(v)} onChange={(e) => setField(f.key, e.target.value)} />
        ) : f.type === "number" ? (
          <Input id={id} type="number" value={String(v ?? 0)} onChange={(e) => setField(f.key, e.target.value)} />
        ) : (
          <Input id={id} value={String(v ?? "")} onChange={(e) => setField(f.key, e.target.value)} />
        )}
        {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
      </div>
    );
  };

  if (editing) {
    return (
      <div className="space-y-5 max-w-3xl">
        <button onClick={() => setEditing(null)} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to {def.title.toLowerCase()}
        </button>
        <h1 className="text-2xl font-bold">{isNew ? `New ${def.singular}` : `Edit ${def.singular}`}</h1>
        {String(editing.id).startsWith("seed:") && <p className="text-sm text-muted-foreground">Built-in {def.singular}. Saving creates an editable copy that replaces it on the website.</p>}
        {def.fields.map((f) => (
          <div key={f.key}>{renderField(f)}</div>
        ))}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button onClick={save} disabled={saving} className="gap-1.5">
            <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save"}
          </Button>
          {!isNew && (
            <Button variant="outline" onClick={remove} disabled={String(editing.id).startsWith("seed:")} className="gap-1.5 text-rose-700">
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          )}
          {notice && <span className="text-sm text-muted-foreground">{notice}</span>}
        </div>
      </div>
    );
  }

  const shown = rows.filter((r) => !filter || JSON.stringify(r).toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{def.title}</h1>
        {def.canCreate && (
          <Button onClick={startNew} className="gap-1.5">
            <Plus className="w-4 h-4" /> New {def.singular}
          </Button>
        )}
      </div>

      {def.key === "services" && (
        <p className="text-sm text-muted-foreground max-w-2xl">
          The website already has built-in pages for every service. Saving a service here with the <strong>same slug</strong> replaces that page&apos;s text. A
          new slug adds a new page.
        </p>
      )}
      {def.key === "blog" && (
        <p className="text-sm text-muted-foreground max-w-2xl">
          Published posts appear on /blog and in the sitemap. Built-in posts can be replaced by saving a post with the same slug.
        </p>
      )}

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search…" className="pl-9" />
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="text-sm text-rose-700">{error}</p>}
      {!loading && !error && shown.length === 0 && <p className="text-sm text-muted-foreground">Nothing here yet.</p>}

      {shown.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                {def.listColumns.map((c) => (
                  <th key={c} className="p-3 font-semibold capitalize">
                    {c.replace(/([A-Z])/g, " $1")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {shown.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => {
                    setEditing(r);
                    setIsNew(false);
                    setNotice(null);
                  }}
                  className="cursor-pointer hover:bg-muted/30"
                >
                  {def.listColumns.map((c) => (
                    <td key={c} className="p-3">
                      {cell(r[c])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
