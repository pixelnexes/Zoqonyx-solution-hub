"use client";

import * as React from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Upload, Download, Trash2, RotateCw, ArrowLeft, ArrowRight, LayoutGrid, CheckCircle2 } from "lucide-react";
import { addSessionHistory } from "@/lib/session-history";

interface PageItem {
  id: string;
  originalIndex: number;
  rotation: number;
}

export function OrganizePdfTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [pages, setPages] = React.useState<PageItem[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setSuccess(false);
      try {
        const bytes = await f.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const count = pdf.getPageCount();
        const initialPages: PageItem[] = [];
        for (let i = 0; i < count; i++) {
          initialPages.push({
            id: Math.random().toString(36).substring(7),
            originalIndex: i,
            rotation: 0,
          });
        }
        setPages(initialPages);
      } catch (err: any) {
        alert("Could not load PDF: " + err?.message);
      }
    }
  };

  const movePage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= pages.length) return;
    const copy = [...pages];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setPages(copy);
    setSuccess(false);
  };

  const rotatePage = (index: number) => {
    const copy = [...pages];
    copy[index].rotation = (copy[index].rotation + 90) % 360;
    setPages(copy);
    setSuccess(false);
  };

  const deletePage = (index: number) => {
    if (pages.length <= 1) {
      alert("A PDF must contain at least 1 page.");
      return;
    }
    setPages((prev) => prev.filter((_, i) => i !== index));
    setSuccess(false);
  };

  const handleSave = async () => {
    if (!file || pages.length === 0) return;
    setIsProcessing(true);

    try {
      const bytes = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(bytes);
      const newPdf = await PDFDocument.create();

      for (const p of pages) {
        const [copied] = await newPdf.copyPages(srcPdf, [p.originalIndex]);
        if (p.rotation !== 0) {
          const curRot = copied.getRotation().angle;
          copied.setRotation(degrees((curRot + p.rotation) % 360));
        }
        newPdf.addPage(copied);
      }

      const resBytes = await newPdf.save();
      const blob = new Blob([resBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `zoqonyx_organized_${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);

      setSuccess(true);
      addSessionHistory({
        toolSlug: "organize-pdf",
        toolName: "Organize PDF",
        action: "Reorganized",
        summary: `Reorganized ${pages.length} pages in ${file.name}`,
      });
    } catch (err: any) {
      alert("Error saving organized PDF: " + err?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-card hover:border-teal-500/50 transition-colors">
        <input
          type="file"
          id="organize-pdf-upload"
          accept="application/pdf"
          onChange={handleFile}
          className="hidden"
        />
        <label htmlFor="organize-pdf-upload" className="cursor-pointer flex flex-col items-center gap-3">
          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {file ? file.name : "Select PDF Document to Organize"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Reorder pages, rotate individual pages, and delete unwanted sections visually
            </p>
          </div>
        </label>
      </div>

      {file && pages.length > 0 && (
        <div className="p-5 rounded-xl border border-border bg-card space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <p className="font-semibold text-foreground text-sm">
                Visual Page Reordering ({pages.length} Pages)
              </p>
              <p className="text-xs text-muted-foreground">Use arrow buttons to shift order or rotate</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {success && (
                <span className="text-xs text-teal-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Downloaded!
                </span>
              )}
              <Button
                onClick={handleSave}
                disabled={isProcessing}
                className="bg-teal-600 hover:bg-teal-500 text-white gap-2 w-full sm:w-auto text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isProcessing ? "Building PDF..." : "Export Organized PDF"}</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {pages.map((p, idx) => (
              <div
                key={p.id}
                className="p-3 rounded-lg border border-border bg-muted/30 flex flex-col items-center gap-2 relative group"
              >
                <span className="text-[11px] font-bold text-muted-foreground">
                  Page {idx + 1}
                  <span className="text-[10px] text-muted-foreground/60 ml-1">(Orig #{p.originalIndex + 1})</span>
                </span>

                <div
                  className="w-24 h-32 rounded border border-border bg-card flex flex-col items-center justify-center p-2 shadow-sm transition-transform"
                  style={{ transform: `rotate(${p.rotation}deg)` }}
                >
                  <span className="text-xs font-mono font-bold text-foreground">📄 #{p.originalIndex + 1}</span>
                  {p.rotation > 0 && (
                    <span className="text-[9px] text-teal-400 font-bold mt-1">+{p.rotation}°</span>
                  )}
                </div>

                <div className="flex items-center gap-1 pt-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={idx === 0}
                    onClick={() => movePage(idx, -1)}
                    className="h-7 w-7 text-xs disabled:opacity-20"
                    title="Move Left"
                  >
                    <ArrowLeft className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => rotatePage(idx)}
                    className="h-7 w-7 text-xs text-teal-400"
                    title="Rotate 90°"
                  >
                    <RotateCw className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={idx === pages.length - 1}
                    onClick={() => movePage(idx, 1)}
                    className="h-7 w-7 text-xs disabled:opacity-20"
                    title="Move Right"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePage(idx)}
                    className="h-7 w-7 text-xs text-destructive"
                    title="Delete Page"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
