"use client";

import * as React from "react";
import QRCode from "qrcode";
import {
  Download,
  Copy,
  Check,
  Link as LinkIcon,
  FileText,
  Wifi,
  Contact,
  MessageCircle,
  Mail,
  Phone,
  Upload,
  Trash2,
  Sparkles,
  Sliders,
  Palette,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContentType = "url" | "text" | "wifi" | "vcard" | "whatsapp" | "email" | "phone";
type ColorMode = "single" | "gradient";
type EyeShape = "square" | "rounded" | "circle";

interface BrandPreset {
  name: string;
  svg: string;
}

const BRAND_ICONS: Record<string, string> = {
  Google: `<svg viewBox="0 0 24 24" fill="#4285F4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>`,
  WhatsApp: `<svg viewBox="0 0 24 24" fill="#25D366"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 6.46 17.5 2 12.04 2ZM17.28 16.02C17.06 16.64 16.2 17.18 15.54 17.33C15.09 17.43 14.5 17.5 12.52 16.68C9.99 15.63 8.35 13.06 8.22 12.89C8.1 12.72 7.21 11.54 7.21 10.32C7.21 9.1 7.83 8.5 8.08 8.24C8.28 8.03 8.56 7.96 8.84 7.96C8.93 7.96 9.02 7.96 9.1 7.97C9.34 7.98 9.46 7.99 9.62 8.37C9.82 8.85 10.31 10.05 10.37 10.17C10.43 10.29 10.48 10.44 10.4 10.6C10.32 10.76 10.27 10.84 10.16 10.97C10.05 11.1 9.94 11.2 9.82 11.35C9.69 11.49 9.55 11.64 9.7 11.9C9.85 12.16 10.37 13.01 11.14 13.7C12.13 14.58 12.94 14.86 13.22 14.98C13.44 15.07 13.7 15.05 13.86 14.88C14.06 14.66 14.31 14.3 14.56 13.95C14.74 13.7 14.97 13.67 15.21 13.76C15.46 13.85 16.78 14.5 17.05 14.64C17.32 14.78 17.5 14.85 17.56 14.96C17.62 15.07 17.62 15.54 17.28 16.02Z"/></svg>`,
  Instagram: `<svg viewBox="0 0 24 24" fill="#E4405F"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`,
  YouTube: `<svg viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  TwitterX: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  LinkedIn: `<svg viewBox="0 0 24 24" fill="#0A66C2"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
  GitHub: `<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
};

export function QrCodeGeneratorProTool() {
  // Content Type State
  const [contentType, setContentType] = React.useState<ContentType>("url");
  
  // Specific Form Inputs
  const [url, setUrl] = React.useState("https://zoqonyx.com");
  const [plainText, setPlainText] = React.useState("Welcome to Zoqonyx Solution Hub");
  const [wifiSsid, setWifiSsid] = React.useState("Zoqonyx-Guest");
  const [wifiPassword, setWifiPassword] = React.useState("FreeTools2026");
  const [wifiEncryption, setWifiEncryption] = React.useState("WPA");
  const [wifiHidden, setWifiHidden] = React.useState(false);
  
  const [vcardFirst, setVcardFirst] = React.useState("Zawwar");
  const [vcardLast, setVcardLast] = React.useState("Ahmed");
  const [vcardOrg, setVcardOrg] = React.useState("Newix Tech Solutions");
  const [vcardTitle, setVcardTitle] = React.useState("Founder");
  const [vcardPhone, setVcardPhone] = React.useState("+1 (555) 019-2834");
  const [vcardEmail, setVcardEmail] = React.useState("hello@zoqonyx.com");
  const [vcardUrl, setVcardUrl] = React.useState("https://zoqonyx.com");

  const [waPhone, setWaPhone] = React.useState("923001234567");
  const [waMessage, setWaMessage] = React.useState("Hello Zoqonyx Support, I am reaching out regarding...");

  const [mailTo, setMailTo] = React.useState("hello@zoqonyx.com");
  const [mailSubject, setMailSubject] = React.useState("Inquiry from QR Code");
  const [mailBody, setMailBody] = React.useState("Hi Zoqonyx Team,");

  const [phoneNum, setPhoneNum] = React.useState("+1234567890");

  // Styling State
  const [colorMode, setColorMode] = React.useState<ColorMode>("single");
  const [fgColor1, setFgColor1] = React.useState("#0F172A");
  const [fgColor2, setFgColor2] = React.useState("#06B6D4");
  const [gradientAngle, setGradientAngle] = React.useState(135);
  const [bgColor, setBgColor] = React.useState("#FFFFFF");
  const [isTransparentBg, setIsTransparentBg] = React.useState(false);
  const [eyeShape, setEyeShape] = React.useState<EyeShape>("rounded");
  const [correctionLevel, setCorrectionLevel] = React.useState<"L" | "M" | "Q" | "H">("H");
  
  // Logo State
  const [logoSrc, setLogoSrc] = React.useState<string | null>("/logo/zoqonyx-icon.png");
  const [logoSize, setLogoSize] = React.useState<number>(22); // percent of QR width

  // Export State
  const [copied, setCopied] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Compute Raw String based on Content Type
  const computedPayload = React.useMemo(() => {
    switch (contentType) {
      case "url":
        return url.trim() || "https://zoqonyx.com";
      case "text":
        return plainText.trim() || " ";
      case "wifi":
        return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};H:${wifiHidden ? "true" : "false"};;`;
      case "vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vcardLast};${vcardFirst};;;\nFN:${vcardFirst} ${vcardLast}\nORG:${vcardOrg}\nTITLE:${vcardTitle}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nURL:${vcardUrl}\nEND:VCARD`;
      case "whatsapp": {
        const cleanPhone = waPhone.replace(/\D/g, "");
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;
      }
      case "email":
        return `mailto:${mailTo}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
      case "phone":
        return `tel:${phoneNum}`;
      default:
        return "https://zoqonyx.com";
    }
  }, [
    contentType,
    url,
    plainText,
    wifiEncryption,
    wifiSsid,
    wifiPassword,
    wifiHidden,
    vcardFirst,
    vcardLast,
    vcardOrg,
    vcardTitle,
    vcardPhone,
    vcardEmail,
    vcardUrl,
    waPhone,
    waMessage,
    mailTo,
    mailSubject,
    mailBody,
    phoneNum,
  ]);

  // Render QR Code onto Canvas
  const renderCanvas = React.useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const size = 1024;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    try {
      const qrData = await QRCode.create(computedPayload, {
        errorCorrectionLevel: logoSrc ? "H" : correctionLevel,
      });

      const moduleCount = qrData.modules.size;
      const margin = 4; // in modules
      const totalModules = moduleCount + margin * 2;
      const moduleSize = size / totalModules;

      // 1. Draw Background
      if (isTransparentBg) {
        ctx.clearRect(0, 0, size, size);
      } else {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
      }

      // 2. Prepare Foreground Fill (Solid or Gradient)
      let fillStyle: string | CanvasGradient = fgColor1;
      if (colorMode === "gradient") {
        const rad = (gradientAngle * Math.PI) / 180;
        const x1 = (size / 2) * (1 - Math.cos(rad));
        const y1 = (size / 2) * (1 - Math.sin(rad));
        const x2 = (size / 2) * (1 + Math.cos(rad));
        const y2 = (size / 2) * (1 + Math.sin(rad));
        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, fgColor1);
        grad.addColorStop(1, fgColor2);
        fillStyle = grad;
      }

      ctx.fillStyle = fillStyle;

      // Helper function to check if module is within corner eyes (7x7 zones)
      const isCornerEye = (row: number, col: number) => {
        if (row < 7 && col < 7) return true; // Top-Left
        if (row < 7 && col >= moduleCount - 7) return true; // Top-Right
        if (row >= moduleCount - 7 && col < 7) return true; // Bottom-Left
        return false;
      };

      // Helper for rounded rect
      const fillRoundedRect = (
        x: number,
        y: number,
        w: number,
        h: number,
        r: number
      ) => {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
        ctx.fill();
      };

      // 3. Draw Normal Modules
      for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
          if (isCornerEye(r, c)) continue; // handle custom eye shapes separately

          if (qrData.modules.get(r, c)) {
            const x = (margin + c) * moduleSize;
            const y = (margin + r) * moduleSize;
            if (eyeShape === "circle") {
              ctx.beginPath();
              ctx.arc(
                x + moduleSize / 2,
                y + moduleSize / 2,
                moduleSize / 2 * 0.9,
                0,
                Math.PI * 2
              );
              ctx.fill();
            } else if (eyeShape === "rounded") {
              fillRoundedRect(
                x + 0.5,
                y + 0.5,
                moduleSize - 1,
                moduleSize - 1,
                moduleSize * 0.35
              );
            } else {
              ctx.fillRect(x, y, moduleSize, moduleSize);
            }
          }
        }
      }

      // 4. Draw Styled Corner Eyes
      const drawEye = (startCol: number, startRow: number) => {
        const eyeX = (margin + startCol) * moduleSize;
        const eyeY = (margin + startRow) * moduleSize;
        const eyeW = 7 * moduleSize;
        const eyeH = 7 * moduleSize;

        // Outer Frame
        ctx.fillStyle = fillStyle;
        const outerRadius =
          eyeShape === "circle"
            ? eyeW / 2
            : eyeShape === "rounded"
            ? moduleSize * 2
            : 0;

        ctx.beginPath();
        if (eyeShape === "circle") {
          ctx.arc(eyeX + eyeW / 2, eyeY + eyeH / 2, eyeW / 2, 0, Math.PI * 2);
        } else {
          ctx.roundRect(eyeX, eyeY, eyeW, eyeH, outerRadius);
        }
        ctx.fill();

        // Inner Cutout (matches background)
        ctx.fillStyle = isTransparentBg ? "#FFFFFF" : bgColor;
        const innerCutX = eyeX + moduleSize;
        const innerCutY = eyeY + moduleSize;
        const innerCutW = 5 * moduleSize;
        const innerCutH = 5 * moduleSize;
        const innerCutRadius =
          eyeShape === "circle"
            ? innerCutW / 2
            : eyeShape === "rounded"
            ? moduleSize * 1.3
            : 0;

        ctx.beginPath();
        if (eyeShape === "circle") {
          ctx.arc(
            innerCutX + innerCutW / 2,
            innerCutY + innerCutH / 2,
            innerCutW / 2,
            0,
            Math.PI * 2
          );
        } else {
          ctx.roundRect(innerCutX, innerCutY, innerCutW, innerCutH, innerCutRadius);
        }
        ctx.fill();

        // Center Eye Dot
        ctx.fillStyle = fillStyle;
        const dotX = eyeX + 2 * moduleSize;
        const dotY = eyeY + 2 * moduleSize;
        const dotW = 3 * moduleSize;
        const dotH = 3 * moduleSize;
        const dotRadius =
          eyeShape === "circle"
            ? dotW / 2
            : eyeShape === "rounded"
            ? moduleSize * 0.9
            : 0;

        ctx.beginPath();
        if (eyeShape === "circle") {
          ctx.arc(dotX + dotW / 2, dotY + dotH / 2, dotW / 2, 0, Math.PI * 2);
        } else {
          ctx.roundRect(dotX, dotY, dotW, dotH, dotRadius);
        }
        ctx.fill();
      };

      drawEye(0, 0); // Top-Left
      drawEye(moduleCount - 7, 0); // Top-Right
      drawEye(0, moduleCount - 7); // Bottom-Left

      // 5. Center Logo Embedding with White Backdrop Pill
      if (logoSrc) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = logoSrc;
        img.onload = () => {
          const lSize = (size * logoSize) / 100;
          const lx = (size - lSize) / 2;
          const ly = (size - lSize) / 2;
          const padding = lSize * 0.12;

          // Background Badge Pill for Logo
          ctx.fillStyle = "#FFFFFF";
          ctx.shadowColor = "rgba(0,0,0,0.18)";
          ctx.shadowBlur = 16;
          ctx.beginPath();
          ctx.roundRect(
            lx - padding,
            ly - padding,
            lSize + padding * 2,
            lSize + padding * 2,
            (lSize + padding * 2) * 0.28
          );
          ctx.fill();
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;

          // Draw Logo Image
          ctx.drawImage(img, lx, ly, lSize, lSize);
        };
      }
    } catch (err) {
      console.error("QR Code generation error:", err);
    }
  }, [
    computedPayload,
    correctionLevel,
    bgColor,
    isTransparentBg,
    colorMode,
    fgColor1,
    fgColor2,
    gradientAngle,
    eyeShape,
    logoSrc,
    logoSize,
  ]);

  React.useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoSrc(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Download High-Res PNG
  const downloadPng = (resolution = 1024) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `zoqonyx-qr-${contentType}-${resolution}px.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Copy Image to Clipboard
  const copyToClipboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Content Type Switcher */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-muted/60 border border-border/80 overflow-x-auto scrollbar-none">
        {[
          { id: "url", label: "Website URL", icon: LinkIcon },
          { id: "text", label: "Plain Text", icon: FileText },
          { id: "wifi", label: "Wi-Fi Network", icon: Wifi },
          { id: "vcard", label: "vCard Contact", icon: Contact },
          { id: "whatsapp", label: "WhatsApp Chat", icon: MessageCircle },
          { id: "email", label: "Send Email", icon: Mail },
          { id: "phone", label: "Phone / SMS", icon: Phone },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = contentType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setContentType(item.id as ContentType)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? "bg-card text-brand-cyan shadow-sm border border-border/80 font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Content & Style Inputs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Dynamic Content Inputs */}
          <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
            <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-cyan" />
              <span>QR Code Information</span>
            </h3>

            {contentType === "url" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Website URL</label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://yourwebsite.com/promotion"
                  className="h-11 text-sm font-medium"
                />
                <p className="text-[11px] text-muted-foreground">Include https:// for seamless scanning on mobile browsers.</p>
              </div>
            )}

            {contentType === "text" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Plain Text Message</label>
                <Textarea
                  value={plainText}
                  onChange={(e) => setPlainText(e.target.value)}
                  placeholder="Enter notes, vouchers, or instructions..."
                  rows={4}
                  className="text-sm"
                />
              </div>
            )}

            {contentType === "wifi" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Wi-Fi Network Name (SSID)</label>
                  <Input
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="e.g. Office_Guest_WiFi"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Network Password</label>
                  <Input
                    type="password"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="Wi-Fi Password"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Encryption Type</label>
                  <select
                    value={wifiEncryption}
                    onChange={(e) => setWifiEncryption(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm font-medium"
                  >
                    <option value="WPA">WPA / WPA2 / WPA3 (Recommended)</option>
                    <option value="WEP">WEP (Legacy)</option>
                    <option value="nopass">No Password (Open Network)</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="wifiHidden"
                    checked={wifiHidden}
                    onChange={(e) => setWifiHidden(e.target.checked)}
                    className="rounded accent-cyan-500 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="wifiHidden" className="text-xs font-semibold cursor-pointer select-none">
                    Hidden Network
                  </label>
                </div>
              </div>
            )}

            {contentType === "vcard" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">First Name</label>
                  <Input value={vcardFirst} onChange={(e) => setVcardFirst(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Last Name</label>
                  <Input value={vcardLast} onChange={(e) => setVcardLast(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Company / Organization</label>
                  <Input value={vcardOrg} onChange={(e) => setVcardOrg(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Job Title</label>
                  <Input value={vcardTitle} onChange={(e) => setVcardTitle(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Phone Number</label>
                  <Input value={vcardPhone} onChange={(e) => setVcardPhone(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
                  <Input value={vcardEmail} onChange={(e) => setVcardEmail(e.target.value)} />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Website</label>
                  <Input value={vcardUrl} onChange={(e) => setVcardUrl(e.target.value)} />
                </div>
              </div>
            )}

            {contentType === "whatsapp" && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">WhatsApp Number (with Country Code)</label>
                  <Input
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    placeholder="e.g. 15551234567 or 923001234567"
                  />
                  <p className="text-[11px] text-muted-foreground">Do not include +, spaces, or dashes (just digits with country code).</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Pre-filled Message</label>
                  <Textarea
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    placeholder="Hello, I want to inquire about..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {contentType === "email" && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Recipient Email</label>
                  <Input value={mailTo} onChange={(e) => setMailTo(e.target.value)} placeholder="contact@company.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Subject Line</label>
                  <Input value={mailSubject} onChange={(e) => setMailSubject(e.target.value)} placeholder="Project Inquiry" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Email Body</label>
                  <Textarea value={mailBody} onChange={(e) => setMailBody(e.target.value)} rows={3} />
                </div>
              </div>
            )}

            {contentType === "phone" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Phone Number</label>
                <Input value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} placeholder="+1 (555) 000-0000" />
              </div>
            )}
          </div>

          {/* Color & Gradient Styling */}
          <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
            <h3 className="font-heading font-bold text-sm text-foreground flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-brand-purple" />
                <span>Colors &amp; Gradients</span>
              </span>
              <div className="flex items-center gap-2 bg-muted/60 p-1 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setColorMode("single")}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    colorMode === "single" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                  }`}
                >
                  Solid Color
                </button>
                <button
                  onClick={() => setColorMode("gradient")}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    colorMode === "gradient" ? "bg-card shadow-sm text-brand-cyan" : "text-muted-foreground"
                  }`}
                >
                  Gradient
                </button>
              </div>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/60">
                <input
                  type="color"
                  value={fgColor1}
                  onChange={(e) => setFgColor1(e.target.value)}
                  className="w-10 h-10 rounded-lg border-0 cursor-pointer p-0"
                />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {colorMode === "gradient" ? "Start Color" : "Pattern Color"}
                  </p>
                  <p className="font-mono text-xs font-bold uppercase">{fgColor1}</p>
                </div>
              </div>

              {colorMode === "gradient" && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/60">
                  <input
                    type="color"
                    value={fgColor2}
                    onChange={(e) => setFgColor2(e.target.value)}
                    className="w-10 h-10 rounded-lg border-0 cursor-pointer p-0"
                  />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">End Color</p>
                    <p className="font-mono text-xs font-bold uppercase">{fgColor2}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/60">
                <input
                  type="color"
                  disabled={isTransparentBg}
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border-0 cursor-pointer p-0 disabled:opacity-40"
                />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Background</p>
                  <p className="font-mono text-xs font-bold uppercase">
                    {isTransparentBg ? "Transparent" : bgColor}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={isTransparentBg}
                  onChange={(e) => setIsTransparentBg(e.target.checked)}
                  className="rounded accent-cyan-500 w-4 h-4 cursor-pointer"
                />
                <span>Transparent Background (PNG only)</span>
              </label>

              {colorMode === "gradient" && (
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-muted-foreground">Angle:</span>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={gradientAngle}
                    onChange={(e) => setGradientAngle(Number(e.target.value))}
                    className="w-24 accent-cyan-500 cursor-pointer"
                  />
                  <span className="font-mono text-brand-cyan">{gradientAngle}°</span>
                </div>
              )}
            </div>
          </div>

          {/* Eye Design & Logo Embed */}
          <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4 shadow-sm">
            <h3 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-accent" />
              <span>Corner Eyes &amp; Logo Branding</span>
            </h3>

            {/* Corner Shape */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Corner Eye Style</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "rounded", label: "Smooth Rounded" },
                  { id: "circle", label: "Circular" },
                  { id: "square", label: "Classic Square" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setEyeShape(s.id as EyeShape)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      eyeShape === s.id
                        ? "border-brand-cyan bg-brand-cyan/10 text-brand-cyan"
                        : "border-border/80 hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Options */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-muted-foreground">Center Logo Badge</label>
                {logoSrc && (
                  <button
                    onClick={() => setLogoSrc(null)}
                    className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Logo</span>
                  </button>
                )}
              </div>

              {/* Upload or Pick Presets */}
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dashed border-brand-cyan/60 hover:bg-brand-cyan/5 text-xs font-semibold text-brand-cyan cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Brand Logo (PNG/SVG)</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>

                {/* Built-in Presets */}
                <button
                  onClick={() => setLogoSrc("/logo/zoqonyx-icon.png")}
                  className="px-2.5 py-1.5 rounded-lg border border-border/80 text-xs font-medium hover:bg-muted"
                >
                  Zoqonyx
                </button>
                <button
                  onClick={() =>
                    setLogoSrc(
                      "data:image/svg+xml;utf8," +
                        encodeURIComponent(BRAND_ICONS.Google)
                    )
                  }
                  className="px-2.5 py-1.5 rounded-lg border border-border/80 text-xs font-medium hover:bg-muted"
                >
                  Google
                </button>
                <button
                  onClick={() =>
                    setLogoSrc(
                      "data:image/svg+xml;utf8," +
                        encodeURIComponent(BRAND_ICONS.WhatsApp)
                    )
                  }
                  className="px-2.5 py-1.5 rounded-lg border border-border/80 text-xs font-medium hover:bg-muted"
                >
                  WhatsApp
                </button>
                <button
                  onClick={() =>
                    setLogoSrc(
                      "data:image/svg+xml;utf8," +
                        encodeURIComponent(BRAND_ICONS.Instagram)
                    )
                  }
                  className="px-2.5 py-1.5 rounded-lg border border-border/80 text-xs font-medium hover:bg-muted"
                >
                  Instagram
                </button>
                <button
                  onClick={() =>
                    setLogoSrc(
                      "data:image/svg+xml;utf8," +
                        encodeURIComponent(BRAND_ICONS.LinkedIn)
                    )
                  }
                  className="px-2.5 py-1.5 rounded-lg border border-border/80 text-xs font-medium hover:bg-muted"
                >
                  LinkedIn
                </button>
              </div>

              {logoSrc && (
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-xs text-muted-foreground font-semibold">Logo Scale:</span>
                  <input
                    type="range"
                    min="15"
                    max="28"
                    value={logoSize}
                    onChange={(e) => setLogoSize(Number(e.target.value))}
                    className="w-36 accent-cyan-500 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-brand-cyan">{logoSize}%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live High-Def Preview & Export */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xl flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative p-5 rounded-2xl bg-white border border-slate-200 shadow-inner flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-64 h-64 sm:w-72 sm:h-72 object-contain"
              />
            </div>

            <div className="w-full space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground px-1">
                <span>Print-Ready Resolution</span>
                <span className="text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> High Error Correction (30%)
                </span>
              </div>

              {/* Download Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="gradient"
                  onClick={() => downloadPng(1024)}
                  className="gap-2 w-full font-bold shadow-md shadow-brand-cyan/20"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PNG</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  className="gap-2 w-full font-semibold border-border/80 hover:bg-muted"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Image</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => downloadPng(512)}
                  className="text-[11px] font-semibold text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-muted/50"
                >
                  512px (Web)
                </button>
                <button
                  onClick={() => downloadPng(2048)}
                  className="text-[11px] font-semibold text-muted-foreground hover:text-foreground px-2 py-1 rounded bg-muted/50"
                >
                  2048px (Ultra HD)
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-left w-full text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">💡 Pro Tips for Scanning:</p>
              <p>• High error correction ensures your QR scans reliably even with center logos.</p>
              <p>• Keep contrast high between pattern and background for outdoor posters.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
