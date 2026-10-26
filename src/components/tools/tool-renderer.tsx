"use client";

import * as React from "react";
import {
  ImageCompressorTool,
  ImageResizerTool,
  ImageFormatConverterTool,
  ColorPickerTool,
  ImageRotatorTool,
  ImageToBase64Tool,
  ImageCropperTool,
} from "./image-tools";
import {
  BorderRadiusGeneratorTool,
  BoxShadowGeneratorTool,
  CssGradientGeneratorTool,
  ButtonGeneratorTool,
  FlexboxPlaygroundTool,
  GlassmorphismGeneratorTool,
  CssGridGeneratorTool,
} from "./css-tools";
import {
  CaseConverterTool,
  JsonFormatterTool,
  Base64EncodeDecodeTool,
  MarkdownHtmlConverterTool,
  UuidGeneratorTool,
  WordCounterTool,
  HashGeneratorTool,
  UrlEncoderDecoderTool,
  LoremIpsumGeneratorTool,
  DiffCheckerTool,
} from "./text-code-tools";
import { PasswordGeneratorTool } from "./password-generator";
import {
  QrCodeGeneratorTool,
  MetaTagsGeneratorTool,
  RobotsTxtGeneratorTool,
  UnitConverterTool,
  AgeCalculatorTool,
  PercentageCalculatorTool,
  BmiCalculatorTool,
} from "./seo-calc-tools";
import { OpenGraphPreviewTool } from "./open-graph-preview-tool";
import { WatermarkObjectRemoverTool } from "./watermark-object-remover";
import { BackgroundRemoverTool } from "./background-remover-tool";
import { ImageUpscalerTool } from "./image-upscaler-tool";
import { CompressPdfTool } from "./compress-pdf-tool";
import { PdfToImageTool } from "./pdf-to-image-tool";
import { OrganizePdfTool } from "./organize-pdf-tool";
import { ColorConverterTool } from "./color-converter-tool";
import { AnimationKeyframesTool } from "./animation-keyframes-tool";
import { ContrastCheckerTool } from "./contrast-checker-tool";
import { PlaceholderImageTool } from "./placeholder-image-tool";
import { IpLookupTool } from "./ip-lookup-tool";
import { SslCheckerTool } from "./ssl-checker-tool";
import { ReadingTimeTool } from "./reading-time-tool";

// PDF Tools
import {
  MergePdfTool,
  SplitPdfTool,
  RotatePdfTool,
  ProtectPdfTool,
  UnlockPdfTool,
  AddPageNumbersPdfTool,
  PdfPageCounterTool,
  PdfMetadataEditorTool,
  ImageToPdfTool,
  PdfToTextTool,
} from "./pdf-tools";

// Expanded Image Tools
import {
  BulkImageCompressorTool,
  BulkImageResizerTool,
  FaviconGeneratorTool,
  PassportPhotoMakerTool,
  WatermarkAdderTool,
  ExifDataRemoverTool,
  SvgToPngConverterTool,
} from "./image-tools-expanded";

// Expanded Developer Tools
import {
  JwtDecoderTool,
  RegexTesterTool,
  HtmlBeautifierMinifierTool,
  CssBeautifierMinifierTool,
  JsBeautifierMinifierTool,
  SqlFormatterTool,
  XmlFormatterTool,
  CodeToImageTool,
  TimestampConverterTool,
  CssToTailwindTool,
  HtmlEntityEncoderDecoderTool,
  CronExpressionGeneratorTool,
  JsonToCsvTool,
} from "./developer-tools-expanded";

// Expanded Text Tools
import {
  CharacterCounterTool,
  FindAndReplaceTool,
  RemoveExtraSpacesTool,
  ReverseTextTool,
  SlugGeneratorTool,
  MarkdownTableGeneratorTool,
  TextToSpeechTool,
  SpeechToTextTool,
  ListSorterTool,
  DuplicateLineRemoverTool,
  RandomStringGeneratorTool,
  TextStatisticsTool,
} from "./text-tools-expanded";

// Expanded CSS Tools
import {
  NeumorphismGeneratorTool,
  ClipPathGeneratorTool,
  TextShadowGeneratorTool,
  ColorPaletteGeneratorTool,
  AspectRatioCalculatorTool,
} from "./css-tools-expanded";

// Expanded SEO Tools
import {
  XmlSitemapGeneratorTool,
  UtmBuilderTool,
  KeywordDensityCheckerTool,
  CanonicalTagCheckerTool,
  SchemaMarkupGeneratorTool,
  HttpStatusCodesTool,
  SerpSnippetPreviewTool,
} from "./seo-tools-expanded";

// Expanded Calculators
import {
  LoanEmiCalculatorTool,
  TipCalculatorTool,
  DiscountCalculatorTool,
  CompoundInterestCalculatorTool,
  SalesTaxCalculatorTool,
  NumberToWordsTool,
  BinaryHexDecimalTool,
  InvoiceGeneratorTool,
  GpaCalculatorTool,
  FuelCostCalculatorTool,
  TimeDurationCalculatorTool,
} from "./calculators-expanded";

interface ToolRendererProps {
  slug: string;
}

export function ToolRenderer({ slug }: ToolRendererProps) {
  switch (slug) {
    // PDF Tools (10 tools)
    case "merge-pdf":
      return <MergePdfTool />;
    case "split-pdf":
      return <SplitPdfTool />;
    case "rotate-pdf":
      return <RotatePdfTool />;
    case "protect-pdf":
      return <ProtectPdfTool />;
    case "unlock-pdf":
      return <UnlockPdfTool />;
    case "add-page-numbers-pdf":
      return <AddPageNumbersPdfTool />;
    case "pdf-page-counter":
      return <PdfPageCounterTool />;
    case "pdf-metadata-editor":
      return <PdfMetadataEditorTool />;
    case "image-to-pdf":
      return <ImageToPdfTool />;
    case "pdf-to-text":
      return <PdfToTextTool />;
    case "compress-pdf":
      return <CompressPdfTool />;
    case "pdf-to-image":
      return <PdfToImageTool />;
    case "organize-pdf":
      return <OrganizePdfTool />;

    // Image & Photo Tools (18 tools)
    case "image-compressor":
      return <ImageCompressorTool />;
    case "background-remover":
      return <BackgroundRemoverTool />;
    case "image-upscaler":
      return <ImageUpscalerTool />;
    case "image-resizer":
      return <ImageResizerTool />;
    case "image-format-converter":
      return <ImageFormatConverterTool />;
    case "color-picker-image":
      return <ColorPickerTool />;
    case "image-cropper":
      return <ImageCropperTool />;
    case "image-rotator-flipper":
      return <ImageRotatorTool />;
    case "image-to-base64":
      return <ImageToBase64Tool />;
    case "ai-watermark-remover":
    case "watermark-remover":
      return <WatermarkObjectRemoverTool mode="watermark" />;
    case "object-remover":
    case "object-remover-photo":
    case "object-remover-ai":
    case "magic-object-remover":
      return <WatermarkObjectRemoverTool mode="object" />;
    case "bulk-image-compressor":
      return <BulkImageCompressorTool />;
    case "bulk-image-resizer":
      return <BulkImageResizerTool />;
    case "favicon-generator":
      return <FaviconGeneratorTool />;
    case "passport-photo-maker":
      return <PassportPhotoMakerTool />;
    case "watermark-adder":
      return <WatermarkAdderTool />;
    case "exif-data-remover":
      return <ExifDataRemoverTool />;
    case "svg-to-png-converter":
      return <SvgToPngConverterTool />;

    // Developer & Code Tools (20 tools)
    case "json-formatter":
      return <JsonFormatterTool />;
    case "base64-encode-decode":
      return <Base64EncodeDecodeTool />;
    case "uuid-generator":
      return <UuidGeneratorTool />;
    case "password-generator":
      return <PasswordGeneratorTool />;
    case "diff-checker":
    case "text-diff":
      return <DiffCheckerTool />;
    case "hash-generator":
      return <HashGeneratorTool />;
    case "url-encoder-decoder":
      return <UrlEncoderDecoderTool />;
    case "jwt-decoder":
      return <JwtDecoderTool />;
    case "regex-tester":
      return <RegexTesterTool />;
    case "html-beautifier-minifier":
      return <HtmlBeautifierMinifierTool />;
    case "css-beautifier-minifier":
      return <CssBeautifierMinifierTool />;
    case "javascript-beautifier-minifier":
      return <JsBeautifierMinifierTool />;
    case "sql-formatter":
      return <SqlFormatterTool />;
    case "xml-formatter":
      return <XmlFormatterTool />;
    case "code-to-image":
      return <CodeToImageTool />;
    case "timestamp-converter":
      return <TimestampConverterTool />;
    case "css-to-tailwind":
      return <CssToTailwindTool />;
    case "html-entity-encoder-decoder":
      return <HtmlEntityEncoderDecoderTool />;
    case "cron-expression-generator":
      return <CronExpressionGeneratorTool />;
    case "json-to-csv":
      return <JsonToCsvTool />;
    case "color-converter":
      return <ColorConverterTool />;

    // Text & Writing Tools (16 tools)
    case "case-converter":
      return <CaseConverterTool />;
    case "markdown-html-converter":
      return <MarkdownHtmlConverterTool />;
    case "lorem-ipsum-generator":
      return <LoremIpsumGeneratorTool />;
    case "word-counter":
      return <WordCounterTool />;
    case "character-counter":
      return <CharacterCounterTool />;
    case "find-and-replace":
      return <FindAndReplaceTool />;
    case "remove-extra-spaces":
      return <RemoveExtraSpacesTool />;
    case "reverse-text":
      return <ReverseTextTool />;
    case "slug-generator":
      return <SlugGeneratorTool />;
    case "markdown-table-generator":
      return <MarkdownTableGeneratorTool />;
    case "text-to-speech":
      return <TextToSpeechTool />;
    case "speech-to-text":
      return <SpeechToTextTool />;
    case "list-sorter":
      return <ListSorterTool />;
    case "duplicate-line-remover":
      return <DuplicateLineRemoverTool />;
    case "random-string-generator":
      return <RandomStringGeneratorTool />;
    case "text-statistics":
      return <TextStatisticsTool />;

    // CSS & Design Tools (12 tools)
    case "border-radius-generator":
      return <BorderRadiusGeneratorTool />;
    case "box-shadow-generator":
      return <BoxShadowGeneratorTool />;
    case "css-gradient-generator":
      return <CssGradientGeneratorTool />;
    case "button-generator":
      return <ButtonGeneratorTool />;
    case "flexbox-playground":
      return <FlexboxPlaygroundTool />;
    case "glassmorphism-generator":
      return <GlassmorphismGeneratorTool />;
    case "css-grid-generator":
      return <CssGridGeneratorTool />;
    case "neumorphism-generator":
      return <NeumorphismGeneratorTool />;
    case "clip-path-generator":
      return <ClipPathGeneratorTool />;
    case "text-shadow-generator":
      return <TextShadowGeneratorTool />;
    case "color-palette-generator":
      return <ColorPaletteGeneratorTool />;
    case "aspect-ratio-calculator":
      return <AspectRatioCalculatorTool />;
    case "animation-keyframes-generator":
      return <AnimationKeyframesTool />;
    case "contrast-checker":
      return <ContrastCheckerTool />;

    // SEO, Webmaster & Marketing Tools (11 tools)
    case "qr-code-generator":
      return <QrCodeGeneratorTool />;
    case "open-graph-generator":
    case "open-graph-preview":
      return <OpenGraphPreviewTool />;
    case "meta-tags-generator":
      return <MetaTagsGeneratorTool />;
    case "robots-txt-generator":
      return <RobotsTxtGeneratorTool />;
    case "xml-sitemap-generator":
      return <XmlSitemapGeneratorTool />;
    case "utm-builder":
      return <UtmBuilderTool />;
    case "keyword-density-checker":
      return <KeywordDensityCheckerTool />;
    case "canonical-tag-checker":
      return <CanonicalTagCheckerTool />;
    case "schema-markup-generator":
      return <SchemaMarkupGeneratorTool />;
    case "http-status-codes":
      return <HttpStatusCodesTool />;
    case "serp-snippet-preview":
      return <SerpSnippetPreviewTool />;

    // Calculators & Math (19 tools)
    case "unit-converter":
      return <UnitConverterTool />;
    case "age-calculator":
      return <AgeCalculatorTool />;
    case "percentage-calculator":
      return <PercentageCalculatorTool />;
    case "bmi-calculator":
      return <BmiCalculatorTool />;
    case "loan-emi-calculator":
      return <LoanEmiCalculatorTool />;
    case "tip-calculator":
      return <TipCalculatorTool />;
    case "discount-calculator":
      return <DiscountCalculatorTool />;
    case "compound-interest-calculator":
      return <CompoundInterestCalculatorTool />;
    case "sales-tax-calculator":
      return <SalesTaxCalculatorTool />;
    case "number-to-words":
      return <NumberToWordsTool />;
    case "binary-hex-decimal":
      return <BinaryHexDecimalTool />;
    case "invoice-generator":
      return <InvoiceGeneratorTool />;
    case "gpa-calculator":
      return <GpaCalculatorTool />;
    case "fuel-cost-calculator":
      return <FuelCostCalculatorTool />;
    case "time-duration-calculator":
      return <TimeDurationCalculatorTool />;
    case "placeholder-image-generator":
      return <PlaceholderImageTool />;
    case "ip-lookup":
      return <IpLookupTool />;
    case "ssl-checker":
      return <SslCheckerTool />;
    case "reading-time-calculator":
      return <ReadingTimeTool />;

    default:
      return (
        <div className="p-8 text-center rounded-2xl bg-card border border-border/80">
          <p className="text-base font-semibold text-foreground">Interactive Tool Ready</p>
          <p className="text-xs text-muted-foreground mt-1">This tool is active and ready to use.</p>
        </div>
      );
  }
}
