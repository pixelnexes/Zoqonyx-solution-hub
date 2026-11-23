import { SplashLoader } from "@/components/kit/z-loader";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import "./zq.css";
import { ThemeProvider } from "@/components/theme-provider";
import { getSiteSettings } from "@/lib/settings";
import { SiteSettingsProvider } from "@/components/providers/site-settings-provider";

// Fonts are bundled with the site (src/app/fonts) so builds never depend on Google's servers.
// The CSS variable keeps its old name so tailwind.config.ts (fontFamily.sans / heading) needs no change.
const siteFont = localFont({
  src: [{ path: "./fonts/schibsted-grotesk.woff2", weight: "400 900", style: "normal" }],
  variable: "--font-poppins",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

// Display face for headlines (body keeps Schibsted Grotesk).
const displayFont = localFont({
  src: [{ path: "./fonts/bricolage-grotesque.woff2", weight: "600 800", style: "normal" }],
  variable: "--font-display",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://zoqonyx.com"),
  title: {
    default: "Zoqonyx Solution Hub | Free Online Tools Platform",
    template: "%s | Zoqonyx",
  },
  alternates: {
    canonical: "https://zoqonyx.com",
  },
  description:
    "Empowering creators, developers, designers, and marketers with fast, privacy-first, 100% free digital tools. Zero installation, zero cost.",
  keywords: [
    "free online tools",
    "image compressor",
    "css generator",
    "json formatter",
    "qr code generator",
    "developer utilities",
    "zoqonyx",
  ],
  authors: [{ name: "Zawwar Ahmed" }, { name: "Newix Tech Solutions" }],
  creator: "Zawwar Ahmed",
  publisher: "Newix Tech Solutions",
  icons: {
    icon: "/logo/zoqonyx-mark.svg",
    shortcut: "/logo/zoqonyx-mark.svg",
    apple: "/icons/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zoqonyx.com",
    title: "Zoqonyx Solution Hub – Free Online Tools Platform",
    description: "146 free online tools. Compress images, merge PDFs, format JSON and more. Most run in your browser, with no sign-up.",
    siteName: "Zoqonyx Solution Hub",
    images: [
      {
        url: "https://zoqonyx.com/logo/zoqonyx-og.png",
        width: 1200,
        height: 630,
        alt: "Zoqonyx Solution Hub - Free Online Tools Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zoqonyx Solution Hub – Free Online Tools Platform",
    description: "146 free online tools. Compress images, merge PDFs, format JSON and more. Most run in your browser, with no sign-up.",
    images: ["https://zoqonyx.com/logo/zoqonyx-og.png"],
    creator: "@zoqonyx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-PX8V01HHCK";
  const settings = await getSiteSettings();
  const iconUrl = "/logo/zoqonyx-mark.svg";

  return (
    // next-themes sets the theme class and color-scheme on <html> before React hydrates.
    <html lang="en" className={`light ${siteFont.variable} ${displayFont.variable} font-sans`} suppressHydrationWarning>
      <head>
        <link rel="icon" href={iconUrl} />
        <link rel="shortcut icon" href={iconUrl} />
        <link rel="apple-touch-icon" href={iconUrl} />
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground flex flex-col">
        <SplashLoader />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SiteSettingsProvider initialSettings={settings}>
            {children}
          </SiteSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
