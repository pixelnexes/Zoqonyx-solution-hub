"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Search, RefreshCw, Copy, CheckCircle2, ShieldCheck, MapPin } from "lucide-react";
import { addSessionHistory } from "@/lib/session-history";

interface IpData {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  org?: string;
  postal?: string;
  timezone?: string;
  loc?: string;
}

export function IpLookupTool() {
  const [query, setQuery] = React.useState<string>("");
  const [data, setData] = React.useState<IpData | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [copied, setCopied] = React.useState(false);
  const [lookupError, setLookupError] = React.useState<string | null>(null);

  const fetchIpInfo = async (ipToSearch?: string) => {
    setIsLoading(true);
    try {
      setLookupError(null);
      // ipwho.is: free, no key, sends CORS headers (ipapi.co blocks browser calls).
      const endpoint = ipToSearch && ipToSearch.trim()
        ? `https://ipwho.is/${encodeURIComponent(ipToSearch.trim())}`
        : "https://ipwho.is/";

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("The IP lookup service did not respond. Try again in a minute.");
      const json = await res.json();
      if (json.success === false) throw new Error(json.message || "That doesn't look like a valid IP address.");

      const result: IpData = {
        ip: json.ip,
        city: json.city,
        region: json.region,
        country: json.country,
        org: json.connection?.org || json.connection?.isp,
        postal: json.postal,
        timezone: json.timezone?.id,
        loc: json.latitude && json.longitude ? `${json.latitude}, ${json.longitude}` : undefined,
      };

      setData(result);
      addSessionHistory({
        toolSlug: "ip-lookup",
        toolName: "IP Lookup",
        action: "Inspected",
        summary: `Looked up ${result.ip} (${result.country || "Global"})`,
      });
    } catch (err: any) {
      // Show the real failure; never show made-up location data.
      setData(null);
      setLookupError(err?.message || "The lookup failed. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchIpInfo();
  }, []);

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border border-border bg-card space-y-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter IPv4, IPv6, or domain (e.g. 8.8.8.8)..."
              className="text-sm font-mono"
            />
          </div>
          <Button
            onClick={() => fetchIpInfo(query)}
            disabled={isLoading}
            className="bg-teal-600 hover:bg-teal-500 text-white gap-2 text-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isLoading ? "Searching..." : "Lookup IP"}</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setQuery("");
              fetchIpInfo("");
            }}
            className="gap-2 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>My Current IP</span>
          </Button>
        </div>

        {lookupError && (
          <p role="alert" className="text-sm text-rose-700">
            {lookupError}
          </p>
        )}

        {data && (
          <div className="space-y-4 pt-2 border-t border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Inspected IP Address</span>
                <p className="text-2xl font-semibold text-teal-400 font-mono">{data.ip}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 text-xs">
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Details"}</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: "Country", value: data.country || "Unknown" },
                { label: "City & Region", value: `${data.city || ""}, ${data.region || ""}`.replace(/^, |, $/g, "") || "Unknown" },
                { label: "ISP / Organization", value: data.org || "Network Carrier" },
                { label: "Postal Code", value: data.postal || "N/A" },
                { label: "Timezone", value: data.timezone || "UTC" },
                { label: "Coordinates (Lat/Lng)", value: data.loc || "Protected" },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-lg border border-border bg-muted/20">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.label}</span>
                  <p className="text-xs font-semibold text-foreground mt-0.5 truncate">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
