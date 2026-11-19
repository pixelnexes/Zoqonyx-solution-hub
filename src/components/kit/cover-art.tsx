import * as React from "react";

// Original, copyright-free cover artwork generated from the title, so every blog
// post gets a distinct image without stock photos. Pure SVG, no external files.

const PALETTES: [string, string, string][] = [
  ["#7C3AED", "#C4B5FD", "#F2A81D"],
  ["#3B82F6", "#C4B5FD", "#F2A81D"],
  ["#1B1340", "#7C3AED", "#F2A81D"],
  ["#A9351F", "#D8694F", "#F2A81D"],
  ["#5B21B6", "#A78BFA", "#F6BC4A"],
];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function CoverArt({ seed, className = "" }: { seed: string; className?: string }) {
  const h = hash(seed);
  const [a, b, c] = PALETTES[h % PALETTES.length];
  const id = `ca-${h}`;
  const r1 = 60 + (h % 70);
  const r2 = 40 + ((h >> 3) % 60);
  const x1 = 40 + ((h >> 5) % 30);
  const x2 = 10 + ((h >> 7) % 25);
  const dots = Array.from({ length: 24 }, (_, i) => ({
    x: 18 + (i % 8) * 8,
    y: 62 + Math.floor(i / 8) * 8,
  }));
  return (
    <svg viewBox="0 0 400 220" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice" className={className}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor="#1B1340" />
        </linearGradient>
        <radialGradient id={`${id}-r`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={b} stopOpacity="0.95" />
          <stop offset="1" stopColor={b} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="220" fill={a} />
      <circle cx={`${x1 * 4}`} cy="60" r={r1} fill={`url(#${id}-r)`} />
      <circle cx={`${x2 * 4}`} cy="190" r={r2} fill={c} opacity="0.55" />
      <g fill="#fff" opacity="0.5">
        {dots.map((d, i) => (
          <circle key={i} cx={d.x * 4 - 20} cy={d.y} r="2.2" />
        ))}
      </g>
      <rect x="250" y="40" width="120" height="86" rx="12" fill="#fff" opacity="0.14" />
      <rect x="264" y="56" width="62" height="8" rx="4" fill="#fff" opacity="0.7" />
      <rect x="264" y="74" width="92" height="6" rx="3" fill="#fff" opacity="0.45" />
      <rect x="264" y="88" width="78" height="6" rx="3" fill="#fff" opacity="0.45" />
      <rect x="264" y="102" width="40" height="12" rx="6" fill={c} />
    </svg>
  );
}
