import * as React from "react";

/* Code-drawn product visuals (no stock photos): glass ring, analytics cards, code card.
   They are illustrations, so they carry no figures or claims. */

export function OrbRing({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="orb-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8B5CF6" />
          <stop offset=".5" stopColor="#F9A8D4" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
        <linearGradient id="orb-b" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#22D3EE" stopOpacity=".9" />
          <stop offset="1" stopColor="#7C3AED" stopOpacity=".9" />
        </linearGradient>
        <filter id="orb-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <g transform="rotate(-24 200 200)">
        <ellipse cx="200" cy="200" rx="170" ry="62" fill="none" stroke="url(#orb-a)" strokeWidth="26" filter="url(#orb-blur)" opacity=".55" />
        <ellipse cx="200" cy="200" rx="170" ry="62" fill="none" stroke="url(#orb-a)" strokeWidth="14" />
        <ellipse cx="200" cy="200" rx="150" ry="48" fill="none" stroke="url(#orb-b)" strokeWidth="3" opacity=".8" />
      </g>
      <circle cx="200" cy="200" r="46" fill="url(#orb-a)" opacity=".9" />
      <circle cx="186" cy="186" r="14" fill="#fff" opacity=".55" />
    </svg>
  );
}

function BarCard({ className = "" }: { className?: string }) {
  const bars = [38, 62, 48, 80, 58, 92, 70];
  return (
    <div className={`rounded-xl border border-[#E7E1F6] bg-white p-4 shadow-[0_26px_60px_-30px_rgba(76,29,149,.45)] ${className}`}>
      <p className="text-left text-[13px] font-semibold text-[#5C5878]">Website traffic</p>
      <div className="mt-3 flex h-24 items-end gap-2">
        {bars.map((h, i) => (
          <span key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%`, background: i === 5 ? "linear-gradient(180deg,#8B5CF6,#6D28D9)" : "#E4DAFB" }} />
        ))}
      </div>
    </div>
  );
}

function RingCard({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 rounded-xl border border-[#E7E1F6] bg-white p-4 shadow-[0_26px_60px_-30px_rgba(76,29,149,.45)] ${className}`}>
      <span className="relative grid h-20 w-20 shrink-0 place-items-center rounded-full" style={{ background: "conic-gradient(#7C3AED 0 72%, #EFE9FD 72% 100%)" }}>
        <span className="h-14 w-14 rounded-full bg-white" />
      </span>
      <div className="text-left">
        <p className="text-[13px] font-semibold text-[#5C5878]">Goal progress</p>
        <p className="mt-1 h-2 w-24 rounded-full bg-[#EFE9FD]" />
        <p className="mt-2 h-2 w-16 rounded-full bg-[#EFE9FD]" />
      </div>
    </div>
  );
}

function LineCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-[#E7E1F6] bg-white p-4 shadow-[0_26px_60px_-30px_rgba(76,29,149,.45)] ${className}`}>
      <p className="text-left text-[13px] font-semibold text-[#5C5878]">Growth</p>
      <svg viewBox="0 0 220 80" className="mt-2 w-full" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="ln-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8B5CF6" stopOpacity=".3" />
            <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 62 C 25 58, 35 30, 62 38 S 105 66, 130 40 S 180 8, 220 16 V80 H0Z" fill="url(#ln-fill)" />
        <path d="M0 62 C 25 58, 35 30, 62 38 S 105 66, 130 40 S 180 8, 220 16" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function CodeCard({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl bg-[#1B1340] shadow-[0_26px_60px_-26px_rgba(27,19,64,.7)] ${className}`}>
      <div className="flex gap-1.5 px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FB7185]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#34D399]" />
      </div>
      <pre className="px-4 pb-4 text-left font-mono text-[12px] leading-5 text-[#C4B5FD]">
        <span className="text-[#F9A8D4]">const</span> app = <span className="text-[#67E8F9]">build</span>({"{"}
        {"\n"}  platform: <span className="text-[#FDE68A]">&quot;web + mobile&quot;</span>,
        {"\n"}  launch: <span className="text-[#FDE68A]">&quot;in stages&quot;</span>
        {"\n"}
        {"}"});
      </pre>
    </div>
  );
}

/** Overlapping cluster used under inner-page heroes. */
export function TechCluster() {
  return (
    <div className="relative mx-auto mt-12 grid max-w-5xl grid-cols-2 items-end gap-4 sm:grid-cols-3 sm:gap-6">
      <div className="hidden sm:block">
        <CodeCard />
      </div>
      <div className="grid gap-4">
        <BarCard />
        <RingCard className="hidden sm:flex" />
      </div>
      <div className="grid gap-4">
        <LineCard />
        <div className="hidden h-24 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#F9A8D4] sm:block" />
      </div>
    </div>
  );
}
