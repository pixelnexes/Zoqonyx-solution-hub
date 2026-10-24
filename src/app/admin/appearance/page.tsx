"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Sparkles, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function AppearancePage() {
  const [primaryColor, setPrimaryColor] = React.useState("#1E3A8A");
  const [secondaryColor, setSecondaryColor] = React.useState("#2563EB");
  const [electricCyan, setElectricCyan] = React.useState("#06B6D4");
  const [softPurple, setSoftPurple] = React.useState("#7C3AED");
  const [logoPath, setLogoPath] = React.useState("/logo/zoqonyx-logo.png");
  const [iconPath, setIconPath] = React.useState("/logo/zoqonyx-icon.png");
  const [isSaving, setIsSaving] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  React.useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.primary_color) setPrimaryColor(data.primary_color);
          if (data.secondary_color) setSecondaryColor(data.secondary_color);
          if (data.electric_cyan) setElectricCyan(data.electric_cyan);
          if (data.soft_purple) setSoftPurple(data.soft_purple);
          if (data.logo_path) setLogoPath(data.logo_path);
          if (data.icon_path) setIconPath(data.icon_path);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          electric_cyan: electricCyan,
          soft_purple: softPurple,
          logo_path: logoPath,
          icon_path: iconPath,
        }),
      });

      if (res.ok) {
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
          Appearance & Brand Customizer
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Configure logo paths, official brand color palettes, and signature gradients.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Appearance settings saved successfully! Changes take effect instantly.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Logos */}
        <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-4">
          <h3 className="font-heading font-bold text-base text-foreground">Logo & Icon Paths</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Full Logo Path</label>
              <Input
                value={logoPath}
                onChange={(e) => setLogoPath(e.target.value)}
              />
              <div className="p-4 rounded-xl bg-muted/40 flex items-center justify-center">
                <Image
                  src={logoPath}
                  alt="Logo Preview"
                  width={160}
                  height={40}
                  className="object-contain max-h-12"
                  unoptimized
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Icon Only Path</label>
              <Input
                value={iconPath}
                onChange={(e) => setIconPath(e.target.value)}
              />
              <div className="p-4 rounded-xl bg-muted/40 flex items-center justify-center">
                <Image
                  src={iconPath}
                  alt="Icon Preview"
                  width={48}
                  height={48}
                  className="object-contain max-h-12"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>

        {/* Brand Colors Palette */}
        <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-4">
          <h3 className="font-heading font-bold text-base text-foreground">Brand Color System</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2 p-3 rounded-xl bg-muted/30">
              <label className="text-xs font-semibold text-muted-foreground">Primary Blue</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-9 h-9 rounded border-0 cursor-pointer"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-9 font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div className="space-y-2 p-3 rounded-xl bg-muted/30">
              <label className="text-xs font-semibold text-muted-foreground">Gradient Blue</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-9 h-9 rounded border-0 cursor-pointer"
                />
                <Input
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="h-9 font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div className="space-y-2 p-3 rounded-xl bg-muted/30">
              <label className="text-xs font-semibold text-muted-foreground">Electric Cyan</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={electricCyan}
                  onChange={(e) => setElectricCyan(e.target.value)}
                  className="w-9 h-9 rounded border-0 cursor-pointer"
                />
                <Input
                  value={electricCyan}
                  onChange={(e) => setElectricCyan(e.target.value)}
                  className="h-9 font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div className="space-y-2 p-3 rounded-xl bg-muted/30">
              <label className="text-xs font-semibold text-muted-foreground">Soft Purple</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={softPurple}
                  onChange={(e) => setSoftPurple(e.target.value)}
                  className="w-9 h-9 rounded border-0 cursor-pointer"
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

        <Button type="submit" variant="gradient" disabled={isSaving}>
          {isSaving ? "Saving Settings..." : "Save Appearance Settings"}
        </Button>
      </form>
    </div>
  );
}
