/** Brand loader: the mark and one thin bar. Pure CSS. */
export function ZLoader() {
  return (
    <div className="zq-zl" role="status" aria-label="Loading">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo/zoqonyx-mark-v2.svg" alt="" width={56} height={56} />
      <span className="zq-zl-bar">
        <i />
      </span>
    </div>
  );
}

/** Splash shown on a full page load. Fades itself out with CSS, so the page content stays in the HTML for search engines. */
export function SplashLoader() {
  return (
    <div className="zq-splash" aria-hidden="true">
      <ZLoader />
    </div>
  );
}
