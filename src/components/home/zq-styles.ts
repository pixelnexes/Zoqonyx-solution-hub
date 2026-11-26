// Shared tokens, states and motion for pages that use the tool drawer
// (homepage and /tools). Wrap the page in an element with class "zq-home".
//
// Motion: one page-load sequence (headline, search, categories) and feedback
// on hover and search. The headline only moves (no fade), so it still counts
// for Largest Contentful Paint right away. Everything stops for reduced motion.
export const ZQ_CSS = `
.zq-home {
  --zq-ink: #14213D;
  --zq-muted: #4A5568;
  --zq-canvas: #F3F5F8;
  --zq-line: #D5DCE4;
  --zq-teal: #B02E0E;
  --zq-label: #F2C230;
  --zq-ease: cubic-bezier(.2,.7,.2,1);
  background: var(--zq-canvas);
  color: var(--zq-ink);
}
.zq-home .zq-strip { background: var(--zq-label); box-shadow: inset 0 -3px 0 rgba(20,33,61,0.18); transition: box-shadow 160ms ease; }
.zq-home .zq-strip:focus-within { outline: 3px solid var(--zq-ink); outline-offset: 3px; box-shadow: inset 0 -3px 0 rgba(20,33,61,0.35); }
.zq-home .zq-strip input::placeholder { color: rgba(20,33,61,0.72); }
.zq-home .zq-strip input::-webkit-search-cancel-button { display: none; }
.zq-home .zq-link { color: var(--zq-teal); text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }
.zq-home .zq-link:hover { text-decoration-thickness: 2px; }
.zq-home .zq-focus:focus-visible { outline: 2px solid var(--zq-ink); outline-offset: 2px; background: var(--zq-label); color: var(--zq-ink); }

/* Tool rows: a yellow tab slides in on hover, like a label on a drawer */
.zq-home .zq-row { position: relative; transition: background-color 150ms ease, padding-left 150ms var(--zq-ease); }
.zq-home .zq-row::before {
  content: ""; position: absolute; left: 0; top: 22%; bottom: 22%; width: 3px;
  background: var(--zq-label); transform: scaleY(0); transform-origin: center;
  transition: transform 150ms var(--zq-ease);
}
.zq-home .zq-row:hover { background: #FFFFFF; padding-left: 10px; }
.zq-home .zq-row:hover::before { transform: scaleY(1); }
.zq-home .zq-row .zq-row-icon { transition: color 150ms ease; }
.zq-home .zq-row:hover .zq-row-icon { color: var(--zq-ink); }

/* Page-load sequence */
@keyframes zq-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
@keyframes zq-rise-solid { from { transform: translateY(10px); } to { transform: none; } }
.zq-home .zq-reveal { animation: zq-rise 560ms var(--zq-ease) both; animation-delay: var(--zq-delay, 0ms); }
.zq-home .zq-reveal-solid { animation: zq-rise-solid 560ms var(--zq-ease) both; }

/* Search results appear as you type */
@keyframes zq-fade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
.zq-home .zq-fade { animation: zq-fade 180ms ease-out both; }

@media (prefers-reduced-motion: reduce) {
  .zq-home *, .zq-home *::before { animation: none !important; transition: none !important; }
}
`;
