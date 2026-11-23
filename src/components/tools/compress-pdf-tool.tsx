"use client";

import * as React from "react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Download, FileText, Minimize2, CheckCircle2, ArrowRight, Archive } from "lucide-react";
import { addSessionHistory } from "@/lib/session-history";
import { StandardFileUploader } from "@/components/common/standard-file-uploader";
import { MAX_FILES_LIMIT, MAX_COMBINED_SIZE_BYTES } from "@/lib/file-standards";
import { createZipDownload } from "@/lib/batch-processor";

interface CompressedItem {
  name: string;
  originalSize: number;
  compressedSize: number;
  percentSaved: number;
  blob: Blob;
  url: string;
}

export function CompressPdfTool() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [level, setLevel] = React.useState<"low" | "medium" | "high">("medium");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [progressPercent, setProgressPercent] = React.useState(0);
  const [results, setResults] = React.useState<CompressedItem[]>([]);

  const handleCompressBatch = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgressPercent(5);
    const completedList: CompressedItem[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });

        // Clean unused objects & optimize streams
        const newPdf = await PDFDocument.create();
        const indices = pdf.getPageIndices();
        const copied = await newPdf.copyPages(pdf, indices);
        copied.forEach((p) => newPdf.addPage(p));

        // Remove heavy metadata if medium or high
        if (level !== "low") {
          newPdf.setTitle("");
          newPdf.setAuthor("");
          newPdf.setProducer("Zoqonyx PDF Engine");
        }

        const compressedBytes = await newPdf.save({
          useObjectStreams: true,
          addDefaultPage: false,
        });

        const originalSize = file.size;
        // Report the real result. If restructuring didn't make the file
        // smaller, give back the original file and say 0% saved.
        const smaller = compressedBytes.length < originalSize;
        const finalBytes: Uint8Array = smaller ? compressedBytes : new Uint8Array(await file.arrayBuffer());
        const compressedSize = finalBytes.length;
        const percentSaved = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));
        const blob = new Blob([finalBytes as any], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        completedList.push({
          name: `zoqonyx_min_${file.name}`,
          originalSize,
          compressedSize,
          percentSaved,
          blob,
          url,
        });

        setProgressPercent(Math.round(5 + ((i + 1) / files.length) * 90));
      }

      setResults(completedList);
      setProgressPercent(100);

      addSessionHistory({
        toolSlug: "compress-pdf",
        toolName: "Compress PDF",
        action: "Compressed",
        summary: `Compressed ${completedList.length} PDF files with profile ${level}`,
      });
    } catch (err: any) {
      alert("Error compressing PDF: " + err?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAllZip = async () => {
    if (results.length === 0) return;
    await createZipDownload(
      results.map((r) => ({ name: r.name, blob: r.blob })),
      "zoqonyx_compressed_pdfs.zip"
    );
  };

  return (
    <div className="space-y-6">
      <StandardFileUploader
        files={files}
        onFilesChange={(newFiles) => {
          setFiles(newFiles);
          setResults([]);
          setProgressPercent(0);
        }}
        maxFiles={MAX_FILES_LIMIT}
        maxCombinedSizeBytes={MAX_COMBINED_SIZE_BYTES}
        acceptedExtensions={[".pdf"]}
        acceptedTypes={["application/pdf"]}
        title="Drop up to 100 PDF documents to compress"
        subtitle="Up to 100 PDFs, 1 GB combined capacity. Processed safely in your browser."
        disabled={isProcessing}
      />

      {files.length > 0 && (
        <div className="p-5 rounded-xl border border-border bg-card space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Compression mode</Label>
            <p className="text-xs text-muted-foreground">
              This tool rewrites the PDF structure into compact object streams. It does not re-compress images, so savings are
              small for scanned or photo-heavy PDFs. If the file can&apos;t be made smaller, you get the original back.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: "medium", title: "Compact + remove metadata", desc: "Smallest result; clears title, author and producer" },
                { id: "low", title: "Compact only", desc: "Keeps the document's metadata" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setLevel(c.id as any)}
                  disabled={isProcessing}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    level === c.id
                      ? "border-teal-500 bg-teal-500/10 text-foreground"
                      : "border-border hover:border-muted-foreground/50 text-muted-foreground"
                  }`}
                >
                  <p className="text-xs font-semibold text-foreground">{c.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{c.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {isProcessing && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Compressing PDF files...</span>
                <span className="text-teal-400 font-semibold">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-teal-500 transition-colors duration-200"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleCompressBatch}
              disabled={isProcessing}
              className="flex-1 bg-teal-600 hover:bg-teal-500 text-white gap-2"
            >
              <Minimize2 className="w-4 h-4" />
              <span>{isProcessing ? "Compressing Safely..." : `Compress All ${files.length} PDF(s)`}</span>
            </Button>
            {results.length > 0 && (
              <Button
                onClick={handleDownloadAllZip}
                variant="outline"
                className="gap-2 border-teal-500/40 text-teal-400 hover:bg-teal-500/10"
              >
                <Archive className="w-4 h-4" />
                <span>Download All ({results.length} Files - ZIP)</span>
              </Button>
            )}
          </div>

          {results.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border/60">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Compressed Results ({results.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                {results.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/60 text-xs"
                  >
                    <div className="truncate pr-2">
                      <p className="font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-[10px] text-teal-400 font-medium">
                        {(item.originalSize / 1024).toFixed(0)} KB → {(item.compressedSize / 1024).toFixed(0)} KB (-{item.percentSaved}%)
                      </p>
                    </div>
                    <a href={item.url} download={item.name}>
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1">
                        <Download className="w-3.5 h-3.5" /> Save
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
