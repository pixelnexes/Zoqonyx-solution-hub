import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
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
    title: "Zoqonyx Solution Hub - Free Online Tools Platform",
    description: "Every tool you need. Zero cost. Fast, private, and accessible.",
    siteName: "Zoqonyx Solution Hub",
    images: [
      {
        url: "/logo/zoqonyx-logo.png",
        width: 1200,
        height: 630,
        alt: "Zoqonyx Solution Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zoqonyx Solution Hub - Free Online Tools Platform",
    description: "Every tool you need. Zero cost. Fast, private, and accessible.",
    images: ["/logo/zoqonyx-logo.png"],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
