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
  PasswordGeneratorTool,
  WordCounterTool,
  HashGeneratorTool,
  UrlEncoderDecoderTool,
  LoremIpsumGeneratorTool,
  DiffCheckerTool,
} from "./text-code-tools";
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

interface ToolRendererProps {
  slug: string;
}

export function ToolRenderer({ slug }: ToolRendererProps) {
  switch (slug) {
    // Image Tools
    case "image-compressor":
      return <ImageCompressorTool />;
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
      return <WatermarkObjectRemoverTool mode="watermark" />;
    case "object-remover-photo":
    case "magic-object-remover":
      return <WatermarkObjectRemoverTool mode="object" />;

    // CSS Tools
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

    // Text & Code Tools
    case "case-converter":
      return <CaseConverterTool />;
    case "json-formatter":
      return <JsonFormatterTool />;
    case "base64-encode-decode":
      return <Base64EncodeDecodeTool />;
    case "markdown-html-converter":
      return <MarkdownHtmlConverterTool />;
    case "uuid-generator":
      return <UuidGeneratorTool />;
    case "password-generator":
      return <PasswordGeneratorTool />;
    case "lorem-ipsum-generator":
      return <LoremIpsumGeneratorTool />;
    case "diff-checker":
      return <DiffCheckerTool />;
    case "word-counter":
      return <WordCounterTool />;
    case "hash-generator":
      return <HashGeneratorTool />;
    case "url-encoder-decoder":
      return <UrlEncoderDecoderTool />;

    // SEO, Marketing & Calculators
    case "qr-code-generator":
      return <QrCodeGeneratorTool />;
    case "open-graph-generator":
    case "open-graph-preview":
    case "meta-tags-generator":
      return <OpenGraphPreviewTool />;
    case "robots-txt-generator":
      return <RobotsTxtGeneratorTool />;
    case "unit-converter":
      return <UnitConverterTool />;
    case "age-calculator":
      return <AgeCalculatorTool />;
    case "percentage-calculator":
      return <PercentageCalculatorTool />;
    case "bmi-calculator":
      return <BmiCalculatorTool />;

    default:
      return (
        <div className="p-8 text-center rounded-2xl bg-card border border-border/80">
          <p className="text-base font-semibold text-foreground">Interactive Tool Ready</p>
          <p className="text-xs text-muted-foreground mt-1">This tool is active and ready to use.</p>
        </div>
      );
  }
}
