"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, X } from "lucide-react";

type Item = { id: string; name: string; what: string; href: string; at: string };
type Inbox = { items: Item[]; mail: { configured: boolean; to: string[] } };

const SEEN_KEY = "zq-admin-seen-leads";

function beep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    gain.gain.value = 0.08;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
    osc.onended = () => ctx.close();
  } catch {
    // Sound is a bonus; the popup still shows.
  }
}

/** Checks for new enquiries every 30 seconds and shows a popup, a sound and (if allowed) a desktop notification. */
export function LeadAlerts() {
  const [inbox, setInbox] = React.useState<Inbox | null>(null);
  const [fresh, setFresh] = React.useState<Item[]>([]);
  const [permission, setPermission] = React.useState<NotificationPermission | "unsupported">("unsupported");
  const announced = React.useRef(new Set<string>());

  React.useEffect(() => {
    if ("Notification" in window) setPermission(Notification.permission);
    let stopped = false;

    async function check() {
      try {
        const res = await fetch("/api/admin/inbox", { cache: "no-store" });
        if (!res.ok) return;
        const data: Inbox = await res.json();
        if (stopped) return;
        setInbox(data);
        let seenAt = 0;
        try {
          seenAt = Number(localStorage.getItem(SEEN_KEY) || 0);
        } catch {}
        const unseen = data.items.filter((i) => new Date(i.at).getTime() > seenAt);
        setFresh(unseen);
        const brandNew = unseen.filter((i) => !announced.current.has(i.id));
        if (brandNew.length) {
          brandNew.forEach((i) => announced.current.add(i.id));
          beep();
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("New enquiry on Zoqonyx", { body: `${brandNew[0].name} (${brandNew[0].what})` });
          }
        }
        document.title = unseen.length ? `(${unseen.length}) New enquiry | Zoqonyx admin` : "Zoqonyx admin";
      } catch {
        // Try again on the next tick.
      }
    }

    check();
    const timer = window.setInterval(check, 30000);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, []);

  function dismiss() {
    const newest = Math.max(...fresh.map((i) => new Date(i.at).getTime()));
    try {
      localStorage.setItem(SEEN_KEY, String(newest));
    } catch {}
    setFresh([]);
    document.title = "Zoqonyx admin";
  }

  return (
    <>
      {inbox && !inbox.mail.configured && (
        <p role="status" className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Lead emails are off. Add SMTP_USER and SMTP_PASS in the hosting environment to receive each enquiry at{" "}
          {inbox.mail.to.join(", ")}.
        </p>
      )}
      {permission === "default" && (
        <button
          type="button"
          onClick={() => Notification.requestPermission().then(setPermission)}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold"
        >
          <Bell className="h-4 w-4" aria-hidden="true" /> Turn on desktop alerts for new enquiries
        </button>
      )}
      {fresh.length > 0 && (
        <div role="alert" className="fixed bottom-4 right-4 z-50 w-[min(340px,calc(100vw-2rem))] rounded-2xl border border-border bg-card p-4 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold">
              {fresh.length} new enquir{fresh.length > 1 ? "ies" : "y"}
            </p>
            <button type="button" onClick={dismiss} aria-label="Mark as seen" className="rounded p-1 hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            {fresh.map((i) => (
              <li key={i.id}>
                <Link href={i.href} className="block rounded-lg px-2 py-1.5 hover:bg-muted">
                  <span className="font-medium">{i.name}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    · {i.what} · {new Date(i.at).toLocaleString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
