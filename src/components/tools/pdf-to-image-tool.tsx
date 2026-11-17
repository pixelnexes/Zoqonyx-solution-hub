"use client";

import * as React from "react";
import { openPdf } from "@/lib/pdfjs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Download, FileImage, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { addSessionHistory } from "@/lib/session-history";
import { createZipDownload } from "@/lib/batch-processor";
import { StandardFileUploader } from "@/components/common/standard-file-uploader";
import { MAX_COMBINED_SIZE_BYTES } from "@/lib/file-standards";

interface ExtractedPage {
  pageNumber: number;
  dataUrl: string;
  blob: Blob;
}

export function PdfToImageTool() {
  const [file, setFile] = React.useState<File | null>(null);
  const [format, setFormat] = React.useState<"png" | "jpeg">("png");
  const [scale, setScale] = React.useState<1 | 2>(2);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [pages, setPages] = React.useState<ExtractedPage[]>([]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPages([]);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      // Real rendering of every page with pdf.js.
      const pdf = await openPdf(file);
      const totalPages = pdf.numPages;
      const extracted: ExtractedPage[] = [];
      // scale 1 = 72 DPI, scale 2 ≈ 144 DPI
      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const ctx = canvas.getContext("2d")!;
        // White background so transparent pages export cleanly as JPEG.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvas, canvasContext: ctx, viewport } as any).promise;
        const pageNumber = i;

        await new Promise<void>((resolve) => {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                extracted.push({
                  pageNumber,
                  dataUrl: canvas.toDataURL(format === "jpeg" ? "image/jpeg" : "image/png"),
                  blob,
                });
              }
              resolve();
            },
            format === "jpeg" ? "image/jpeg" : "image/png",
            0.92
          );
        });
      }

      setPages(extracted);
      addSessionHistory({
        toolSlug: "pdf-to-image",
        toolName: "PDF to Image",
        action: "Converted",
        summary: `Converted ${extracted.length} page(s) from ${file.name} to ${format.toUpperCase()}`,
      });
    } catch (err: any) {
      alert("Error converting PDF: " + err?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPage = (p: ExtractedPage) => {
    if (!file) return;
    const a = document.createElement("a");
    a.href = p.dataUrl;
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}_page_${p.pageNumber}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAllZip = async () => {
    if (!file || pages.length === 0) return;
    const filesToZip = pages.map((p) => ({
      name: `${file.name.replace(/\.[^/.]+$/, "")}_page_${p.pageNumber}.${format}`,
      blob: p.blob,
    }));
    await createZipDownload(filesToZip, `${file.name.replace(/\.[^/.]+$/, "")}_images.zip`);
  };

  return (
    <div className="space-y-6">
      <StandardFileUploader
        files={file ? [file] : []}
        onFilesChange={(newFiles) => {
          setFile(newFiles[0] || null);
          setPages([]);
        }}
        maxFiles={1}
        maxCombinedSizeBytes={MAX_COMBINED_SIZE_BYTES}
        acceptedExtensions={[".pdf"]}
        acceptedTypes={["application/pdf"]}
        title="Drop a PDF document to convert to images"
        subtitle="Extract every page as crisp PNG or JPEG images (supports up to 1 GB documents)."
        disabled={isProcessing}
      />

      {file && (
        <div className="p-5 rounded-xl border border-border bg-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Image Format</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={format === "png" ? "default" : "outline"}
                  onClick={() => setFormat("png")}
                  className={format === "png" ? "bg-teal-600 text-white" : ""}
                >
                  PNG (Lossless)
                </Button>
                <Button
                  type="button"
                  variant={format === "jpeg" ? "default" : "outline"}
                  onClick={() => setFormat("jpeg")}
                  className={format === "jpeg" ? "bg-teal-600 text-white" : ""}
                >
                  JPEG (Compact)
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Render Quality</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={scale === 1 ? "default" : "outline"}
                  onClick={() => setScale(1)}
                  className={scale === 1 ? "bg-teal-600 text-white" : ""}
                >
                  Standard (72 DPI)
                </Button>
                <Button
                  type="button"
                  variant={scale === 2 ? "default" : "outline"}
                  onClick={() => setScale(2)}
                  className={scale === 2 ? "bg-teal-600 text-white" : ""}
                >
                  High-Res (144 DPI)
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Source: <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </span>
            <Button
              onClick={handleConvert}
              disabled={isProcessing}
              className="bg-teal-600 hover:bg-teal-500 text-white gap-2 w-full sm:w-auto"
            >
              <ImageIcon className="w-4 h-4" />
              <span>{isProcessing ? "Rasterizing Pages..." : "Extract Pages as Images"}</span>
            </Button>
          </div>
        </div>
      )}

      {pages.length > 0 && (
        <div className="p-5 rounded-xl border border-border bg-card space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div>
              <p className="font-semibold text-foreground flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                {pages.length} Page(s) Extracted Successfully
              </p>
              <p className="text-xs text-muted-foreground">Download pages individually or bundle into a ZIP</p>
            </div>
            {pages.length > 1 && (
              <Button onClick={downloadAllZip} className="bg-teal-600 hover:bg-teal-500 text-white gap-2 text-xs">
                <Download className="w-3.5 h-3.5" />
                <span>Download All as ZIP</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pages.map((p) => (
              <div key={p.pageNumber} className="p-3 rounded-lg border border-border bg-muted/20 space-y-2">
                <div className="aspect-[3/4] bg-white rounded border border-border overflow-hidden flex items-center justify-center">
                  <img src={p.dataUrl} alt={`Page ${p.pageNumber}`} className="w-full h-full object-contain" />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-semibold text-foreground">Page {p.pageNumber}</span>
                  <Button
                    onClick={() => downloadPage(p)}
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1 text-teal-400 border-teal-500/30"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
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
