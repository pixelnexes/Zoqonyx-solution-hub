"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Horizontal scroll-snap slider with previous/next buttons. Works with touch, mouse wheel and keyboard. */
export function Slider({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [edge, setEdge] = React.useState({ start: true, end: false });

  const update = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);

  React.useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const move = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const step = Math.max(280, Math.round(el.clientWidth * 0.8));
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const btn =
    "w-11 h-11 rounded-full bg-white border border-[#E5E2DC] shadow-md flex items-center justify-center text-[#161513] hover:bg-[#D63A14] hover:text-white hover:border-[#D63A14] disabled:opacity-40 disabled:pointer-events-none transition-colors";

  return (
    <div className="relative">
      <div className="flex justify-end gap-2 mb-3">
        <button type="button" aria-label={`Previous ${label}`} className={btn} onClick={() => move(-1)} disabled={edge.start}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button type="button" aria-label={`Next ${label}`} className={btn} onClick={() => move(1)} disabled={edge.end}>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div ref={ref} className="zq-slider" role="region" aria-label={label} tabIndex={0}>
        {children}
      </div>
    </div>
  );
}
