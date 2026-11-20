/** Brand loader: the Z mark draws itself while a ring orbits it. Pure CSS, no JavaScript. */
export function ZLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="zq-zl" role="status" aria-live="polite">
      <div className="zq-zl-mark">
        <svg viewBox="0 0 64 64" width="96" height="96" aria-hidden="true">
          <defs>
            <linearGradient id="zl-g" x1="6" y1="2" x2="58" y2="62" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#8B5CF6" />
              <stop offset="1" stopColor="#4C1D95" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" rx="16" fill="url(#zl-g)" />
          <path className="zq-zl-z" d="M18 20h27L19 44h27" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" pathLength="100" />
          <circle className="zq-zl-dot" cx="49" cy="16" r="4.5" fill="#F9A8D4" />
        </svg>
        <span className="zq-zl-ring" />
      </div>
      <p className="zq-zl-text">{label}</p>
    </div>
  );
}

/** Splash shown on a full page load. Fades itself out with CSS, so the page content stays in the HTML for search engines. */
export function SplashLoader() {
  return (
    <div className="zq-splash" aria-hidden="true">
      <ZLoader label="Zoqonyx" />
    </div>
  );
}
