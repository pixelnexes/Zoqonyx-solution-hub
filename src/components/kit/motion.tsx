"use client";

import * as React from "react";

function prefersReduced() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Photo that drifts slowly as the page scrolls (transform only). Static with reduced motion. */
export function ParallaxImg({ src, alt = "", className = "", speed = 0.12 }: { src: string; alt?: string; className?: string; speed?: number }) {
  const wrap = React.useRef<HTMLDivElement>(null);
  const img = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (prefersReduced()) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const w = wrap.current;
      const i = img.current;
      if (!w || !i) return;
      const r = w.getBoundingClientRect();
      if (r.bottom < -100 || r.top > window.innerHeight + 100) return;
      const offset = (r.top + r.height / 2 - window.innerHeight / 2) * -speed;
      i.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.18)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={wrap} className={`overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={img} src={src} alt={alt} loading="lazy" className="h-full w-full object-cover will-change-transform" style={{ transform: "scale(1.18)" }} />
    </div>
  );
}

/** Full-bleed photo behind a banner, with a dark overlay so the text stays readable. */
export function BannerPhoto({ src }: { src: string }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <ParallaxImg src={src} className="h-full w-full" speed={0.18} />
      <div className="absolute inset-0 bg-[#0B1F3A]/80" />
    </div>
  );
}

/** Thin bar at the top of the page showing how far you have scrolled. */
export function ScrollProgress() {
  const bar = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (prefersReduced()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(1, window.scrollY / h) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div aria-hidden="true" className="fixed left-0 top-0 z-50 h-[3px] w-full pointer-events-none">
      <div ref={bar} className="h-full w-full origin-left bg-[#F2A81D]" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}

/** Number that counts up the first time it scrolls into view. */
export function CountUp({ to, suffix = "", duration = 1400 }: { to: number; suffix?: string; duration?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [val, setVal] = React.useState(to);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced() || !("IntersectionObserver" in window)) return;
    setVal(0);
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const step = (t: number) => {
          const k = Math.min(1, (t - t0) / duration);
          setVal(Math.round(to * (1 - Math.pow(1 - k, 3))));
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}
