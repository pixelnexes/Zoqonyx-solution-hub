"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Settings as SettingsIcon } from "lucide-react";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = React.useState("ZOQONYX Solution Hub");
  const [siteTagline, setSiteTagline] = React.useState("Free Online Tools Platform");
  const [email1, setEmail1] = React.useState("hello@zoqonyx.com");
  const [email2, setEmail2] = React.useState("");
  const [footerCredit, setFooterCredit] = React.useState("Developed by Newix Tech Solutions");
  const [footerUrl, setFooterUrl] = React.useState("https://newixtechsolutions.com/");
  const [isSaving, setIsSaving] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  React.useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.site_name) setSiteName(data.site_name);
          if (data.site_tagline) setSiteTagline(data.site_tagline);
          if (data.contact_email_primary) setEmail1(data.contact_email_primary);
          if (data.contact_email_secondary) setEmail2(data.contact_email_secondary);
          if (data.footer_credit) setFooterCredit(data.footer_credit);
          if (data.footer_url) setFooterUrl(data.footer_url);
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
          site_name: siteName,
          site_tagline: siteTagline,
          contact_email_primary: email1,
          contact_email_secondary: email2,
          footer_credit: footerCredit,
          footer_url: footerUrl,
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
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-black text-foreground">
          Platform Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Global platform title, contact addresses, and footer attribution.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-card border border-border/80 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Platform Name</label>
          <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} required />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Tagline</label>
          <Input value={siteTagline} onChange={(e) => setSiteTagline(e.target.value)} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Primary Contact Email</label>
            <Input type="email" value={email1} onChange={(e) => setEmail1(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Secondary Contact Email</label>
            <Input type="email" value={email2} onChange={(e) => setEmail2(e.target.value)} required />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Footer Attribution Credit</label>
            <Input value={footerCredit} onChange={(e) => setFooterCredit(e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Footer Attribution URL</label>
            <Input value={footerUrl} onChange={(e) => setFooterUrl(e.target.value)} required />
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" variant="gradient" disabled={isSaving}>
            {isSaving ? "Saving Settings..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
