"use client";

import * as React from "react";

/** Fades a block in once it scrolls into view. Content is visible without JavaScript. */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [armed, setArmed] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    // Only hide items that are below the fold, so nothing flashes on load.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      setVisible(true);
      return;
    }
    setArmed(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref as React.Ref<HTMLElement>}
      className={`${armed ? "zq-reveal" : ""} ${visible ? "is-visible" : ""} ${className}`}
      style={{ ["--d" as string]: `${delay}ms` }}
    >
      {children}
    </Component>
  );
}
