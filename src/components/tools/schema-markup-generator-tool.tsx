"use client";

import * as React from "react";
import {
  Code,
  Copy,
  Check,
  Download,
  ExternalLink,
  Plus,
  Trash2,
  FileCode,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addSessionHistory } from "@/lib/session-history";

export type SchemaType =
  | "FAQPage"
  | "Article"
  | "Product"
  | "LocalBusiness"
  | "Organization"
  | "HowTo"
  | "Recipe"
  | "Event"
  | "BreadcrumbList"
  | "WebSite";

export function SchemaMarkupGeneratorTool() {
  const [schemaType, setSchemaType] = React.useState<SchemaType>("FAQPage");
  const [copied, setCopied] = React.useState(false);

  // 1. FAQPage State
  const [faqs, setFaqs] = React.useState<Array<{ q: string; a: string }>>([
    {
      q: "Is Zoqonyx 100% free?",
      a: "Yes, all tools on Zoqonyx run completely free in your browser with zero registration required.",
    },
    {
      q: "Are my uploaded files stored on your servers?",
      a: "Never. All file conversions and processing execute 100% locally in your browser memory.",
    },
  ]);

  // 2. Article State
  const [article, setArticle] = React.useState({
    headline: "How to Optimize Web Vitals and LCP in 2026",
    description: "A comprehensive developer guide to optimizing Largest Contentful Paint with modern WebP graphics.",
    authorName: "Zoqonyx Engineering",
    authorType: "Organization",
    publisherName: "Zoqonyx Solution Hub",
    publisherLogo: "https://zoqonyx.com/logo/zoqonyx-logo.png",
    imageUrl: "https://zoqonyx.com/og-image.png",
    datePublished: "2026-01-15",
    dateModified: "2026-03-01",
  });

  // 3. Product State
  const [product, setProduct] = React.useState({
    name: "Ultra-Light Ergonomic Wireless Mouse",
    description: "Precision 26,000 DPI sensor with sub-millisecond optical switches and 80-hour battery life.",
    brand: "AeroTech",
    sku: "AT-M80-WL",
    gtin: "0123456789012",
    imageUrl: "https://example.com/images/mouse.jpg",
    price: "79.99",
    currency: "USD",
    availability: "https://schema.org/InStock",
    ratingValue: "4.8",
    reviewCount: "142",
  });

  // 4. LocalBusiness State
  const [business, setBusiness] = React.useState({
    name: "Zoqonyx Solutions LLC",
    legalName: "Zoqonyx Solutions International LLC",
    type: "LocalBusiness",
    url: "https://zoqonyx.com",
    logo: "https://zoqonyx.com/logo/zoqonyx-logo.png",
    telephone: "+1-800-555-0199",
    email: "contact@zoqonyx.com",
    streetAddress: "100 Technology Square, Suite 400",
    city: "Cambridge",
    state: "MA",
    postalCode: "02139",
    country: "US",
    latitude: "42.3601",
    longitude: "-71.0942",
    openingHours: "Mo-Fr 09:00-18:00",
    sameAs: "https://twitter.com/zoqonyx\nhttps://github.com/zoqonyx",
  });

  // 5. HowTo State
  const [howTo, setHowTo] = React.useState({
    name: "How to Convert Heavy PNGs to WebP Online",
    description: "Follow these 3 simple steps to compress graphics by up to 80% without losing visual clarity.",
    totalTime: "PT2M",
    steps: [
      { name: "Upload Image", text: "Drag and drop your PNG photo into the file dropzone." },
      { name: "Select WebP Format", text: "Choose WebP format and adjust the quality slider to 80%." },
      { name: "Download Output", text: "Click Convert and download your optimized image file." },
    ],
  });

  // 6. Recipe State
  const [recipe, setRecipe] = React.useState({
    name: "Classic Cold Brew Coffee Concentrate",
    description: "Smooth, low-acidity homemade cold brew steeped for 18 hours.",
    author: "Barista Lab",
    prepTime: "PT10M",
    cookTime: "PT0M",
    totalTime: "PT18H",
    recipeYield: "8 servings",
    calories: "5 calories",
    ingredients: "1 cup coarse ground coffee beans\n4 cups filtered cold water\nIce cubes\nMilk or oat milk to taste",
    instructions: "Grind coffee beans coarsely.\nCombine grounds with cold filtered water in a glass pitcher.\nCover and steep at room temperature for 18 hours.\nFilter through a fine mesh strainer.\nServe over ice.",
  });

  // 7. Event State
  const [eventData, setEventData] = React.useState({
    name: "Web Performance & SEO Global Summit 2026",
    description: "Annual conference exploring Core Web Vitals, Schema.org architectures, and client-side web tools.",
    startDate: "2026-09-20T09:00:00-04:00",
    endDate: "2026-09-21T17:00:00-04:00",
    locationName: "Boston Convention and Exhibition Center",
    streetAddress: "415 Summer St",
    city: "Boston",
    state: "MA",
    country: "US",
    ticketUrl: "https://example.com/tickets/seo-summit-2026",
    price: "199.00",
    currency: "USD",
  });

  // 8. BreadcrumbList State
  const [breadcrumbs, setBreadcrumbs] = React.useState([
    { name: "Home", url: "https://zoqonyx.com" },
    { name: "Tools", url: "https://zoqonyx.com/tools" },
    { name: "Developer & SEO", url: "https://zoqonyx.com/category/developer-seo" },
    { name: "Schema Markup Generator", url: "https://zoqonyx.com/tools/schema-markup-generator" },
  ]);

  // 9. WebSite State
  const [website, setWebsite] = React.useState({
    name: "Zoqonyx Solution Hub",
    url: "https://zoqonyx.com",
    searchUrlPattern: "https://zoqonyx.com/tools?q={search_term_string}",
  });

  // Dynamic FAQ Handlers
  const addFaq = () => {
    setFaqs([...faqs, { q: "New Question Title", a: "Detailed answer explaining the solution clearly." }]);
  };

  const updateFaq = (idx: number, field: "q" | "a", val: string) => {
    const next = [...faqs];
    next[idx][field] = val;
    setFaqs(next);
  };

  const removeFaq = (idx: number) => {
    if (faqs.length <= 1) return;
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  // Dynamic HowTo Steps
  const addHowToStep = () => {
    setHowTo({
      ...howTo,
      steps: [...howTo.steps, { name: `Step ${howTo.steps.length + 1}`, text: "Step instruction text here." }],
    });
  };

  const updateHowToStep = (idx: number, field: "name" | "text", val: string) => {
    const steps = [...howTo.steps];
    steps[idx][field] = val;
    setHowTo({ ...howTo, steps });
  };

  const removeHowToStep = (idx: number) => {
    if (howTo.steps.length <= 1) return;
    setHowTo({ ...howTo, steps: howTo.steps.filter((_, i) => i !== idx) });
  };

  // Generate Official Schema.org JSON Object
  const generateSchemaObject = () => {
    switch (schemaType) {
      case "FAQPage":
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.a,
            },
          })),
        };

      case "Article":
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.headline,
          description: article.description,
          image: [article.imageUrl],
          datePublished: article.datePublished,
          dateModified: article.dateModified,
          author: {
            "@type": article.authorType,
            name: article.authorName,
          },
          publisher: {
            "@type": "Organization",
            name: article.publisherName,
            logo: {
              "@type": "ImageObject",
              url: article.publisherLogo,
            },
          },
        };

      case "Product":
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          image: [product.imageUrl],
          description: product.description,
          sku: product.sku,
          gtin: product.gtin,
          brand: {
            "@type": "Brand",
            name: product.brand,
          },
          offers: {
            "@type": "Offer",
            url: "https://example.com/product/" + product.sku,
            priceCurrency: product.currency,
            price: product.price,
            availability: product.availability,
            priceValidUntil: "2026-12-31",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.ratingValue,
            reviewCount: product.reviewCount,
          },
        };

      case "LocalBusiness":
      case "Organization":
        return {
          "@context": "https://schema.org",
          "@type": business.type,
          name: business.name,
          legalName: business.legalName,
          url: business.url,
          logo: business.logo,
          telephone: business.telephone,
          email: business.email,
          address: {
            "@type": "PostalAddress",
            streetAddress: business.streetAddress,
            addressLocality: business.city,
            addressRegion: business.state,
            postalCode: business.postalCode,
            addressCountry: business.country,
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: parseFloat(business.latitude) || 0,
            longitude: parseFloat(business.longitude) || 0,
          },
          openingHours: business.openingHours,
          sameAs: business.sameAs.split("\n").filter(Boolean),
        };

      case "HowTo":
        return {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: howTo.name,
          description: howTo.description,
          totalTime: howTo.totalTime,
          step: howTo.steps.map((s, idx) => ({
            "@type": "HowToStep",
            position: idx + 1,
            name: s.name,
            text: s.text,
          })),
        };

      case "Recipe":
        return {
          "@context": "https://schema.org",
          "@type": "Recipe",
          name: recipe.name,
          description: recipe.description,
          author: {
            "@type": "Person",
            name: recipe.author,
          },
          prepTime: recipe.prepTime,
          cookTime: recipe.cookTime,
          totalTime: recipe.totalTime,
          recipeYield: recipe.recipeYield,
          nutrition: {
            "@type": "NutritionInformation",
            calories: recipe.calories,
          },
          recipeIngredient: recipe.ingredients.split("\n").filter(Boolean),
          recipeInstructions: recipe.instructions
            .split("\n")
            .filter(Boolean)
            .map((inst, idx) => ({
              "@type": "HowToStep",
              position: idx + 1,
              text: inst,
            })),
        };

      case "Event":
        return {
          "@context": "https://schema.org",
          "@type": "Event",
          name: eventData.name,
          description: eventData.description,
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          location: {
            "@type": "Place",
            name: eventData.locationName,
            address: {
              "@type": "PostalAddress",
              streetAddress: eventData.streetAddress,
              addressLocality: eventData.city,
              addressRegion: eventData.state,
              addressCountry: eventData.country,
            },
          },
          offers: {
            "@type": "Offer",
            url: eventData.ticketUrl,
            price: eventData.price,
            priceCurrency: eventData.currency,
            availability: "https://schema.org/InStock",
          },
        };

      case "BreadcrumbList":
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbs.map((b, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: b.name,
            item: b.url,
          })),
        };

      case "WebSite":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: website.name,
          url: website.url,
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: website.searchUrlPattern,
            },
            "query-input": "required name=search_term_string",
          },
        };

      default:
        return { "@context": "https://schema.org" };
    }
  };

  const schemaJsonString = JSON.stringify(generateSchemaObject(), null, 2);
  const fullHtmlSnippet = `<script type="application/ld+json">\n${schemaJsonString}\n</script>`;

  const copySnippet = () => {
    navigator.clipboard.writeText(fullHtmlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    addSessionHistory({
      toolSlug: "schema-markup-generator",
      toolName: "Schema Markup Generator",
      action: "Generated",
      summary: `Generated and copied JSON-LD structured data for ${schemaType}`,
    });
  };

  const downloadJsonLd = () => {
    const blob = new Blob([schemaJsonString], { type: "application/ld+json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${schemaType.toLowerCase()}_schema.jsonld`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Schema Type Navigation */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-foreground">Select Schema Structured Data Type</Label>
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-muted/40 rounded-xl border border-border/80">
          {(
            [
              "FAQPage",
              "Article",
              "Product",
              "LocalBusiness",
              "HowTo",
              "Recipe",
              "Event",
              "BreadcrumbList",
              "WebSite",
            ] as const
          ).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSchemaType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                schemaType === type
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor Form Column */}
        <div className="lg:col-span-6 p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/80">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 font-mono">
              Configure {schemaType}
            </span>
            <span className="text-[11px] text-muted-foreground">Google Search Central Compliant</span>
          </div>

          {/* 1. FAQPage */}
          {schemaType === "FAQPage" && (
            <div className="space-y-4">
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-muted/30 border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-[11px] font-bold text-slate-700">Question {idx + 1}</Label>
                      {faqs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFaq(idx)}
                          className="text-muted-foreground hover:text-rose-600 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <Input
                      value={faq.q}
                      onChange={(e) => updateFaq(idx, "q", e.target.value)}
                      placeholder="e.g. How long does shipping take?"
                      className="text-xs"
                    />
                    <Label className="text-[11px] font-medium text-slate-600">Answer</Label>
                    <textarea
                      value={faq.a}
                      onChange={(e) => updateFaq(idx, "a", e.target.value)}
                      rows={2}
                      className="w-full p-2 text-xs rounded-lg border border-border bg-background"
                      placeholder="Write clear, helpful answer..."
                    />
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addFaq} className="w-full text-xs gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add Another Question
              </Button>
            </div>
          )}

          {/* 2. Article */}
          {schemaType === "Article" && (
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <Label className="text-xs">Headline</Label>
                <Input
                  value={article.headline}
                  onChange={(e) => setArticle({ ...article, headline: e.target.value })}
                  className="text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <textarea
                  value={article.description}
                  onChange={(e) => setArticle({ ...article, description: e.target.value })}
                  rows={2}
                  className="w-full p-2 text-xs rounded-lg border border-border bg-background"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Author Name</Label>
                  <Input
                    value={article.authorName}
                    onChange={(e) => setArticle({ ...article, authorName: e.target.value })}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Author Type</Label>
                  <select
                    value={article.authorType}
                    onChange={(e) => setArticle({ ...article, authorType: e.target.value })}
                    className="w-full h-9 p-1.5 text-xs rounded-md border border-border bg-background"
                  >
                    <option value="Person">Person</option>
                    <option value="Organization">Organization</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Image URL</Label>
                <Input
                  value={article.imageUrl}
                  onChange={(e) => setArticle({ ...article, imageUrl: e.target.value })}
                  className="text-xs font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Date Published</Label>
                  <Input
                    type="date"
                    value={article.datePublished}
                    onChange={(e) => setArticle({ ...article, datePublished: e.target.value })}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Date Modified</Label>
                  <Input
                    type="date"
                    value={article.dateModified}
                    onChange={(e) => setArticle({ ...article, dateModified: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. Product */}
          {schemaType === "Product" && (
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <Label className="text-xs">Product Name</Label>
                <Input
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  className="text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Brand</Label>
                  <Input
                    value={product.brand}
                    onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">SKU</Label>
                  <Input
                    value={product.sku}
                    onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                    className="text-xs font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Price</Label>
                  <Input
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Currency</Label>
                  <Input
                    value={product.currency}
                    onChange={(e) => setProduct({ ...product, currency: e.target.value })}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Rating (1-5)</Label>
                  <Input
                    value={product.ratingValue}
                    onChange={(e) => setProduct({ ...product, ratingValue: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <textarea
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  rows={2}
                  className="w-full p-2 text-xs rounded-lg border border-border bg-background"
                />
              </div>
            </div>
          )}

          {/* 4. LocalBusiness / Organization */}
          {(schemaType === "LocalBusiness" || schemaType === "Organization") && (
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <Label className="text-xs">Business / Organization Name</Label>
                <Input
                  value={business.name}
                  onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                  className="text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Website URL</Label>
                  <Input
                    value={business.url}
                    onChange={(e) => setBusiness({ ...business, url: e.target.value })}
                    className="text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Phone</Label>
                  <Input
                    value={business.telephone}
                    onChange={(e) => setBusiness({ ...business, telephone: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Street Address</Label>
                <Input
                  value={business.streetAddress}
                  onChange={(e) => setBusiness({ ...business, streetAddress: e.target.value })}
                  className="text-xs"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  value={business.city}
                  onChange={(e) => setBusiness({ ...business, city: e.target.value })}
                  placeholder="City"
                  className="text-xs"
                />
                <Input
                  value={business.state}
                  onChange={(e) => setBusiness({ ...business, state: e.target.value })}
                  placeholder="State"
                  className="text-xs"
                />
                <Input
                  value={business.postalCode}
                  onChange={(e) => setBusiness({ ...business, postalCode: e.target.value })}
                  placeholder="Postal Code"
                  className="text-xs"
                />
              </div>
            </div>
          )}

          {/* 5. HowTo */}
          {schemaType === "HowTo" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs">Guide Title</Label>
                <Input
                  value={howTo.name}
                  onChange={(e) => setHowTo({ ...howTo, name: e.target.value })}
                  className="text-xs"
                />
              </div>
              <div className="space-y-2">
                {howTo.steps.map((st, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-muted/30 border border-border space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[11px] text-teal-700">Step {idx + 1}</span>
                      {howTo.steps.length > 1 && (
                        <button type="button" onClick={() => removeHowToStep(idx)} className="text-muted-foreground hover:text-rose-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <Input
                      value={st.name}
                      onChange={(e) => updateHowToStep(idx, "name", e.target.value)}
                      placeholder="Step Title"
                      className="text-xs"
                    />
                    <textarea
                      value={st.text}
                      onChange={(e) => updateHowToStep(idx, "text", e.target.value)}
                      rows={2}
                      className="w-full p-2 text-xs rounded border border-border bg-background"
                      placeholder="Step Instructions..."
                    />
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addHowToStep} className="w-full text-xs gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add Step
              </Button>
            </div>
          )}

          {/* 6. Recipe */}
          {schemaType === "Recipe" && (
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <Label className="text-xs">Recipe Name</Label>
                <Input
                  value={recipe.name}
                  onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
                  className="text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Ingredients (one per line)</Label>
                <textarea
                  value={recipe.ingredients}
                  onChange={(e) => setRecipe({ ...recipe, ingredients: e.target.value })}
                  rows={3}
                  className="w-full p-2 text-xs rounded border border-border bg-background font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Instructions (one step per line)</Label>
                <textarea
                  value={recipe.instructions}
                  onChange={(e) => setRecipe({ ...recipe, instructions: e.target.value })}
                  rows={3}
                  className="w-full p-2 text-xs rounded border border-border bg-background font-mono"
                />
              </div>
            </div>
          )}

          {/* 7. Event */}
          {schemaType === "Event" && (
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <Label className="text-xs">Event Name</Label>
                <Input
                  value={eventData.name}
                  onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
                  className="text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Start Date/Time</Label>
                  <Input
                    value={eventData.startDate}
                    onChange={(e) => setEventData({ ...eventData, startDate: e.target.value })}
                    className="text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">End Date/Time</Label>
                  <Input
                    value={eventData.endDate}
                    onChange={(e) => setEventData({ ...eventData, endDate: e.target.value })}
                    className="text-xs font-mono"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Venue Location</Label>
                <Input
                  value={eventData.locationName}
                  onChange={(e) => setEventData({ ...eventData, locationName: e.target.value })}
                  className="text-xs"
                />
              </div>
            </div>
          )}

          {/* 8. BreadcrumbList */}
          {schemaType === "BreadcrumbList" && (
            <div className="space-y-3 text-xs">
              <Label className="text-xs">Breadcrumb Items</Label>
              <div className="space-y-2">
                {breadcrumbs.map((b, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <span className="w-5 text-center font-mono font-bold text-teal-700">{idx + 1}</span>
                    <Input
                      value={b.name}
                      onChange={(e) => {
                        const copy = [...breadcrumbs];
                        copy[idx].name = e.target.value;
                        setBreadcrumbs(copy);
                      }}
                      className="text-xs w-1/3"
                    />
                    <Input
                      value={b.url}
                      onChange={(e) => {
                        const copy = [...breadcrumbs];
                        copy[idx].url = e.target.value;
                        setBreadcrumbs(copy);
                      }}
                      className="text-xs flex-1 font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. WebSite */}
          {schemaType === "WebSite" && (
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <Label className="text-xs">Site Name</Label>
                <Input
                  value={website.name}
                  onChange={(e) => setWebsite({ ...website, name: e.target.value })}
                  className="text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Site URL</Label>
                <Input
                  value={website.url}
                  onChange={(e) => setWebsite({ ...website, url: e.target.value })}
                  className="text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Sitelinks Search Query URL</Label>
                <Input
                  value={website.searchUrlPattern}
                  onChange={(e) => setWebsite({ ...website, searchUrlPattern: e.target.value })}
                  className="text-xs font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Output Code Column */}
        <div className="lg:col-span-6 p-4 sm:p-5 rounded-2xl bg-card border border-border space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/80">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5 font-mono">
              <Code className="w-4 h-4 text-teal-600" />
              JSON-LD Code Snippet
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={copySnippet}
                className="text-xs h-7 px-2.5 gap-1 border-teal-500/40 text-teal-700 hover:bg-teal-50"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Script"}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadJsonLd}
                className="text-xs h-7 px-2 gap-1 text-muted-foreground hover:text-foreground"
                title="Download JSON-LD file"
              >
                <Download className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <pre className="p-3.5 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[460px] leading-relaxed border border-slate-800">
              <code>{fullHtmlSnippet}</code>
            </pre>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Valid Schema.org Structured Data
            </span>
            <a
              href={`https://search.google.com/test/rich-results?code=${encodeURIComponent(fullHtmlSnippet)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-teal-700 hover:underline font-semibold text-xs"
            >
              <span>Test in Google Rich Results</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
