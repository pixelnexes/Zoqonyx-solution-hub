"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sliders,
  ShoppingBag,
  Share2,
  Search,
  Layers,
  Edit3,
} from "lucide-react";

type ToneType = "persuasive" | "luxury" | "minimalist" | "playful" | "technical" | "urgent";
type FormatType = "shopify" | "amazon" | "social" | "seo";

interface ProductPreset {
  name: string;
  category: string;
  features: string;
  audience: string;
  tone: ToneType;
}

const PRESETS: Record<string, ProductPreset> = {
  headphones: {
    name: "AuraWave Pro ANC Headphones",
    category: "Consumer Electronics / Audio",
    features: "Active Noise Cancellation up to 42dB\n50-hour battery life with fast charge (10 min = 5 hrs)\nCustom 40mm beryllium acoustic drivers\nUltra-soft memory foam protein leather earcups\nBluetooth 5.3 multipoint pairing",
    audience: "Remote professionals, frequent travelers, and audiophiles",
    tone: "luxury",
  },
  matcha: {
    name: "Uji Ceremonial Grade Matcha Powder",
    category: "Organic Food & Wellness",
    features: "100% first-harvest shade-grown green tea leaves from Kyoto, Japan\nStone-ground into micro-fine vibrant jade powder\nRich in L-theanine and clean antioxidant energy without jitters\nZero sugar, non-GMO, USDA Organic certified\nSmooth umami finish with zero bitterness",
    audience: "Health enthusiasts, clean-eating advocates, and coffee substituters",
    tone: "persuasive",
  },
  lamp: {
    name: "Lumina Minimalist Ergonomic Desk Lamp",
    category: "Home Office & Lighting",
    features: "CRI >98 true-color LED array with flicker-free technology\nStepless touch dimming from 2700K warm to 6500K daylight\nAerospace-grade matte anodized aluminum construction\nIntegrated 15W Qi wireless fast-charging base\nAuto-dimming ambient light sensor",
    audience: "Architects, designers, programmers, and modern desk minimalists",
    tone: "minimalist",
  },
};

interface GeneratedVariant {
  id: number;
  angle: string;
  headline: string;
  body: string;
  bullets: string[];
  specs?: string;
  cta: string;
  metaTitle?: string;
  metaDescription?: string;
}

export function AiProductDescriptionTool() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [features, setFeatures] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState<ToneType>("persuasive");
  const [format, setFormat] = useState<FormatType>("shopify");
  const [isGenerating, setIsGenerating] = useState(false);
  const [variants, setVariants] = useState<GeneratedVariant[]>([]);
  const [copiedId, setCopiedId] = useState<number | string | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  const applyPreset = (key: keyof typeof PRESETS) => {
    const p = PRESETS[key];
    setProductName(p.name);
    setCategory(p.category);
    setFeatures(p.features);
    setAudience(p.audience);
    setTone(p.tone);
  };

  const clearForm = () => {
    setProductName("");
    setCategory("");
    setFeatures("");
    setAudience("");
    setVariants([]);
  };

  const handleGenerate = () => {
    if (!productName.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      const parsedFeatures = features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      const bulletList =
        parsedFeatures.length > 0
          ? parsedFeatures
          : [
              "Engineered with premium durable materials for long-lasting performance",
              "Ergonomic, user-centric design that seamlessly fits your daily routine",
              "Backed by our 100% satisfaction guarantee and dedicated support",
            ];

      const audienceStr = audience.trim() || "modern, discerning buyers";

      let generated: GeneratedVariant[] = [];

      if (format === "shopify") {
        generated = [
          {
            id: 1,
            angle: "Emotional & Lifestyle Hook",
            headline: `Elevate Your Daily Ritual with ${productName}`,
            body: `Designed specifically for ${audienceStr}, the ${productName} seamlessly bridges high-tier craft with effortless day-to-day usability. Whether you're conquering a busy workday or unwinding at home, every contour and specification has been calibrated to deliver unmatched satisfaction. Say goodbye to compromises and step into refined excellence.`,
            bullets: bulletList.map((f, i) => {
              const prefixes = [
                "ENGINEERED FOR EXCELLENCE:",
                "INTUITIVE INTEGRATION:",
                "BUILT TO LAST:",
                "SUPERIOR COMFORT:",
                "VERIFIED PERFORMANCE:",
              ];
              return `${prefixes[i % prefixes.length]} ${f}.`;
            }),
            cta: `Ready to upgrade your standard? Click Add to Cart now and experience the ${productName} difference with free insured shipping.`,
            metaTitle: `${productName} | Official Premium Collection`,
            metaDescription: `Discover the all-new ${productName}. Built for ${audienceStr} with exceptional performance and timeless design. Order yours today!`,
          },
          {
            id: 2,
            angle: "Performance & Feature Focused",
            headline: `${productName}: Precision Engineering Meets Unrivaled Durability`,
            body: `Stop settling for products that underdeliver. The ${productName} brings industrial-grade innovation directly into your hands. Tested against rigorous real-world benchmarks, it provides consistent, uncompromising results for demanding ${audienceStr}.`,
            bullets: bulletList.map((f) => `• ${f} - Optimized for speed, reliability, and peak efficiency`),
            cta: `Stock is limited due to precision manufacturing runs. Claim your ${productName} today before current batches sell out.`,
            metaTitle: `Buy ${productName} - High Performance ${category || "Gear"}`,
            metaDescription: `Shop the high-precision ${productName}. Featuring ${bulletList[0] || "industry-leading design"}. Ships within 24 hours.`,
          },
          {
            id: 3,
            angle: "Problem-Solver / High Conversion",
            headline: `Finally, a ${category || "Solution"} That Actually Does What It Promises`,
            body: `Most alternatives on the market cut corners where it matters most. ${productName} was created to solve the frustrations encountered by ${audienceStr}. We eliminated the clutter, refined the core experience, and focused on delivering measurable, reliable value every single day.`,
            bullets: bulletList.map((f) => `✔ ${f} - zero hassles, pure performance`),
            cta: `Join thousands of satisfied customers who have made the switch to ${productName}. 30-day risk-free trial included.`,
            metaTitle: `${productName} - The Smart Choice for ${audienceStr}`,
            metaDescription: `The definitive ${productName}. Solve your everyday challenges with top-tier features, guaranteed durability, and 5-star customer reviews.`,
          },
        ];
      } else if (format === "amazon") {
        generated = [
          {
            id: 1,
            angle: "Amazon 5-Point Keyword Optimized",
            headline: `${productName.toUpperCase()} - PREMIUM ${category.toUpperCase() || "ACCESSORY"} FOR ${audienceStr.toUpperCase()}`,
            body: `[5 HIGH-CONVERTING BULLET POINTS READY FOR SELLER CENTRAL]`,
            bullets: [
              `💎 NEXT-GEN CRAFTSMANSHIP: Engineered specifically for ${audienceStr}. The ${productName} combines cutting-edge architecture with sleek aesthetics for top-tier reliability.`,
              `⚡ INDUSTRY-LEADING CAPABILITY: ${bulletList[0] || "Premium construction delivers seamless reliability and flawless everyday operation."}`,
              `🛡️ UNCOMPROMISING DURABILITY: ${bulletList[1] || "Built with aerospace-grade resilience to withstand heavy daily use without degradation."}`,
              `🎯 INTUITIVE & EFFORTLESS SETUP: ${bulletList[2] || "Plug-and-play design allows immediate deployment right out of the box with zero learning curve."}`,
              `⭐ 100% SATISFACTION GUARANTEED: We stand behind every unit with our dedicated 24/7 customer care team and comprehensive warranty. Add to cart with complete confidence!`,
            ],
            cta: `Add to Cart to secure your promotional launch pricing today!`,
          },
          {
            id: 2,
            angle: "Amazon Technical & Spec Heavy",
            headline: `${productName} - Advanced Specifications & Benchmark Compliance`,
            body: `[TECHNICAL SELLER CENTRAL COPY FOR HIGH-TICKET PRODUCTS]`,
            bullets: bulletList.slice(0, 5).map((f, i) => {
              const headers = [
                "MAXIMUM PERFORMANCE",
                "PRECISION CALIBRATION",
                "THERMAL & MATERIAL STABILITY",
                "UNIVERSAL COMPATIBILITY",
                "CERTIFIED QUALITY ASSURANCE",
              ];
              return `✅ ${headers[i % headers.length]}: ${f}. Built to meet the highest commercial standards.`;
            }),
            cta: `Order now with Amazon Prime 1-day delivery.`,
          },
        ];
      } else if (format === "social") {
        generated = [
          {
            id: 1,
            angle: "Instagram / TikTok Viral Script",
            headline: `POV: You just found the ultimate ${category || "upgrade"} ✨`,
            body: `If you're like me and constantly looking for gear that actually lives up to the hype, you NEED to check out the ${productName} 🔥\n\nHere is why everyone in the community is obsessed:\n${bulletList
              .slice(0, 3)
              .map((b) => `✨ ${b}`)
              .join("\n")}\n\nTag a friend who needs this in their life right now 👇`,
            bullets: [
              "#MustHave #UpgradeYourLife #ProductivityHacks #TechGear #TikTokMadeMeBuyIt #DailyEssentials",
            ],
            cta: `Link in bio to shop the limited drop before it's gone! 🛒`,
          },
          {
            id: 2,
            angle: "Facebook / LinkedIn Direct Response Ad",
            headline: `Attention ${audienceStr}: Stop settling for second best.`,
            body: `When was the last time a product actually exceeded your expectations?\n\nThe ${productName} was engineered to eliminate standard headaches. Featuring:\n${bulletList
              .map((b) => `👉 ${b}`)
              .join("\n")}\n\nOver 10,000+ units delivered worldwide. Tap the button below to see the reviews for yourself.`,
            bullets: [],
            cta: `👉 Tap 'Shop Now' to get 15% OFF your first order today.`,
          },
        ];
      } else {
        // SEO snippet format
        generated = [
          {
            id: 1,
            angle: "Rank #1 Google Search Snippet",
            headline: `${productName} - Official Review, Specs & Best Price`,
            body: `Looking for the best ${category || "product"}? Here is your complete guide to ${productName}. Designed for ${audienceStr}, it delivers unmatched performance, robust features, and proven value. Read full specs, verified reviews, and check current stock.`,
            bullets: bulletList,
            cta: `Visit Zoqonyx to compare specs and buy with verified buyer protection.`,
            metaTitle: `${productName} (${new Date().getFullYear()} Review) | Official Buyer's Guide`,
            metaDescription: `Discover why ${productName} is the #1 choice for ${audienceStr}. Includes ${bulletList[0] || "top-tier features"}, full warranty, and verified buyer reviews.`,
          },
        ];
      }

      setVariants(generated);
      setActiveTab(0);
      setIsGenerating(false);
    }, 400);
  };

  const copyToClipboard = (text: string, id: number | string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatVariantText = (v: GeneratedVariant) => {
    let out = `## ${v.headline}\n\n${v.body}\n\n`;
    if (v.bullets && v.bullets.length > 0) {
      out += `### Key Features & Benefits:\n${v.bullets.join("\n")}\n\n`;
    }
    if (v.cta) {
      out += `### Call to Action:\n${v.cta}\n\n`;
    }
    if (v.metaTitle) {
      out += `### SEO Title Tag:\n${v.metaTitle}\n\n### Meta Description:\n${v.metaDescription}\n`;
    }
    return out;
  };

  const downloadAllMarkdown = () => {
    const content = `# AI Generated Product Descriptions: ${productName}
**Category**: ${category || "General"}
**Target Audience**: ${audience || "Discerning Customers"}
**Tone**: ${tone}
**Format**: ${format.toUpperCase()}
**Generated by**: Zoqonyx AI Product Description Studio

---

${variants
  .map(
    (v, i) => `## Variant ${i + 1} (${v.angle})
${formatVariantText(v)}`
  )
  .join("\n---\n\n")}`;

    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${productName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-descriptions.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold uppercase border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Client-Side Copywriting Studio
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
          Product Description Generator for Shopify & Amazon
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          Client-side algorithmic copy generator. Craft targeted product copy for Shopify, Amazon 5-point bullets, social ad scripts, and Google search snippets with 100% privacy and zero subscription fees.
        </p>
      </div>

      {/* Preset Quick Fill */}
      <div className="bg-slate-100 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-500" /> Quick Presets:
        </span>
        <button
          onClick={() => applyPreset("headphones")}
          className="px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-md border border-slate-200 dark:border-slate-600 font-medium transition"
        >
          🎧 ANC Headphones
        </button>
        <button
          onClick={() => applyPreset("matcha")}
          className="px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-md border border-slate-200 dark:border-slate-600 font-medium transition"
        >
          🍵 Ceremonial Matcha
        </button>
        <button
          onClick={() => applyPreset("lamp")}
          className="px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-md border border-slate-200 dark:border-slate-600 font-medium transition"
        >
          💡 Minimalist Lamp
        </button>
        <button
          onClick={clearForm}
          className="ml-auto text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Main Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-5 space-y-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-500" /> Product Parameters
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. AuraWave Pro Wireless Headphones"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category / Industry
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Consumer Electronics / Wellness"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Key Features & Specs (one per line)
            </label>
            <textarea
              rows={4}
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="Active Noise Cancellation&#10;50-hour battery life&#10;Beryllium acoustic drivers&#10;Water resistant IPX5"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Audience
            </label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="e.g. Remote developers, gym goers, eco-conscious moms"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tone of Voice
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as ToneType)}
                className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-medium"
              >
                <option value="persuasive">Persuasive / High-Converting</option>
                <option value="luxury">Luxury / Sophisticated</option>
                <option value="minimalist">Minimalist / Clean</option>
                <option value="playful">Playful / Casual</option>
                <option value="technical">Technical / Spec-Driven</option>
                <option value="urgent">Urgent / Promo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Format Channel
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as FormatType)}
                className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-medium"
              >
                <option value="shopify">🛍️ E-Commerce / Shopify</option>
                <option value="amazon">📦 Amazon 5 Bullets</option>
                <option value="social">📱 Social Media Ad Copy</option>
                <option value="seo">🔍 Google SEO Snippet</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!productName.trim() || isGenerating}
            className="w-full py-3 bg-[#6D28D9] hover:bg-[#5B21B6] disabled:opacity-50 text-white rounded-xl font-semibold text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" /> Crafting Copy...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Generate Product Descriptions
              </>
            )}
          </button>
        </div>

        {/* Right Output: Creative Variants */}
        <div className="lg:col-span-7 space-y-4">
          {variants.length === 0 ? (
            <div className="h-full min-h-[420px] bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-3">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
                No Descriptions Generated Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                Enter your product name and features on the left, or select one of the quick presets to generate high-converting copy variants instantly.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
              {/* Variants Header Tabs */}
              <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/40 p-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {variants.map((v, idx) => (
                    <button
                      key={v.id}
                      onClick={() => setActiveTab(idx)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                        activeTab === idx
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      Variant {idx + 1}: {v.angle}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        formatVariantText(variants[activeTab]),
                        variants[activeTab].id
                      )
                    }
                    className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-md font-medium transition flex items-center gap-1"
                  >
                    {copiedId === variants[activeTab].id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Variant
                      </>
                    )}
                  </button>
                  <button
                    onClick={downloadAllMarkdown}
                    className="px-2.5 py-1 text-xs bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-md font-medium transition flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Export .md
                  </button>
                </div>
              </div>

              {/* Active Variant Content */}
              {variants[activeTab] && (
                <div className="p-6 space-y-5 text-left">
                  {/* Headline */}
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-blue-600 dark:text-blue-400">
                      Product Headline
                    </span>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-1">
                      {variants[activeTab].headline}
                    </h3>
                  </div>

                  {/* Body Copy */}
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                      Primary Description Copy
                    </span>
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 mt-1 whitespace-pre-line">
                      {variants[activeTab].body}
                    </p>
                  </div>

                  {/* Bullets */}
                  {variants[activeTab].bullets && variants[activeTab].bullets.length > 0 && (
                    <div>
                      <span className="text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                        Feature & Benefit Bullets
                      </span>
                      <ul className="mt-2 space-y-1.5">
                        {variants[activeTab].bullets.map((b, bIdx) => (
                          <li
                            key={bIdx}
                            className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800"
                          >
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Call to Action */}
                  {variants[activeTab].cta && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                      <span className="text-[10px] font-semibold uppercase text-amber-700 dark:text-amber-400">
                        Conversion Call-To-Action (CTA)
                      </span>
                      <p className="text-xs font-semibold text-amber-900 dark:text-amber-300 mt-0.5">
                        {variants[activeTab].cta}
                      </p>
                    </div>
                  )}

                  {/* SEO Metadata if present */}
                  {variants[activeTab].metaTitle && (
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                      <span className="text-[10px] font-semibold uppercase text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                        <Search className="w-3 h-3" /> Search Engine Snippet Preview
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                          {variants[activeTab].metaTitle}
                        </div>
                        <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                          https://yourstore.com/products/{productName.toLowerCase().replace(/[^a-z0-9]/g, "-")}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                          {variants[activeTab].metaDescription}
                        </div>
                      </div>
                      <div className="flex gap-4 text-[10px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                        <span>Title: {variants[activeTab].metaTitle?.length || 0} / 60 chars</span>
                        <span>Description: {variants[activeTab].metaDescription?.length || 0} / 160 chars</span>
                      </div>
                    </div>
                  )}

                  {/* Stats Bar */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      Word count: ~
                      {
                        formatVariantText(variants[activeTab])
                          .split(/\s+/)
                          .filter(Boolean).length
                      }{" "}
                      words
                    </span>
                    <span>Format: {format.toUpperCase()}</span>
                    <span>Tone: {tone.toUpperCase()}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
