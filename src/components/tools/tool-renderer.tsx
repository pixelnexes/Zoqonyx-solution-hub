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
  HttpStatusCodesTool,
  SerpSnippetPreviewTool,
} from "./seo-tools-expanded";

// GSC Priority Tools
import { BacklinkCheckerTool } from "./backlink-checker-tool";
import { SchemaMarkupGeneratorTool } from "./schema-markup-generator-tool";
import { AiProductDescriptionTool } from "./ai-product-description-tool";
import { AiSalesPitchTool } from "./ai-sales-pitch-tool";

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

// Calculators Suite 2
import {
  SipInvestmentCalculatorTool,
  MortgageRefinanceCalculatorTool,
  RetirementCorpusCalculatorTool,
  FreelanceHourlyRateCalculatorTool,
  CryptoPortfolioTrackerTool,
} from "./calculators-suite-2";

// Developer Tools Suite 2
import {
  DockerfileGeneratorTool,
  KubernetesYamlValidatorTool,
  ApiMockServerTool,
  GraphqlQueryBuilderTool,
  ScreenRecorderTool,
  OnlineCodeEditorTool,
  ApiTesterTool,
  DnsLookupTool,
} from "./developer-tools-suite-2";

// CSS & Design Suite 2
import {
  ThreeDTextGeneratorTool,
  FlowchartMakerTool,
  MindMapMakerTool,
  WhiteboardTool,
} from "./css-design-suite-2";

// PDF Tools Suite 2
import {
  EsignPdfTool,
  AdvancedPdfEditorTool,
} from "./pdf-tools-suite-2";

// Audio & Media Tools
import {
  VoiceRecorderEditorTool,
  AudioConverterMp3Tool,
  VideoToGifAdvancedTool,
} from "./audio-media-tools";

// Text & Copywriting Suite 2
import {
  AiResumeBuilderTool,
  AiEmailGeneratorTool,
  GrammarCheckerAdvancedTool,
  AiArticleWriterTool,
} from "./text-copy-suite-2";

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
    case "backlink-checker":
      return <BacklinkCheckerTool />;
    case "ai-product-description":
      return <AiProductDescriptionTool />;
    case "ai-sales-pitch":
      return <AiSalesPitchTool />;
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

    // Calculators Suite 2
    case "sip-investment-calculator":
      return <SipInvestmentCalculatorTool />;
    case "mortgage-refinance-calculator":
      return <MortgageRefinanceCalculatorTool />;
    case "retirement-corpus-calculator":
      return <RetirementCorpusCalculatorTool />;
    case "freelance-hourly-rate-calculator":
      return <FreelanceHourlyRateCalculatorTool />;
    case "crypto-portfolio-tracker":
      return <CryptoPortfolioTrackerTool />;

    // Developer Tools Suite 2
    case "dockerfile-generator":
      return <DockerfileGeneratorTool />;
    case "kubernetes-yaml-validator":
      return <KubernetesYamlValidatorTool />;
    case "api-mock-server":
      return <ApiMockServerTool />;
    case "graphql-query-builder":
      return <GraphqlQueryBuilderTool />;
    case "screen-recorder":
    case "screen-recorder-pro":
      return <ScreenRecorderTool />;
    case "online-code-editor":
      return <OnlineCodeEditorTool />;
    case "api-tester":
      return <ApiTesterTool />;
    case "dns-lookup-tool":
      return <DnsLookupTool />;

    // CSS & Design Suite 2
    case "3d-text-generator":
      return <ThreeDTextGeneratorTool />;
    case "flowchart-maker":
      return <FlowchartMakerTool />;
    case "mind-map-maker":
      return <MindMapMakerTool />;
    case "whiteboard-tool":
      return <WhiteboardTool />;

    // PDF Tools Suite 2
    case "esign-pdf":
    case "pdf-signature-signer":
      return <EsignPdfTool />;
    case "advanced-pdf-editor":
    case "pdf-form-filler":
      return <AdvancedPdfEditorTool />;

    // Audio & Media Tools
    case "voice-recorder-editor":
      return <VoiceRecorderEditorTool />;
    case "audio-converter-mp3":
      return <AudioConverterMp3Tool />;
    case "video-to-gif-advanced":
    case "video-to-gif-converter":
      return <VideoToGifAdvancedTool />;

    // Text & Copywriting Suite 2
    case "ai-resume-builder":
      return <AiResumeBuilderTool />;
    case "ai-email-generator":
      return <AiEmailGeneratorTool />;
    case "grammar-checker-advanced":
    case "ai-grammar-checker":
      return <GrammarCheckerAdvancedTool />;
    case "ai-article-writer":
    case "ai-content-writer":
    case "ai-code-explainer":
      return <AiArticleWriterTool />;

    // Object Remover via Canvas Inpainting
    case "object-remover-ai":
    case "object-remover":
    case "magic-object-remover":
      return <WatermarkObjectRemoverTool />;

    default:
      return (
        <div className="p-8 text-center rounded-2xl bg-card border border-border/80">
          <p className="text-base font-semibold text-foreground">Interactive Tool Ready</p>
          <p className="text-xs text-muted-foreground mt-1">This tool is active and ready to use.</p>
        </div>
      );
  }
}
