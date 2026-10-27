import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { getSiteSettings } from "@/lib/settings";
import { SiteSettingsProvider } from "@/components/providers/site-settings-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
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
    icon: "/icons/icon.png",
    shortcut: "/icons/icon.png",
    apple: "/icons/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zoqonyx.com",
    title: "Zoqonyx Solution Hub – Free Online Tools Platform",
    description: "37+ free client-side tools. Compress images, format JSON, generate QR codes & CSS styles. Zero uploads, 100% private.",
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
    description: "37+ free client-side tools. Compress images, format JSON, generate QR codes & CSS styles. Zero uploads, 100% private.",
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
  const iconUrl = settings.icon_path || "/logo/zoqonyx-icon.png";

  return (
    <html lang="en" className={`light ${inter.variable} ${plusJakarta.variable}`}>
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
