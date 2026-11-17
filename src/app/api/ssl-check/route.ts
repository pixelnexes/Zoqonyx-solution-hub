import { NextResponse } from "next/server";
import tls from "node:tls";
import dns from "node:dns/promises";
import net from "node:net";

// Reads the real TLS certificate of a public website.
// Browsers cannot see certificates, so this runs on the server.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HOST_RE = /^(?=.{1,253}$)(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))+$/i;

// Block private, loopback, link-local and other non-public addresses (SSRF guard).
function isPublicIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    if (a === 10 || a === 127 || a === 0) return false;
    if (a === 169 && b === 254) return false;
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 192 && b === 168) return false;
    if (a === 100 && b >= 64 && b <= 127) return false;
    if (a >= 224) return false;
    return true;
  }
  if (net.isIPv6(ip)) {
    const v = ip.toLowerCase();
    if (v === "::1" || v === "::" || v.startsWith("fe80") || v.startsWith("fc") || v.startsWith("fd")) return false;
    if (v.startsWith("::ffff:")) return isPublicIp(v.slice(7));
    return true;
  }
  return false;
}

function nameOf(entity: unknown): string {
  if (!entity || typeof entity !== "object") return "";
  const e = entity as Record<string, string | string[]>;
  const pick = (k: string) => (Array.isArray(e[k]) ? (e[k] as string[]).join(", ") : (e[k] as string) || "");
  return pick("O") || pick("CN");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = (searchParams.get("domain") || "").trim().toLowerCase();
  const host = raw.replace(/^https?:\/\//, "").replace(/[/:?#].*$/, "");

  if (!HOST_RE.test(host)) {
    return NextResponse.json({ error: "Enter a valid domain name, like example.com." }, { status: 400 });
  }

  let address: string;
  try {
    const results = await dns.lookup(host, { all: true });
    const pub = results.find((r) => isPublicIp(r.address));
    if (!pub) {
      return NextResponse.json({ error: "That domain does not point to a public address." }, { status: 400 });
    }
    address = pub.address;
  } catch {
    return NextResponse.json({ error: "That domain could not be found (DNS lookup failed)." }, { status: 404 });
  }

  try {
    const info = await new Promise<Record<string, unknown>>((resolve, reject) => {
      const socket = tls.connect({ host: address, port: 443, servername: host, rejectUnauthorized: false, timeout: 8000 }, () => {
        const cert = socket.getPeerCertificate();
        if (!cert || Object.keys(cert).length === 0) {
          socket.end();
          reject(new Error("The server did not present a certificate."));
          return;
        }
        const validTo = new Date(cert.valid_to);
        const validFrom = new Date(cert.valid_from);
        const daysRemaining = Math.floor((validTo.getTime() - Date.now()) / 86_400_000);
        resolve({
          domain: host,
          isTrusted: socket.authorized,
          trustError: socket.authorized ? null : String(socket.authorizationError || "Not trusted"),
          issuer: nameOf(cert.issuer),
          subject: nameOf(cert.subject),
          altNames: (cert.subjectaltname || "").replace(/DNS:/g, "").split(", ").filter(Boolean).slice(0, 20),
          validFrom: validFrom.toISOString().slice(0, 10),
          validTo: validTo.toISOString().slice(0, 10),
          daysRemaining,
          protocol: socket.getProtocol(),
          cipher: socket.getCipher()?.name || "",
        });
        socket.end();
      });
      socket.on("timeout", () => {
        socket.destroy();
        reject(new Error("The server did not respond on port 443 in time."));
      });
      socket.on("error", (err) => reject(err));
    });

    return NextResponse.json(info, { headers: { "Cache-Control": "public, max-age=300" } });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Could not connect over HTTPS (port 443)." }, { status: 502 });
  }
}
