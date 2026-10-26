import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Common legacy aliases
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/categories", destination: "/tools", permanent: true },
      { source: "/category", destination: "/tools", permanent: true },
      { source: "/tool/:slug", destination: "/tools/:slug", permanent: true },

      // Legacy / renamed tool slugs to canonical URLs
      { source: "/tools/object-remover", destination: "/tools/object-remover-photo", permanent: true },
      { source: "/tools/object-remover-ai", destination: "/tools/object-remover-photo", permanent: true },
      { source: "/tools/magic-object-remover", destination: "/tools/object-remover-photo", permanent: true },
      { source: "/tools/watermark-remover", destination: "/tools/ai-watermark-remover", permanent: true },
      { source: "/tools/open-graph-generator", destination: "/tools/open-graph-preview", permanent: true },
      { source: "/tools/ssl-certificate-checker", destination: "/tools/ssl-checker", permanent: true },
      { source: "/tools/video-compressor-online", destination: "/tools/video-compressor-advanced", permanent: true },
      { source: "/tools/video-to-gif-converter", destination: "/tools/video-to-gif-advanced", permanent: true },
      { source: "/tools/screen-recorder-pro", destination: "/tools/screen-recorder", permanent: true },
      { source: "/tools/pdf-ocr-converter", destination: "/tools/pdf-ocr", permanent: true },
      { source: "/tools/ai-grammar-checker", destination: "/tools/grammar-checker-advanced", permanent: true },
      { source: "/tools/ai-code-explainer", destination: "/tools/ai-content-writer", permanent: true },
    ];
  },
};

export default nextConfig;
