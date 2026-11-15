"use client";

import * as React from "react";
import {
  FileText,
  PenTool,
  Download,
  Upload,
  CheckCircle2,
  Trash2,
  FileCheck,
  Layers,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PDFDocument, rgb } from "pdf-lib";

// ==========================================
// 1. eSIGN PDF & SIGNATURE SIGNER (esign-pdf / pdf-signature-signer)
// ==========================================
export function EsignPdfTool() {
  const [pdfFile, setPdfFile] = React.useState<File | null>(null);
  const [signatureDataUrl, setSignatureDataUrl] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [signedPdfUrl, setSignedPdfUrl] = React.useState<string | null>(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [posX, setPosX] = React.useState(150);
  const [posY, setPosY] = React.useState(150);
  const [sigWidth, setSigWidth] = React.useState(160);

  const sigCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);

  // Initialize signature drawing pad
  React.useEffect(() => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#0f172a";
  }, []);

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleStopDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = sigCanvasRef.current;
    if (canvas) {
      setSignatureDataUrl(canvas.toDataURL("image/png"));
    }
  };

  const clearSignature = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl(null);
  };

  const applySignatureToPdf = async () => {
    if (!pdfFile || !signatureDataUrl) return;
    setIsProcessing(true);
    setSignedPdfUrl(null);

    try {
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // Embed signature PNG
      const pngImage = await pdfDoc.embedPng(signatureDataUrl);
      const pngDims = pngImage.scale(sigWidth / pngImage.width);

      const pages = pdfDoc.getPages();
      const targetIndex = Math.min(Math.max(0, pageNumber - 1), pages.length - 1);
      const targetPage = pages[targetIndex];

      // Draw signature on specified page
      targetPage.drawImage(pngImage, {
        x: posX,
        y: posY,
        width: pngDims.width,
        height: pngDims.height,
      });

      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([modifiedPdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setSignedPdfUrl(url);
    } catch {
      alert("Failed to sign PDF. Please make sure the PDF is not encrypted or password-protected.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step 1: Upload & Parameters */}
        <div className="lg:col-span-6 space-y-4 bg-card p-5 rounded-xl border border-border shadow-xs">
          <div className="border-b pb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-600" />
              <span>1. Choose PDF & Target Coordinates</span>
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <Label>Select PDF Document</Label>
              <Input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setPdfFile(f);
                }}
                className="text-xs"
              />
              {pdfFile && (
                <p className="text-[11px] text-teal-700 font-mono">
                  Loaded: {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="space-y-1">
                <Label>Page #</Label>
                <Input
                  type="number"
                  min={1}
                  value={pageNumber}
                  onChange={(e) => setPageNumber(Number(e.target.value))}
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label>X Position (px)</Label>
                <Input
                  type="number"
                  value={posX}
                  onChange={(e) => setPosX(Number(e.target.value))}
                  className="font-mono text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label>Y Position (px)</Label>
                <Input
                  type="number"
                  value={posY}
                  onChange={(e) => setPosY(Number(e.target.value))}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Signature Width ({sigWidth}px)</Label>
              <input
                type="range"
                min="80"
                max="300"
                value={sigWidth}
                onChange={(e) => setSigWidth(Number(e.target.value))}
                className="w-full h-1.5 accent-teal-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Signature Drawing Pad */}
        <div className="lg:col-span-6 space-y-4 bg-card p-5 rounded-xl border border-border shadow-xs">
          <div className="border-b pb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              <PenTool className="w-4 h-4 text-teal-600" />
              <span>2. Draw Your Signature</span>
            </h3>
            <button
              type="button"
              onClick={clearSignature}
              className="text-rose-600 hover:text-rose-700 text-xs font-semibold"
            >
              Clear
            </button>
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-lg p-2 bg-slate-50 flex justify-center">
            <canvas
              ref={sigCanvasRef}
              width={340}
              height={140}
              onMouseDown={handleStartDraw}
              onMouseMove={handleDraw}
              onMouseUp={handleStopDraw}
              onMouseLeave={handleStopDraw}
              className="cursor-crosshair bg-white rounded border border-slate-200"
            />
          </div>
          <p className="text-[11px] text-slate-500 text-center">Use your mouse, trackpad, or touch stylus to draw.</p>

          <Button
            type="button"
            onClick={applySignatureToPdf}
            disabled={!pdfFile || !signatureDataUrl || isProcessing}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white text-xs gap-1.5"
          >
            <FileCheck className="w-4 h-4" />
            <span>{isProcessing ? "Embedding Signature..." : "Sign & Generate Document"}</span>
          </Button>
        </div>
      </div>

      {/* Download Action Banner */}
      {signedPdfUrl && (
        <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-950">PDF Document Signed Successfully!</p>
              <p className="text-[11px] text-emerald-800">
                Signature embedded at page {pageNumber} ({posX}, {posY}). Processed 100% in local memory.
              </p>
            </div>
          </div>

          <a
            href={signedPdfUrl}
            download={`signed_${pdfFile?.name || "document.pdf"}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Signed PDF</span>
          </a>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. ADVANCED PDF EDITOR & FORM FILLER (advanced-pdf-editor / pdf-form-filler)
// ==========================================
export function AdvancedPdfEditorTool() {
  const [pdfFile, setPdfFile] = React.useState<File | null>(null);
  const [formFields, setFormFields] = React.useState<{ name: string; type: string; value: string }[]>([]);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [filledPdfUrl, setFilledPdfUrl] = React.useState<string | null>(null);

  const loadPdfFields = async (file: File) => {
    setIsAnalyzing(true);
    setPdfFile(file);
    setFilledPdfUrl(null);

    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const form = doc.getForm();
      const fields = form.getFields();

      const extracted = fields.map((f) => ({
        name: f.getName(),
        type: f.constructor.name.replace("PDF", ""),
        value: "",
      }));

      setFormFields(extracted);
    } catch {
      setFormFields([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFieldValueChange = (name: string, val: string) => {
    setFormFields(formFields.map((f) => (f.name === name ? { ...f, value: val } : f)));
  };

  const saveFilledPdf = async () => {
    if (!pdfFile) return;
    try {
      const bytes = await pdfFile.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const form = doc.getForm();

      formFields.forEach((f) => {
        try {
          const field = form.getTextField(f.name);
          if (field && f.value) {
            field.setText(f.value);
          }
        } catch {
          // Field might be a checkbox or dropdown
        }
      });

      const modifiedBytes = await doc.save();
      const blob = new Blob([modifiedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setFilledPdfUrl(url);
    } catch {
      alert("Failed to export filled PDF document.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl border border-border bg-card space-y-4 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
          <Upload className="w-4 h-4 text-teal-600" />
          <span>Upload PDF Document or Interactive Form</span>
        </h3>

        <Input
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) loadPdfFields(f);
          }}
          className="text-xs"
        />

        {pdfFile && (
          <div className="p-3 rounded-lg bg-slate-50 border text-xs space-y-1">
            <span className="font-semibold text-slate-800">Loaded: {pdfFile.name}</span>
            <p className="text-[11px] text-slate-500">
              {formFields.length > 0
                ? `Discovered ${formFields.length} interactive AcroForm field(s). You can fill values below.`
                : "Standard PDF document loaded. Zero server uploads."}
            </p>
          </div>
        )}
      </div>

      {formFields.length > 0 && (
        <div className="p-5 rounded-xl border border-border bg-card space-y-4 shadow-xs">
          <h4 className="text-xs font-mono font-bold uppercase text-slate-700">Form Fields to Fill</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formFields.map((field) => (
              <div key={field.name} className="space-y-1 text-xs">
                <Label className="font-mono text-slate-700 truncate block">{field.name}</Label>
                <Input
                  value={field.value}
                  onChange={(e) => handleFieldValueChange(field.name, e.target.value)}
                  placeholder={`Enter ${field.name}...`}
                  className="text-xs font-mono"
                />
              </div>
            ))}
          </div>

          <Button
            type="button"
            onClick={saveFilledPdf}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white text-xs gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate & Save Filled PDF</span>
          </Button>
        </div>
      )}

      {filledPdfUrl && (
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-950">Filled PDF ready for export!</span>
          <a
            href={filledPdfUrl}
            download={`filled_${pdfFile?.name || "form.pdf"}`}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs rounded-md font-semibold inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
        </div>
      )}
    </div>
  );
}
