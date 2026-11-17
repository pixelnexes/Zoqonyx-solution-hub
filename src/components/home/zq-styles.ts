// Shared tokens and states for pages that use the tool drawer
// (homepage and /tools). Wrap the page in an element with class "zq-home".
export const ZQ_CSS = `
.zq-home {
  --zq-ink: #14213D;
  --zq-muted: #4A5568;
  --zq-canvas: #F3F5F8;
  --zq-line: #D5DCE4;
  --zq-teal: #0F766E;
  --zq-label: #F2C230;
  background: var(--zq-canvas);
  color: var(--zq-ink);
}
.zq-home .zq-strip { background: var(--zq-label); box-shadow: inset 0 -3px 0 rgba(20,33,61,0.18); }
.zq-home .zq-strip:focus-within { outline: 3px solid var(--zq-ink); outline-offset: 3px; }
.zq-home .zq-strip input::placeholder { color: rgba(20,33,61,0.72); }
.zq-home .zq-strip input::-webkit-search-cancel-button { display: none; }
.zq-home .zq-link { color: var(--zq-teal); text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }
.zq-home .zq-link:hover { text-decoration-thickness: 2px; }
.zq-home .zq-row:hover { background: #FFFFFF; }
.zq-home .zq-focus:focus-visible { outline: 2px solid var(--zq-ink); outline-offset: 2px; background: var(--zq-label); color: var(--zq-ink); }
@media (prefers-reduced-motion: reduce) { .zq-home * { transition: none !important; } }
`;
