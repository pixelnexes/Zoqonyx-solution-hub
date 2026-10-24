"use client";

import * as React from "react";
import QRCode from "qrcode";
import { Download, Copy, Check, QrCode as QrIcon, Calculator, Globe, Calendar, Percent, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// --- 1. QR Code Generator ---
export function QrCodeGeneratorTool() {
  const [text, setText] = React.useState("https://zoqonyx.com");
  const [darkColor, setDarkColor] = React.useState("#0F172A");
  const [lightColor, setLightColor] = React.useState("#FFFFFF");
  const [qrUrl, setQrUrl] = React.useState<string>("");

  const generateQr = React.useCallback(async () => {
    try {
      if (!text.trim()) {
        setQrUrl("");
        return;
      }
      const dataUrl = await QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      });
      setQrUrl(dataUrl);
    } catch (err) {
      console.error(err);
    }
  }, [text, darkColor, lightColor]);

  React.useEffect(() => {
    generateQr();
  }, [generateQr]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              QR Code Content (URL, Text, or Wi-Fi string)
            </label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="https://example.com or phone or message..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-card border border-border/80">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={darkColor}
                onChange={(e) => setDarkColor(e.target.value)}
                className="w-9 h-9 rounded border-0 cursor-pointer"
              />
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Pattern Color</p>
                <p className="font-mono text-xs font-bold uppercase">{darkColor}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="color"
                value={lightColor}
                onChange={(e) => setLightColor(e.target.value)}
                className="w-9 h-9 rounded border-0 cursor-pointer"
              />
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Background Color</p>
                <p className="font-mono text-xs font-bold uppercase">{lightColor}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border/80 flex flex-col items-center justify-center gap-4 text-center">
          {qrUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={qrUrl} alt="QR Code" className="w-48 h-48 rounded-xl shadow-md border" />
          ) : (
            <div className="w-48 h-48 rounded-xl bg-muted/40 flex items-center justify-center text-xs text-muted-foreground">
              Enter content above
            </div>
          )}

          {qrUrl && (
            <a href={qrUrl} download="zoqonyx-qrcode.png" className="w-full">
              <Button variant="gradient" size="sm" className="w-full gap-2">
                <Download className="w-4 h-4" />
                <span>Download PNG</span>
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// --- 2. Meta Tags Generator ---
export function MetaTagsGeneratorTool() {
  const [title, setTitle] = React.useState("Zoqonyx Solution Hub - Free Online Tools");
  const [desc, setDesc] = React.useState("Empower your workflow with 100% free, fast, client-side digital utilities.");
  const [url, setUrl] = React.useState("https://zoqonyx.com");
  const [imageUrl, setImageUrl] = React.useState("https://zoqonyx.com/logo/zoqonyx-logo.png");
  const [copied, setCopied] = React.useState(false);

  const tags = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${desc}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:image" content="${imageUrl}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${desc}" />
<meta property="twitter:image" content="${imageUrl}" />`;

  const copyTags = () => {
    navigator.clipboard.writeText(tags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Page Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Canonical URL</label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div className="space-y-1.5 col-span-full">
          <label className="text-xs font-semibold text-muted-foreground">Meta Description</label>
          <Textarea rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>
        <div className="space-y-1.5 col-span-full">
          <label className="text-xs font-semibold text-muted-foreground">Social Image URL</label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-card border border-border/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-brand-cyan">Generated HTML Meta Tags</span>
          <Button onClick={copyTags} variant="gradient" size="sm" className="gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Meta Tags"}</span>
          </Button>
        </div>
        <textarea
          readOnly
          rows={9}
          value={tags}
          className="w-full p-3 rounded-lg border border-border/70 bg-muted/40 font-mono text-xs focus:outline-none"
        />
      </div>
    </div>
  );
}

// --- 3. Robots.txt Generator ---
export function RobotsTxtGeneratorTool() {
  const [sitemap, setSitemap] = React.useState("https://zoqonyx.com/sitemap.xml");
  const [allowAll, setAllowAll] = React.useState(true);
  const [disallowPaths, setDisallowPaths] = React.useState("/admin/\n/api/admin/");
  const [copied, setCopied] = React.useState(false);

  const robotsOutput = `User-agent: *
${allowAll ? "Allow: /" : "Disallow: /"}
${disallowPaths
  .split("\n")
  .filter(Boolean)
  .map((p) => `Disallow: ${p}`)
  .join("\n")}

Sitemap: ${sitemap}`;

  const copy = () => {
    navigator.clipboard.writeText(robotsOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 p-5 rounded-2xl bg-card border border-border/80">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Sitemap URL</label>
          <Input value={sitemap} onChange={(e) => setSitemap(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">
            Disallowed Paths (One per line)
          </label>
          <Textarea
            rows={3}
            value={disallowPaths}
            onChange={(e) => setDisallowPaths(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-brand-cyan">robots.txt Preview</span>
          <Button onClick={copy} variant="gradient" size="sm" className="gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy robots.txt"}</span>
          </Button>
        </div>
        <textarea
          readOnly
          rows={6}
          value={robotsOutput}
          className="w-full p-3 rounded-lg border border-border/70 bg-muted/40 font-mono text-xs focus:outline-none"
        />
      </div>
    </div>
  );
}

// --- 4. CSS Unit Converter ---
export function UnitConverterTool() {
  const [pixels, setPixels] = React.useState(16);
  const [rootBase, setRootBase] = React.useState(16);

  const rem = (pixels / rootBase).toFixed(4).replace(/\.?0+$/, "");
  const percentage = ((pixels / rootBase) * 100).toFixed(2).replace(/\.?0+$/, "");
  const pt = (pixels * 0.75).toFixed(2).replace(/\.?0+$/, "");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-card border border-border/80">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Pixels (px)</label>
          <Input
            type="number"
            value={pixels}
            onChange={(e) => setPixels(Number(e.target.value))}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Root Base (Default: 16px)</label>
          <Input
            type="number"
            value={rootBase}
            onChange={(e) => setRootBase(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-card border border-border/80 text-center space-y-1">
          <p className="text-3xl font-heading font-black text-brand-cyan">{rem} rem</p>
          <p className="text-xs text-muted-foreground uppercase font-semibold">REM Value</p>
        </div>
        <div className="p-5 rounded-xl bg-card border border-border/80 text-center space-y-1">
          <p className="text-3xl font-heading font-black text-brand-purple">{percentage}%</p>
          <p className="text-xs text-muted-foreground uppercase font-semibold">Percentage</p>
        </div>
        <div className="p-5 rounded-xl bg-card border border-border/80 text-center space-y-1">
          <p className="text-3xl font-heading font-black text-foreground">{pt} pt</p>
          <p className="text-xs text-muted-foreground uppercase font-semibold">Points</p>
        </div>
      </div>
    </div>
  );
}

// --- 5. Age Calculator ---
export function AgeCalculatorTool() {
  const [birthDate, setBirthDate] = React.useState("2000-01-01");

  const calculateAge = () => {
    const birth = new Date(birthDate);
    const now = new Date();
    if (isNaN(birth.getTime())) return null;

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = now.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays };
  };

  const age = calculateAge();

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-card border border-border/80 max-w-sm space-y-2">
        <label className="text-xs font-semibold text-muted-foreground">Select Date of Birth</label>
        <Input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>

      {age && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-card border border-border/80 text-center space-y-1">
            <p className="text-4xl font-heading font-black brand-gradient-text">{age.years}</p>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Years Old</p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border/80 text-center space-y-1">
            <p className="text-4xl font-heading font-black text-foreground">{age.months}</p>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Months</p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border/80 text-center space-y-1">
            <p className="text-4xl font-heading font-black text-foreground">{age.days}</p>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Days</p>
          </div>
        </div>
      )}
    </div>
  );
}

// --- 6. Percentage Calculator ---
export function PercentageCalculatorTool() {
  const [valA, setValA] = React.useState(15);
  const [valB, setValB] = React.useState(200);

  const result1 = ((valA / 100) * valB).toFixed(2);
  const result2 = valB !== 0 ? ((valA / valB) * 100).toFixed(2) : "0";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-4">
          <h4 className="font-heading font-bold text-sm text-foreground">
            What is <span className="text-brand-cyan">{valA}%</span> of{" "}
            <span className="text-brand-purple">{valB}</span>?
          </h4>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={valA}
              onChange={(e) => setValA(Number(e.target.value))}
              className="w-24"
            />
            <span>% of</span>
            <Input
              type="number"
              value={valB}
              onChange={(e) => setValB(Number(e.target.value))}
              className="w-28"
            />
          </div>
          <p className="text-2xl font-heading font-black text-brand-cyan">Result: {result1}</p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-4">
          <h4 className="font-heading font-bold text-sm text-foreground">
            {valA} is what percentage of {valB}?
          </h4>
          <p className="text-2xl font-heading font-black text-brand-purple">Result: {result2}%</p>
        </div>
      </div>
    </div>
  );
}

// --- 7. BMI Calculator ---
export function BmiCalculatorTool() {
  const [heightCm, setHeightCm] = React.useState(175);
  const [weightKg, setWeightKg] = React.useState(70);

  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : "0";
  const numBmi = parseFloat(bmi);

  let category = "Normal weight";
  let catColor = "text-emerald-500";
  if (numBmi < 18.5) {
    category = "Underweight";
    catColor = "text-amber-500";
  } else if (numBmi >= 25 && numBmi < 30) {
    category = "Overweight";
    catColor = "text-amber-500";
  } else if (numBmi >= 30) {
    category = "Obesity";
    catColor = "text-rose-500";
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-card border border-border/80">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Height (cm)</label>
          <Input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(Number(e.target.value))}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Weight (kg)</label>
          <Input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-card border border-border/80 text-center space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase">Your Body Mass Index (BMI)</p>
        <p className="text-5xl font-heading font-black brand-gradient-text">{bmi}</p>
        <p className={`text-sm font-bold ${catColor}`}>{category}</p>
      </div>
    </div>
  );
}
