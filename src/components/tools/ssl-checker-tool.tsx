"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ShieldAlert, CheckCircle2, Search, Lock, Globe } from "lucide-react";
import { addSessionHistory } from "@/lib/session-history";

interface SslData {
  domain: string;
  isValid: boolean;
  issuer: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  protocol: string;
  cipher: string;
}

export function SslCheckerTool() {
  const [domain, setDomain] = React.useState<string>("zoqonyx.com");
  const [data, setData] = React.useState<SslData | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [checkError, setCheckError] = React.useState<string | null>(null);

  const checkSsl = async () => {
    if (!domain.trim()) return;
    setIsLoading(true);

    const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();

    try {
      // Real certificate data from our server, which opens a TLS connection to the domain.
      const res = await fetch(`/api/ssl-check?domain=${encodeURIComponent(cleanDomain)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "The check failed.");

      const result: SslData = {
        domain: json.domain,
        isValid: Boolean(json.isTrusted) && json.daysRemaining >= 0,
        issuer: json.issuer || "Unknown",
        validFrom: json.validFrom,
        validTo: json.validTo,
        daysRemaining: Math.max(0, json.daysRemaining),
        protocol: json.protocol || "Unknown",
        cipher: json.cipher || "Unknown",
      };
      setCheckError(json.isTrusted ? null : `Not trusted by browsers: ${json.trustError}`);
      setData(result);
      addSessionHistory({
        toolSlug: "ssl-checker",
        toolName: "SSL Checker",
        action: "Audited",
        summary: `Checked SSL on ${result.domain}: ${result.isValid ? `valid, ${result.daysRemaining} days left` : "not valid"}`,
      });
    } catch (e: any) {
      setData(null);
      setCheckError(e?.message || "The check failed.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    checkSsl();
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border border-border bg-card space-y-5">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Target Domain or Hostname</Label>
          <div className="flex gap-2">
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. zoqonyx.com, github.com"
              className="text-sm font-mono"
            />
            <Button
              onClick={checkSsl}
              disabled={isLoading}
              className="bg-teal-600 hover:bg-teal-500 text-white gap-2 text-xs shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isLoading ? "Checking..." : "Verify SSL"}</span>
            </Button>
          </div>
        </div>

        {checkError && (
          <p role="alert" className="text-sm text-rose-700">
            {checkError}
          </p>
        )}

        {data && (
          <div className="space-y-4 pt-3 border-t border-border">
            <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${data.isValid ? "bg-teal-500/10 text-teal-400" : "bg-destructive/10 text-destructive"}`}>
                  {data.isValid ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                    {data.domain}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${data.isValid ? "bg-teal-500/10 text-teal-400" : "bg-destructive/10 text-destructive"}`}>
                      {data.isValid ? "Valid & Secure" : "Warning"}
                    </span>
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {data.isValid ? "Certificate is active and trusted by all major browsers." : "Certificate could not be verified."}
                  </p>
                </div>
              </div>

              {data.isValid && (
                <div className="text-right shrink-0">
                  <span className="text-2xl font-black text-teal-400">{data.daysRemaining}</span>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Days Remaining</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: "Certificate Authority (Issuer)", val: data.issuer },
                { label: "Valid From", val: data.validFrom },
                { label: "Valid Until", val: data.validTo },
                { label: "Protocol", val: data.protocol },
                { label: "Cipher Suite", val: data.cipher },
                { label: "Strict Transport Security (HSTS)", val: "Enabled" },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-lg border border-border bg-card">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.label}</span>
                  <p className="text-xs font-semibold text-foreground mt-0.5">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
