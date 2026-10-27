"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Check,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Sun,
  Moon,
  Laptop,
  Palette,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useSiteSettings } from "@/components/providers/site-settings-provider";

export default function AppearancePage() {
  const { setTheme } = useTheme();
  const { refreshSettings } = useSiteSettings();

  const [iconPath, setIconPath] = React.useState("/logo/zoqonyx-icon.png");
  const [lightLogoPath, setLightLogoPath] = React.useState("/logo/zoqonyx-logo.png");
  const [darkLogoPath, setDarkLogoPath] = React.useState("/logo/zoqonyx-logo.png");
  const [logoType, setLogoType] = React.useState("text"); // "text" | "image"
  const [defaultTheme, setDefaultTheme] = React.useState("system"); // "system" | "dark" | "light"

  const [primaryColor, setPrimaryColor] = React.useState("#0D9488");
  const [secondaryColor, setSecondaryColor] = React.useState("#14B8A6");
  const [electricCyan, setElectricCyan] = React.useState("#06B6D4");
  const [softPurple, setSoftPurple] = React.useState("#7C3AED");

  const [isSaving, setIsSaving] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);
  const [uploadingTarget, setUploadingTarget] = React.useState<string | null>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  // Load existing settings
  React.useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.icon_path) setIconPath(data.icon_path);
          if (data.light_logo_path) setLightLogoPath(data.light_logo_path);
          else if (data.logo_path) setLightLogoPath(data.logo_path);
          if (data.dark_logo_path) setDarkLogoPath(data.dark_logo_path);
          else if (data.logo_path) setDarkLogoPath(data.logo_path);
          if (data.logo_type) setLogoType(data.logo_type);
          if (data.default_theme) setDefaultTheme(data.default_theme);
          if (data.primary_color) setPrimaryColor(data.primary_color);
          if (data.secondary_color) setSecondaryColor(data.secondary_color);
          if (data.electric_cyan) setElectricCyan(data.electric_cyan);
          if (data.soft_purple) setSoftPurple(data.soft_purple);
        }
      } catch (e) {
        console.error("Error loading appearance settings:", e);
      }
    }
    loadSettings();
  }, []);

  // Upload handler for files
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "icon" | "lightLogo" | "darkLogo"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTarget(target);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if (target === "icon") {
        setIconPath(data.url);
      } else if (target === "lightLogo") {
        setLightLogoPath(data.url);
      } else if (target === "darkLogo") {
        setDarkLogoPath(data.url);
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Failed to upload image.");
    } finally {
      setUploadingTarget(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    setUploadError(null);

    try {
      const payload = {
        icon_path: iconPath,
        light_logo_path: lightLogoPath,
        dark_logo_path: darkLogoPath,
        logo_path: lightLogoPath, // fallback for legacy
        logo_type: logoType,
        default_theme: "light",
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        electric_cyan: electricCyan,
        soft_purple: softPurple,
      };

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSavedSuccess(true);
        // Refresh local context
        await refreshSettings();

        // Update active theme live
        if (defaultTheme === "system") {
          setTheme("system");
        } else if (defaultTheme === "dark") {
          setTheme("dark");
        } else if (defaultTheme === "light") {
          setTheme("light");
        }

        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Error saving appearance settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-black text-foreground">
          Brand Appearance & Theme Studio
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Customize website logos (Icon, Light Logo, Dark Logo), configure default light/dark web themes, and fine-tune signature brand accents.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-semibold flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Appearance and theme settings updated successfully! All website components now reflect your changes.</span>
        </div>
      )}

      {uploadError && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: Web Theme Selector */}
        <div className="p-6 rounded-lg bg-card border border-border/80 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-teal-400" />
            <h3 className="font-heading font-bold text-base text-foreground">Default Website Theme</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Choose the default color mode visitors experience when opening Zoqonyx.com.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* System / Adaptive */}
            <label
              className={`flex flex-col p-4 rounded-lg border cursor-pointer transition-all ${
                defaultTheme === "system"
                  ? "bg-teal-500/10 border-teal-500 text-teal-400 shadow-sm"
                  : "bg-muted/30 border-border/70 hover:bg-muted/60 text-muted-foreground"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Laptop className="w-5 h-5" />
                <input
                  type="radio"
                  name="default_theme"
                  value="system"
                  checked={defaultTheme === "system"}
                  onChange={() => setDefaultTheme("system")}
                  className="sr-only"
                />
                {defaultTheme === "system" && <Check className="w-4 h-4 text-teal-400" />}
              </div>
              <span className="font-bold text-xs text-foreground">System Adaptive</span>
              <span className="text-[11px] text-muted-foreground mt-0.5">
                Automatically matches user's OS preference (Dark or Light).
              </span>
            </label>

            {/* Dark Theme */}
            <label
              className={`flex flex-col p-4 rounded-lg border cursor-pointer transition-all ${
                defaultTheme === "dark"
                  ? "bg-teal-500/10 border-teal-500 text-teal-400 shadow-sm"
                  : "bg-muted/30 border-border/70 hover:bg-muted/60 text-muted-foreground"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Moon className="w-5 h-5" />
                <input
                  type="radio"
                  name="default_theme"
                  value="dark"
                  checked={defaultTheme === "dark"}
                  onChange={() => setDefaultTheme("dark")}
                  className="sr-only"
                />
                {defaultTheme === "dark" && <Check className="w-4 h-4 text-teal-400" />}
              </div>
              <span className="font-bold text-xs text-foreground">Dark Theme</span>
              <span className="text-[11px] text-muted-foreground mt-0.5">
                Default to Charcoal dark palette for low eye strain.
              </span>
            </label>

            {/* Light Theme */}
            <label
              className={`flex flex-col p-4 rounded-lg border cursor-pointer transition-all ${
                defaultTheme === "light"
                  ? "bg-teal-500/10 border-teal-500 text-teal-400 shadow-sm"
                  : "bg-muted/30 border-border/70 hover:bg-muted/60 text-muted-foreground"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Sun className="w-5 h-5" />
                <input
                  type="radio"
                  name="default_theme"
                  value="light"
                  checked={defaultTheme === "light"}
                  onChange={() => setDefaultTheme("light")}
                  className="sr-only"
                />
                {defaultTheme === "light" && <Check className="w-4 h-4 text-teal-400" />}
              </div>
              <span className="font-bold text-xs text-foreground">Light Theme</span>
              <span className="text-[11px] text-muted-foreground mt-0.5">
                Default to crisp high-contrast light background.
              </span>
            </label>
          </div>
        </div>

        {/* SECTION 2: Logo Style & Mode */}
        <div className="p-6 rounded-lg bg-card border border-border/80 space-y-5 shadow-sm">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-teal-400" />
            <h3 className="font-heading font-bold text-base text-foreground">Logo Rendering Mode</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                logoType === "text"
                  ? "bg-teal-500/10 border-teal-500 text-teal-400"
                  : "bg-muted/30 border-border/70 text-muted-foreground"
              }`}
            >
              <input
                type="radio"
                name="logo_type"
                value="text"
                checked={logoType === "text"}
                onChange={() => setLogoType("text")}
                className="mt-1"
              />
              <div>
                <span className="font-bold text-xs text-foreground block">
                  Icon + Stylized Typography (Recommended)
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Displays your custom brand icon alongside modern high-DPI stylized vector typography.
                </span>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                logoType === "image"
                  ? "bg-teal-500/10 border-teal-500 text-teal-400"
                  : "bg-muted/30 border-border/70 text-muted-foreground"
              }`}
            >
              <input
                type="radio"
                name="logo_type"
                value="image"
                checked={logoType === "image"}
                onChange={() => setLogoType("image")}
                className="mt-1"
              />
              <div>
                <span className="font-bold text-xs text-foreground block">
                  Full Image Logo Graphic
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Renders uploaded Light and Dark full logo image banners directly in the navigation bar.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* SECTION 3: Brand Assets (Icon, Light Logo, Dark Logo) */}
        <div className="p-6 rounded-lg bg-card border border-border/80 space-y-6 shadow-sm">
          <h3 className="font-heading font-bold text-base text-foreground">
            Brand Assets (Icon, Light Logo & Dark Logo)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Website Icon / Favicon */}
            <div className="space-y-3 p-4 rounded-lg bg-muted/20 border border-border/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">Website Icon</label>
                <span className="text-[10px] text-muted-foreground">PNG, SVG, ICO</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Browser favicon and header brand symbol.
              </p>

              <div className="h-28 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-center p-3 relative overflow-hidden">
                <Image
                  src={iconPath}
                  alt="Icon Preview"
                  width={48}
                  height={48}
                  className="object-contain max-h-12 w-auto"
                  unoptimized
                />
              </div>

              <div className="space-y-2">
                <Input
                  value={iconPath}
                  onChange={(e) => setIconPath(e.target.value)}
                  placeholder="/logo/icon.png"
                  className="text-xs h-8"
                />

                <label className="inline-flex items-center justify-center w-full px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold cursor-pointer transition-colors gap-1.5">
                  {uploadingTarget === "icon" ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 text-teal-400" />
                      <span>Upload Icon Image</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={uploadingTarget !== null}
                    onChange={(e) => handleFileUpload(e, "icon")}
                  />
                </label>
              </div>
            </div>

            {/* 2. Light Mode Logo */}
            <div className="space-y-3 p-4 rounded-lg bg-muted/20 border border-border/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">Light Mode Logo</label>
                <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-1">
                  <Sun className="w-3 h-3" /> Light Theme
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Displayed when user is in light mode.
              </p>

              {/* White background preview box */}
              <div className="h-28 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-3 relative overflow-hidden shadow-inner">
                <Image
                  src={lightLogoPath}
                  alt="Light Logo Preview"
                  width={140}
                  height={36}
                  className="object-contain max-h-12 w-auto"
                  unoptimized
                />
              </div>

              <div className="space-y-2">
                <Input
                  value={lightLogoPath}
                  onChange={(e) => setLightLogoPath(e.target.value)}
                  placeholder="/logo/light-logo.png"
                  className="text-xs h-8"
                />

                <label className="inline-flex items-center justify-center w-full px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold cursor-pointer transition-colors gap-1.5">
                  {uploadingTarget === "lightLogo" ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 text-teal-400" />
                      <span>Upload Light Logo</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={uploadingTarget !== null}
                    onChange={(e) => handleFileUpload(e, "lightLogo")}
                  />
                </label>
              </div>
            </div>

            {/* 3. Dark Mode Logo */}
            <div className="space-y-3 p-4 rounded-lg bg-muted/20 border border-border/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">Dark Mode Logo</label>
                <span className="text-[10px] text-teal-400 font-semibold flex items-center gap-1">
                  <Moon className="w-3 h-3" /> Dark Theme
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Displayed when user is in dark mode.
              </p>

              {/* Dark charcoal background preview box */}
              <div className="h-28 rounded-lg bg-[#0B0F19] border border-slate-800 flex items-center justify-center p-3 relative overflow-hidden shadow-inner">
                <Image
                  src={darkLogoPath}
                  alt="Dark Logo Preview"
                  width={140}
                  height={36}
                  className="object-contain max-h-12 w-auto"
                  unoptimized
                />
              </div>

              <div className="space-y-2">
                <Input
                  value={darkLogoPath}
                  onChange={(e) => setDarkLogoPath(e.target.value)}
                  placeholder="/logo/dark-logo.png"
                  className="text-xs h-8"
                />

                <label className="inline-flex items-center justify-center w-full px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-semibold cursor-pointer transition-colors gap-1.5">
                  {uploadingTarget === "darkLogo" ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 text-teal-400" />
                      <span>Upload Dark Logo</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={uploadingTarget !== null}
                    onChange={(e) => handleFileUpload(e, "darkLogo")}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Brand Accent Colors */}
        <div className="p-6 rounded-lg bg-card border border-border/80 space-y-4 shadow-sm">
          <h3 className="font-heading font-bold text-base text-foreground">Brand Color System</h3>
          <p className="text-xs text-muted-foreground">
            Configure primary accent tones used across buttons, badges, and interactive components.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border/50">
              <label className="text-xs font-semibold text-muted-foreground">Primary Teal</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-9 h-9 rounded border-0 cursor-pointer bg-transparent"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-9 font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border/50">
              <label className="text-xs font-semibold text-muted-foreground">Electric Accent</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-9 h-9 rounded border-0 cursor-pointer bg-transparent"
                />
                <Input
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="h-9 font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border/50">
              <label className="text-xs font-semibold text-muted-foreground">Electric Cyan</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={electricCyan}
                  onChange={(e) => setElectricCyan(e.target.value)}
                  className="w-9 h-9 rounded border-0 cursor-pointer bg-transparent"
                />
                <Input
                  value={electricCyan}
                  onChange={(e) => setElectricCyan(e.target.value)}
                  className="h-9 font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border/50">
              <label className="text-xs font-semibold text-muted-foreground">Soft Purple Accent</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={softPurple}
                  onChange={(e) => setSoftPurple(e.target.value)}
                  className="w-9 h-9 rounded border-0 cursor-pointer bg-transparent"
                />
                <Input
                  value={softPurple}
                  onChange={(e) => setSoftPurple(e.target.value)}
                  className="h-9 font-mono text-xs uppercase"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-2">
          <Button
            type="submit"
            variant="gradient"
            disabled={isSaving || uploadingTarget !== null}
            className="px-6 py-2.5"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>Saving Appearance...</span>
              </>
            ) : (
              <span>Save Appearance & Theme</span>
            )}
          </Button>

          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Live changes applied across site
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
