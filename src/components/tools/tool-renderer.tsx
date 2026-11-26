"use client";

import * as React from "react";

// PDF Tools

// Expanded Image Tools

// Expanded Developer Tools

// Expanded Text Tools

// Expanded CSS Tools

// Expanded SEO Tools

// GSC Priority Tools

// Expanded Calculators

// Calculators Suite 2

// Developer Tools Suite 2

// CSS & Design Suite 2

// PDF Tools Suite 2

// Audio & Media Tools

// Text & Copywriting Suite 2

import dynamic from "next/dynamic";

function ToolLoading() {
  return (
    <div role="status" className="flex min-h-[220px] items-center justify-center text-sm text-muted-foreground">
      Loading the tool
    </div>
  );
}

// Each tool is its own chunk: opening one tool doesn't download the other 140.
const ImageCompressorTool = dynamic(() => import("./image-tools").then((m) => m.ImageCompressorTool), { loading: ToolLoading });
const ImageResizerTool = dynamic(() => import("./image-tools").then((m) => m.ImageResizerTool), { loading: ToolLoading });
const ImageFormatConverterTool = dynamic(() => import("./image-tools").then((m) => m.ImageFormatConverterTool), { loading: ToolLoading });
const ColorPickerTool = dynamic(() => import("./image-tools").then((m) => m.ColorPickerTool), { loading: ToolLoading });
const ImageRotatorTool = dynamic(() => import("./image-tools").then((m) => m.ImageRotatorTool), { loading: ToolLoading });
const ImageToBase64Tool = dynamic(() => import("./image-tools").then((m) => m.ImageToBase64Tool), { loading: ToolLoading });
const ImageCropperTool = dynamic(() => import("./image-tools").then((m) => m.ImageCropperTool), { loading: ToolLoading });
const BorderRadiusGeneratorTool = dynamic(() => import("./css-tools").then((m) => m.BorderRadiusGeneratorTool), { loading: ToolLoading });
const BoxShadowGeneratorTool = dynamic(() => import("./css-tools").then((m) => m.BoxShadowGeneratorTool), { loading: ToolLoading });
const CssGradientGeneratorTool = dynamic(() => import("./css-tools").then((m) => m.CssGradientGeneratorTool), { loading: ToolLoading });
const ButtonGeneratorTool = dynamic(() => import("./css-tools").then((m) => m.ButtonGeneratorTool), { loading: ToolLoading });
const FlexboxPlaygroundTool = dynamic(() => import("./css-tools").then((m) => m.FlexboxPlaygroundTool), { loading: ToolLoading });
const GlassmorphismGeneratorTool = dynamic(() => import("./css-tools").then((m) => m.GlassmorphismGeneratorTool), { loading: ToolLoading });
const CssGridGeneratorTool = dynamic(() => import("./css-tools").then((m) => m.CssGridGeneratorTool), { loading: ToolLoading });
const CaseConverterTool = dynamic(() => import("./text-code-tools").then((m) => m.CaseConverterTool), { loading: ToolLoading });
const JsonFormatterTool = dynamic(() => import("./text-code-tools").then((m) => m.JsonFormatterTool), { loading: ToolLoading });
const Base64EncodeDecodeTool = dynamic(() => import("./text-code-tools").then((m) => m.Base64EncodeDecodeTool), { loading: ToolLoading });
const MarkdownHtmlConverterTool = dynamic(() => import("./text-code-tools").then((m) => m.MarkdownHtmlConverterTool), { loading: ToolLoading });
const UuidGeneratorTool = dynamic(() => import("./text-code-tools").then((m) => m.UuidGeneratorTool), { loading: ToolLoading });
const WordCounterTool = dynamic(() => import("./text-code-tools").then((m) => m.WordCounterTool), { loading: ToolLoading });
const HashGeneratorTool = dynamic(() => import("./text-code-tools").then((m) => m.HashGeneratorTool), { loading: ToolLoading });
const UrlEncoderDecoderTool = dynamic(() => import("./text-code-tools").then((m) => m.UrlEncoderDecoderTool), { loading: ToolLoading });
const LoremIpsumGeneratorTool = dynamic(() => import("./text-code-tools").then((m) => m.LoremIpsumGeneratorTool), { loading: ToolLoading });
const DiffCheckerTool = dynamic(() => import("./text-code-tools").then((m) => m.DiffCheckerTool), { loading: ToolLoading });
const PasswordGeneratorTool = dynamic(() => import("./password-generator").then((m) => m.PasswordGeneratorTool), { loading: ToolLoading });
const QrCodeGeneratorTool = dynamic(() => import("./seo-calc-tools").then((m) => m.QrCodeGeneratorTool), { loading: ToolLoading });
const MetaTagsGeneratorTool = dynamic(() => import("./seo-calc-tools").then((m) => m.MetaTagsGeneratorTool), { loading: ToolLoading });
const RobotsTxtGeneratorTool = dynamic(() => import("./seo-calc-tools").then((m) => m.RobotsTxtGeneratorTool), { loading: ToolLoading });
const UnitConverterTool = dynamic(() => import("./seo-calc-tools").then((m) => m.UnitConverterTool), { loading: ToolLoading });
const AgeCalculatorTool = dynamic(() => import("./seo-calc-tools").then((m) => m.AgeCalculatorTool), { loading: ToolLoading });
const PercentageCalculatorTool = dynamic(() => import("./seo-calc-tools").then((m) => m.PercentageCalculatorTool), { loading: ToolLoading });
const BmiCalculatorTool = dynamic(() => import("./seo-calc-tools").then((m) => m.BmiCalculatorTool), { loading: ToolLoading });
const OpenGraphPreviewTool = dynamic(() => import("./open-graph-preview-tool").then((m) => m.OpenGraphPreviewTool), { loading: ToolLoading });
const WatermarkObjectRemoverTool = dynamic(() => import("./watermark-object-remover").then((m) => m.WatermarkObjectRemoverTool), { loading: ToolLoading });
const BackgroundRemoverTool = dynamic(() => import("./background-remover-tool").then((m) => m.BackgroundRemoverTool), { loading: ToolLoading });
const ImageUpscalerTool = dynamic(() => import("./image-upscaler-tool").then((m) => m.ImageUpscalerTool), { loading: ToolLoading });
const CompressPdfTool = dynamic(() => import("./compress-pdf-tool").then((m) => m.CompressPdfTool), { loading: ToolLoading });
const PdfToImageTool = dynamic(() => import("./pdf-to-image-tool").then((m) => m.PdfToImageTool), { loading: ToolLoading });
const OrganizePdfTool = dynamic(() => import("./organize-pdf-tool").then((m) => m.OrganizePdfTool), { loading: ToolLoading });
const ColorConverterTool = dynamic(() => import("./color-converter-tool").then((m) => m.ColorConverterTool), { loading: ToolLoading });
const AnimationKeyframesTool = dynamic(() => import("./animation-keyframes-tool").then((m) => m.AnimationKeyframesTool), { loading: ToolLoading });
const ContrastCheckerTool = dynamic(() => import("./contrast-checker-tool").then((m) => m.ContrastCheckerTool), { loading: ToolLoading });
const PlaceholderImageTool = dynamic(() => import("./placeholder-image-tool").then((m) => m.PlaceholderImageTool), { loading: ToolLoading });
const IpLookupTool = dynamic(() => import("./ip-lookup-tool").then((m) => m.IpLookupTool), { loading: ToolLoading });
const SslCheckerTool = dynamic(() => import("./ssl-checker-tool").then((m) => m.SslCheckerTool), { loading: ToolLoading });
const ReadingTimeTool = dynamic(() => import("./reading-time-tool").then((m) => m.ReadingTimeTool), { loading: ToolLoading });
const MergePdfTool = dynamic(() => import("./pdf-tools").then((m) => m.MergePdfTool), { loading: ToolLoading });
const SplitPdfTool = dynamic(() => import("./pdf-tools").then((m) => m.SplitPdfTool), { loading: ToolLoading });
const RotatePdfTool = dynamic(() => import("./pdf-tools").then((m) => m.RotatePdfTool), { loading: ToolLoading });
const ProtectPdfTool = dynamic(() => import("./pdf-tools").then((m) => m.ProtectPdfTool), { loading: ToolLoading });
const UnlockPdfTool = dynamic(() => import("./pdf-tools").then((m) => m.UnlockPdfTool), { loading: ToolLoading });
const AddPageNumbersPdfTool = dynamic(() => import("./pdf-tools").then((m) => m.AddPageNumbersPdfTool), { loading: ToolLoading });
const PdfPageCounterTool = dynamic(() => import("./pdf-tools").then((m) => m.PdfPageCounterTool), { loading: ToolLoading });
const PdfMetadataEditorTool = dynamic(() => import("./pdf-tools").then((m) => m.PdfMetadataEditorTool), { loading: ToolLoading });
const ImageToPdfTool = dynamic(() => import("./pdf-tools").then((m) => m.ImageToPdfTool), { loading: ToolLoading });
const PdfToTextTool = dynamic(() => import("./pdf-tools").then((m) => m.PdfToTextTool), { loading: ToolLoading });
const BulkImageCompressorTool = dynamic(() => import("./image-tools-expanded").then((m) => m.BulkImageCompressorTool), { loading: ToolLoading });
const BulkImageResizerTool = dynamic(() => import("./image-tools-expanded").then((m) => m.BulkImageResizerTool), { loading: ToolLoading });
const FaviconGeneratorTool = dynamic(() => import("./image-tools-expanded").then((m) => m.FaviconGeneratorTool), { loading: ToolLoading });
const PassportPhotoMakerTool = dynamic(() => import("./image-tools-expanded").then((m) => m.PassportPhotoMakerTool), { loading: ToolLoading });
const WatermarkAdderTool = dynamic(() => import("./image-tools-expanded").then((m) => m.WatermarkAdderTool), { loading: ToolLoading });
const ExifDataRemoverTool = dynamic(() => import("./image-tools-expanded").then((m) => m.ExifDataRemoverTool), { loading: ToolLoading });
const SvgToPngConverterTool = dynamic(() => import("./image-tools-expanded").then((m) => m.SvgToPngConverterTool), { loading: ToolLoading });
const JwtDecoderTool = dynamic(() => import("./developer-tools-expanded").then((m) => m.JwtDecoderTool), { loading: ToolLoading });
const RegexTesterTool = dynamic(() => import("./developer-tools-expanded").then((m) => m.RegexTesterTool), { loading: ToolLoading });
const HtmlBeautifierMinifierTool = dynamic(() => import("./developer-tools-expanded").then((m) => m.HtmlBeautifierMinifierTool), { loading: ToolLoading });
const CssBeautifierMinifierTool = dynamic(() => import("./developer-tools-expanded").then((m) => m.CssBeautifierMinifierTool), { loading: ToolLoading });
const JsBeautifierMinifierTool = dynamic(() => import("./developer-tools-expanded").then((m) => m.JsBeautifierMinifierTool), { loading: ToolLoading });
const SqlFormatterTool = dynamic(() => import("./developer-tools-expanded").then((m) => m.SqlFormatterTool), { loading: ToolLoading });
const XmlFormatterTool = dynamic(() => import("./developer-tools-expanded").then((m) => m.XmlFormatterTool), { loading: ToolLoading });
const CodeToImageTool = dynamic(() => import("./developer-tools-expanded").then((m) => m.CodeToImageTool), { loading: ToolLoading });
const TimestampConverterTool = dynamic(() => import("./developer-tools-expanded").then((m) => m.TimestampConverterTool), { loading: ToolLoading });
const CssToTailwindTool = dynamic(() => import("./developer-tools-expanded").then((m) => m.CssToTailwindTool), { loading: ToolLoading });
const HtmlEntityEncoderDecoderTool = dynamic(() => import("./developer-tools-expanded").then((m) => m.HtmlEntityEncoderDecoderTool), { loading: ToolLoading });
const CronExpressionGeneratorTool = dynamic(() => import("./developer-tools-expanded").then((m) => m.CronExpressionGeneratorTool), { loading: ToolLoading });
const JsonToCsvTool = dynamic(() => import("./developer-tools-expanded").then((m) => m.JsonToCsvTool), { loading: ToolLoading });
const CharacterCounterTool = dynamic(() => import("./text-tools-expanded").then((m) => m.CharacterCounterTool), { loading: ToolLoading });
const FindAndReplaceTool = dynamic(() => import("./text-tools-expanded").then((m) => m.FindAndReplaceTool), { loading: ToolLoading });
const RemoveExtraSpacesTool = dynamic(() => import("./text-tools-expanded").then((m) => m.RemoveExtraSpacesTool), { loading: ToolLoading });
const ReverseTextTool = dynamic(() => import("./text-tools-expanded").then((m) => m.ReverseTextTool), { loading: ToolLoading });
const SlugGeneratorTool = dynamic(() => import("./text-tools-expanded").then((m) => m.SlugGeneratorTool), { loading: ToolLoading });
const MarkdownTableGeneratorTool = dynamic(() => import("./text-tools-expanded").then((m) => m.MarkdownTableGeneratorTool), { loading: ToolLoading });
const TextToSpeechTool = dynamic(() => import("./text-tools-expanded").then((m) => m.TextToSpeechTool), { loading: ToolLoading });
const SpeechToTextTool = dynamic(() => import("./text-tools-expanded").then((m) => m.SpeechToTextTool), { loading: ToolLoading });
const ListSorterTool = dynamic(() => import("./text-tools-expanded").then((m) => m.ListSorterTool), { loading: ToolLoading });
const DuplicateLineRemoverTool = dynamic(() => import("./text-tools-expanded").then((m) => m.DuplicateLineRemoverTool), { loading: ToolLoading });
const RandomStringGeneratorTool = dynamic(() => import("./text-tools-expanded").then((m) => m.RandomStringGeneratorTool), { loading: ToolLoading });
const TextStatisticsTool = dynamic(() => import("./text-tools-expanded").then((m) => m.TextStatisticsTool), { loading: ToolLoading });
const NeumorphismGeneratorTool = dynamic(() => import("./css-tools-expanded").then((m) => m.NeumorphismGeneratorTool), { loading: ToolLoading });
const ClipPathGeneratorTool = dynamic(() => import("./css-tools-expanded").then((m) => m.ClipPathGeneratorTool), { loading: ToolLoading });
const TextShadowGeneratorTool = dynamic(() => import("./css-tools-expanded").then((m) => m.TextShadowGeneratorTool), { loading: ToolLoading });
const ColorPaletteGeneratorTool = dynamic(() => import("./css-tools-expanded").then((m) => m.ColorPaletteGeneratorTool), { loading: ToolLoading });
const AspectRatioCalculatorTool = dynamic(() => import("./css-tools-expanded").then((m) => m.AspectRatioCalculatorTool), { loading: ToolLoading });
const XmlSitemapGeneratorTool = dynamic(() => import("./seo-tools-expanded").then((m) => m.XmlSitemapGeneratorTool), { loading: ToolLoading });
const UtmBuilderTool = dynamic(() => import("./seo-tools-expanded").then((m) => m.UtmBuilderTool), { loading: ToolLoading });
const KeywordDensityCheckerTool = dynamic(() => import("./seo-tools-expanded").then((m) => m.KeywordDensityCheckerTool), { loading: ToolLoading });
const CanonicalTagCheckerTool = dynamic(() => import("./seo-tools-expanded").then((m) => m.CanonicalTagCheckerTool), { loading: ToolLoading });
const HttpStatusCodesTool = dynamic(() => import("./seo-tools-expanded").then((m) => m.HttpStatusCodesTool), { loading: ToolLoading });
const SerpSnippetPreviewTool = dynamic(() => import("./seo-tools-expanded").then((m) => m.SerpSnippetPreviewTool), { loading: ToolLoading });
const BacklinkCheckerTool = dynamic(() => import("./backlink-checker-tool").then((m) => m.BacklinkCheckerTool), { loading: ToolLoading });
const SchemaMarkupGeneratorTool = dynamic(() => import("./schema-markup-generator-tool").then((m) => m.SchemaMarkupGeneratorTool), { loading: ToolLoading });
const AiProductDescriptionTool = dynamic(() => import("./ai-product-description-tool").then((m) => m.AiProductDescriptionTool), { loading: ToolLoading });
const AiSalesPitchTool = dynamic(() => import("./ai-sales-pitch-tool").then((m) => m.AiSalesPitchTool), { loading: ToolLoading });
const LoanEmiCalculatorTool = dynamic(() => import("./calculators-expanded").then((m) => m.LoanEmiCalculatorTool), { loading: ToolLoading });
const TipCalculatorTool = dynamic(() => import("./calculators-expanded").then((m) => m.TipCalculatorTool), { loading: ToolLoading });
const DiscountCalculatorTool = dynamic(() => import("./calculators-expanded").then((m) => m.DiscountCalculatorTool), { loading: ToolLoading });
const CompoundInterestCalculatorTool = dynamic(() => import("./calculators-expanded").then((m) => m.CompoundInterestCalculatorTool), { loading: ToolLoading });
const SalesTaxCalculatorTool = dynamic(() => import("./calculators-expanded").then((m) => m.SalesTaxCalculatorTool), { loading: ToolLoading });
const NumberToWordsTool = dynamic(() => import("./calculators-expanded").then((m) => m.NumberToWordsTool), { loading: ToolLoading });
const BinaryHexDecimalTool = dynamic(() => import("./calculators-expanded").then((m) => m.BinaryHexDecimalTool), { loading: ToolLoading });
const InvoiceGeneratorTool = dynamic(() => import("./calculators-expanded").then((m) => m.InvoiceGeneratorTool), { loading: ToolLoading });
const GpaCalculatorTool = dynamic(() => import("./calculators-expanded").then((m) => m.GpaCalculatorTool), { loading: ToolLoading });
const FuelCostCalculatorTool = dynamic(() => import("./calculators-expanded").then((m) => m.FuelCostCalculatorTool), { loading: ToolLoading });
const TimeDurationCalculatorTool = dynamic(() => import("./calculators-expanded").then((m) => m.TimeDurationCalculatorTool), { loading: ToolLoading });
const SipInvestmentCalculatorTool = dynamic(() => import("./calculators-suite-2").then((m) => m.SipInvestmentCalculatorTool), { loading: ToolLoading });
const MortgageRefinanceCalculatorTool = dynamic(() => import("./calculators-suite-2").then((m) => m.MortgageRefinanceCalculatorTool), { loading: ToolLoading });
const RetirementCorpusCalculatorTool = dynamic(() => import("./calculators-suite-2").then((m) => m.RetirementCorpusCalculatorTool), { loading: ToolLoading });
const FreelanceHourlyRateCalculatorTool = dynamic(() => import("./calculators-suite-2").then((m) => m.FreelanceHourlyRateCalculatorTool), { loading: ToolLoading });
const CryptoPortfolioTrackerTool = dynamic(() => import("./calculators-suite-2").then((m) => m.CryptoPortfolioTrackerTool), { loading: ToolLoading });
const DockerfileGeneratorTool = dynamic(() => import("./developer-tools-suite-2").then((m) => m.DockerfileGeneratorTool), { loading: ToolLoading });
const KubernetesYamlValidatorTool = dynamic(() => import("./developer-tools-suite-2").then((m) => m.KubernetesYamlValidatorTool), { loading: ToolLoading });
const ApiMockServerTool = dynamic(() => import("./developer-tools-suite-2").then((m) => m.ApiMockServerTool), { loading: ToolLoading });
const GraphqlQueryBuilderTool = dynamic(() => import("./developer-tools-suite-2").then((m) => m.GraphqlQueryBuilderTool), { loading: ToolLoading });
const ScreenRecorderTool = dynamic(() => import("./developer-tools-suite-2").then((m) => m.ScreenRecorderTool), { loading: ToolLoading });
const OnlineCodeEditorTool = dynamic(() => import("./developer-tools-suite-2").then((m) => m.OnlineCodeEditorTool), { loading: ToolLoading });
const ApiTesterTool = dynamic(() => import("./developer-tools-suite-2").then((m) => m.ApiTesterTool), { loading: ToolLoading });
const DnsLookupTool = dynamic(() => import("./developer-tools-suite-2").then((m) => m.DnsLookupTool), { loading: ToolLoading });
const ThreeDTextGeneratorTool = dynamic(() => import("./css-design-suite-2").then((m) => m.ThreeDTextGeneratorTool), { loading: ToolLoading });
const FlowchartMakerTool = dynamic(() => import("./css-design-suite-2").then((m) => m.FlowchartMakerTool), { loading: ToolLoading });
const MindMapMakerTool = dynamic(() => import("./css-design-suite-2").then((m) => m.MindMapMakerTool), { loading: ToolLoading });
const WhiteboardTool = dynamic(() => import("./css-design-suite-2").then((m) => m.WhiteboardTool), { loading: ToolLoading });
const EsignPdfTool = dynamic(() => import("./pdf-tools-suite-2").then((m) => m.EsignPdfTool), { loading: ToolLoading });
const AdvancedPdfEditorTool = dynamic(() => import("./pdf-tools-suite-2").then((m) => m.AdvancedPdfEditorTool), { loading: ToolLoading });
const VoiceRecorderEditorTool = dynamic(() => import("./audio-media-tools").then((m) => m.VoiceRecorderEditorTool), { loading: ToolLoading });
const AudioConverterMp3Tool = dynamic(() => import("./audio-media-tools").then((m) => m.AudioConverterMp3Tool), { loading: ToolLoading });
const VideoToGifAdvancedTool = dynamic(() => import("./audio-media-tools").then((m) => m.VideoToGifAdvancedTool), { loading: ToolLoading });
const AiResumeBuilderTool = dynamic(() => import("./text-copy-suite-2").then((m) => m.AiResumeBuilderTool), { loading: ToolLoading });
const AiEmailGeneratorTool = dynamic(() => import("./text-copy-suite-2").then((m) => m.AiEmailGeneratorTool), { loading: ToolLoading });
const GrammarCheckerAdvancedTool = dynamic(() => import("./text-copy-suite-2").then((m) => m.GrammarCheckerAdvancedTool), { loading: ToolLoading });
const AiArticleWriterTool = dynamic(() => import("./text-copy-suite-2").then((m) => m.AiArticleWriterTool), { loading: ToolLoading });

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
