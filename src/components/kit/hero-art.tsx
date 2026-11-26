import * as React from "react";

// Original hero illustration: a browser window, a phone and a PDF page drifting
// around a glowing core. Pure SVG/HTML shapes, no stock images. Decorative only.

export function HeroArt() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] aspect-[1.05/1]" aria-hidden="true">
      {/* glow */}
      <div className="absolute inset-[8%] rounded-full zq-pulse" style={{ background: "radial-gradient(circle, rgba(214,58,20,.65), rgba(196,181,253,.15) 60%, transparent 70%)", filter: "blur(10px)" }} />

      {/* browser window */}
      <div className="zq-float absolute left-[2%] top-[8%] w-[66%] rounded-2xl overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,.7)] border border-white/15 bg-[#161513]" style={{ ["--r" as string]: "-3deg" }}>
        <div className="flex items-center gap-1.5 px-3 py-2.5 bg-white/[0.08] border-b border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C8452D]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#F2A81D]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF8A66]" />
          <span className="ml-3 h-4 flex-1 rounded-full bg-white/10" />
        </div>
        <div className="p-4 font-mono text-[11px] sm:text-xs leading-relaxed text-[#E5E2DC]">
          <p>
            <span className="text-[#FFA487]">const</span> app = <span className="text-[#F2A81D]">build</span>({"{"}
          </p>
          <p className="pl-4">
            platform: <span className="text-[#FF8A66]">&quot;web + mobile&quot;</span>,
          </p>
          <p className="pl-4">
            launch: <span className="text-[#FF8A66]">&quot;in stages&quot;</span>,
          </p>
          <p>{"}"});</p>
          <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-[72%] rounded-full" style={{ background: "#161513" }} />
          </div>
        </div>
      </div>

      {/* phone */}
      <div className="zq-float absolute right-[4%] top-[22%] w-[30%] rounded-[1.6rem] border-[3px] border-white/25 bg-[#161513] p-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,.75)]" style={{ ["--d" as string]: "-2s", ["--r" as string]: "4deg" }}>
        <div className="mx-auto mb-2 h-1.5 w-8 rounded-full bg-white/25" />
        <div className="rounded-2xl p-2.5 space-y-2" style={{ background: "#161513" }}>
          <div className="h-2 w-2/3 rounded-full bg-white/80" />
          <div className="h-12 rounded-lg bg-white/25" />
          <div className="grid grid-cols-2 gap-1.5">
            <div className="h-8 rounded-md bg-white/30" />
            <div className="h-8 rounded-md bg-[#F2A81D]" />
          </div>
        </div>
      </div>

      {/* PDF card */}
      <div className="zq-float absolute left-[14%] bottom-[6%] w-[30%] rounded-xl bg-white p-3 shadow-[0_24px_50px_-16px_rgba(0,0,0,.7)]" style={{ ["--d" as string]: "-4s", ["--r" as string]: "-5deg" }}>
        <div className="flex items-center gap-2">
          <span className="grid place-items-center h-8 w-8 rounded-lg text-white text-[10px] font-semibold" style={{ background: "#161513" }}>
            PDF
          </span>
          <span className="h-2 w-12 rounded-full bg-[#E5E2DC]" />
        </div>
        <div className="mt-2.5 space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-[#E5E2DC]" />
          <div className="h-1.5 w-5/6 rounded-full bg-[#E5E2DC]" />
          <div className="h-1.5 w-2/3 rounded-full bg-[#E5E2DC]" />
        </div>
      </div>

      {/* chart card */}
      <div className="zq-float absolute right-[8%] bottom-[8%] w-[34%] rounded-xl border border-white/15 bg-[#161513]/90 p-3 shadow-[0_24px_50px_-16px_rgba(0,0,0,.7)]" style={{ ["--d" as string]: "-1s", ["--r" as string]: "3deg" }}>
        <div className="h-2 w-10 rounded-full bg-white/40" />
        <svg viewBox="0 0 120 50" className="mt-2 w-full" fill="none">
          <polyline points="2,42 22,30 42,36 62,18 82,24 118,6" stroke="#FFA487" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="2,46 30,40 60,44 90,32 118,34" stroke="#F2A81D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity=".9" />
        </svg>
      </div>
    </div>
  );
}
