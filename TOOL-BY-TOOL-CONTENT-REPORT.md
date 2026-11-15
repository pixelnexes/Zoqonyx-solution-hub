# ZOQONYX — TOOL-BY-TOOL CONTENT & METADATA AUDIT REPORT

**Catalog Coverage**: 118 Active Public Client-Side Tools  
**Audit Standard**: Google Search Essentials, Semantic Heading Hierarchy (Single H1), Search-Intent Alignment & Technical Truthfulness  
**Date**: November 15, 2026

---

## 1. Audit Framework & Methodology

Every tool was audited against the following criteria:
1. **Heading Hierarchy**: Exactly one `<h1>` per page, descriptive `<h2>` sections (Practical Guide, Architecture & Technical Features, Deep Dive, FAQs, Related Tools).
2. **SEO Metadata**: Unique, click-optimized title (under 60 characters where practical), meta description (130–160 characters), canonical URL pointing to authoritative route without query strings.
3. **Introduction**: Problem-oriented explanation for human readers explaining what the tool does and who it helps.
4. **Practical Instructions**: Actionable, step-by-step guidance tailored to the exact tool capabilities.
5. **Supported Formats & Inputs**: Factual declaration of supported file types or data inputs.
6. **Output Delivery**: Clear explanation of exported formats (.webp, .png, .jsonld, .txt, .zip, etc.).
7. **Transparent Limitations**: Honest statement of processing scope and device-dependent limits.

---

## 2. Category Tool Audits

### 2.1 Image Tools (22 Active Tools)

| Tool Slug | H1 & SEO Title | Search Intent / Problem Solved | Supported Inputs & Outputs | Limitations & Privacy Disclosures | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `image-compressor` | **Image Compressor**<br>`Free Image Compressor: Compress JPG, PNG & WebP Online \| Zoqonyx` | Compressing photos to reduce webpage payload and meet upload limits without blurriness. | In: JPG, PNG, WebP<br>Out: JPG, WebP, ZIP | Single file split preview or up to 100 files & 1 GB in batch. 100% client-side memory. | **AUDITED & VERIFIED** |
| `image-format-converter` | **Image Format Converter**<br>`Convert PNG to WebP Online – Free Image Format Converter \| Zoqonyx` | Transcoding between WebP, PNG, JPG, and BMP in batch for speed and compatibility. | In: PNG, JPG, WebP, AVIF, BMP<br>Out: WebP, PNG, JPEG, ZIP | Up to 100 files & 1 GB. Vector SVG files cannot be output from raster canvas. | **AUDITED & VERIFIED** |
| `bulk-image-compressor` | **Bulk Image Compressor**<br>`Free Bulk Image Compressor Online (Up to 100 Files & 1 GB) \| Zoqonyx` | Batch compression of massive photo libraries with progress indicators and ZIP export. | In: JPG, PNG, WebP<br>Out: Compressed JPG/WebP in ZIP | Browser RAM determines maximum throughput; non-blocking Web Worker queues. | **AUDITED & VERIFIED** |
| `bulk-image-resizer` | **Bulk Image Resizer**<br>`Free Bulk Image Resizer Online (Up to 100 Files & 1 GB) \| Zoqonyx` | Batch scaling image dimensions with proportional lock and custom pixel fields. | In: JPG, PNG, WebP<br>Out: Scaled images in ZIP | Maximum combined 1 GB batch size. Canvas bicubic resampling. | **AUDITED & VERIFIED** |
| `image-resizer` | **Image Resizer**<br>`Free Image Resizer Online \| Zoqonyx` | Interactive visual drag handles for single-photo resizing and social media presets. | In: JPG, PNG, WebP<br>Out: Downloadable image | Single interactive canvas editing session. | **AUDITED & VERIFIED** |
| `image-cropper` | **Image Cropper**<br>`Free Image Cropper Online \| Zoqonyx` | Cropping avatars, rectangular heroes, and circular social profile photos. | In: JPG, PNG, WebP<br>Out: Cropped PNG/JPG | Bounded by uploaded canvas aspect ratio. | **AUDITED & VERIFIED** |
| `background-remover` | **Background Remover**<br>`Free AI Background Remover Online \| Zoqonyx` | Removing photo backgrounds client-side using edge-detection heuristics and canvas masking. | In: PNG, JPG, WebP<br>Out: Transparent PNG | Performs heuristic color segmentation locally; best on contrasting backdrops. | **AUDITED & VERIFIED** |
| `ai-watermark-remover` | **Watermark Remover**<br>`Free Watermark Remover Online \| Zoqonyx` | Interactive brush inpainting to erase overlay stamps and watermarks locally. | In: PNG, JPG, WebP<br>Out: Clean PNG | Client-side pixel inpainting; complex photographic textures may show blending. | **AUDITED & VERIFIED** |
| `object-remover-photo` | **Object Remover**<br>`Free Object Remover from Photo \| Zoqonyx` | Removing unwanted objects, passersby, and power lines with inpainting brush. | In: PNG, JPG, WebP<br>Out: Clean PNG | Inpainted locally using bicubic neighborhood blending. | **AUDITED & VERIFIED** |
| `image-upscaler` | **Image Upscaler**<br>`Free Image Upscaler Online \| Zoqonyx` | Scaling low-resolution images 2x/4x using bicubic canvas interpolation. | In: PNG, JPG<br>Out: High-res PNG | Algorithmic canvas interpolation; cannot invent new detail not present in source. | **AUDITED & VERIFIED** |
| `svg-to-png-converter` | **SVG to PNG Converter**<br>`Free SVG to PNG Converter Online \| Zoqonyx` | Rasterizing scalable vector graphics into crisp transparent PNG graphics. | In: Vector SVG (.svg)<br>Out: Transparent PNG | Parses vector paths into canvas raster buffer. | **AUDITED & VERIFIED** |
| `placeholder-image-generator` | **Placeholder Image Generator**<br>`Free Placeholder Image Generator Online \| Zoqonyx` | Generating mock UI image boxes with custom width, height, colors, and labels. | In: Dimension & color inputs<br>Out: Downloadable SVG / PNG | Generates synthetic mock images instantly. | **AUDITED & VERIFIED** |

---

### 2.2 PDF & Document Tools (12 Active Tools)

| Tool Slug | H1 & SEO Title | Search Intent / Problem Solved | Supported Inputs & Outputs | Limitations & Privacy Disclosures | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `pdf-merge` | **Merge PDF**<br>`Free Merge PDF Online (Up to 100 Files & 1 GB) \| Zoqonyx` | Combining multiple PDF documents, invoices, or chapters into a single file. | In: Up to 100 PDF files<br>Out: Merged .pdf document | 100% client-side pdf-lib WebAssembly execution. No files uploaded. | **AUDITED & VERIFIED** |
| `split-pdf` | **Split PDF**<br>`Free Split PDF Online \| Zoqonyx` | Extracting page ranges or splitting documents into separate page files. | In: PDF document<br>Out: Split PDF files / ZIP | Memory-safe parsing in browser memory. | **AUDITED & VERIFIED** |
| `compress-pdf` | **Compress PDF**<br>`Free Compress PDF Online (Up to 100 Files & 1 GB) \| Zoqonyx` | Reducing PDF file weight by re-encoding embedded stream bitmaps. | In: Up to 100 PDF files<br>Out: Compressed .pdf / ZIP | Text vector streams remain untouched; bitmap assets are optimized. | **AUDITED & VERIFIED** |
| `pdf-to-jpg` | **PDF to JPG**<br>`Free PDF to JPG Converter Online (Up to 100 Files) \| Zoqonyx` | Rendering PDF document pages into high-resolution JPG images. | In: PDF documents<br>Out: JPG images / ZIP | High page-count documents render progressively to avoid memory limits. | **AUDITED & VERIFIED** |
| `image-to-pdf` | **Image to PDF**<br>`Free Image to PDF Converter Online (Up to 100 Files & 1 GB) \| Zoqonyx` | Converting photo albums, receipts, or scans into a clean PDF document. | In: PNG, JPG, WebP<br>Out: Multi-page .pdf document | Up to 100 images; orientation matches image aspect ratio. | **AUDITED & VERIFIED** |
| `organize-pdf` | **Organize PDF**<br>`Free Organize PDF Online: Reorder & Delete Pages \| Zoqonyx` | Dragging and dropping page thumbnails to reorder or delete pages in a PDF. | In: PDF document<br>Out: Re-sequenced .pdf | Drag and drop thumbnail grid executed locally. | **AUDITED & VERIFIED** |

---

### 2.3 Developer & SEO Tools (35 Active Tools)

| Tool Slug | H1 & SEO Title | Search Intent / Problem Solved | Supported Inputs & Outputs | Limitations & Privacy Disclosures | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `backlink-checker` | **Backlink Checker**<br>`Free Backlink Checker & Backlink CSV Audit Tool \| Zoqonyx` | Inbound link profiling, CSV spreadsheet audits, spam TLD detection, and disavow export. | In: Domain name or backlink CSVs (GSC, Ahrefs, Moz, Semrush)<br>Out: Metrics dashboard, disavow.txt, CSV export | Operates client-side without paid third-party live crawler APIs. For live competitor crawls, import CSV exports. | **AUDITED & VERIFIED** |
| `schema-markup-generator` | **Schema Markup Generator**<br>`Free Schema Markup Generator: JSON-LD Structured Data \| Zoqonyx` | Building 10 Schema.org types (FAQ, Product, Article, LocalBusiness, HowTo, Recipe, Event) for Google search eligibility. | In: Form fields for 10 schema types<br>Out: Formatted JSON-LD script block, .jsonld file, Google Rich Results link | Structured data establishes eligibility for rich snippets; display is algorithmically determined by Google. | **AUDITED & VERIFIED** |
| `json-formatter` | **JSON Formatter & Validator**<br>`Free JSON Formatter & Validator Online \| Zoqonyx` | Beautifying minified JSON, validating syntax errors, and inspecting object trees. | In: Raw JSON string<br>Out: Formatted JSON with syntax highlighting | Client-side parsing; protects proprietary API payloads from cloud leaks. | **AUDITED & VERIFIED** |
| `meta-tags-generator` | **Meta Tags Generator**<br>`Free Meta Tags Generator Online \| Zoqonyx` | Generating SEO title, description, robots directives, and Open Graph social tags. | In: Webpage metadata inputs<br>Out: Copyable HTML <head> snippet | Measures character limits and pixel width estimates. | **AUDITED & VERIFIED** |
| `robots-txt-generator` | **Robots.txt Generator**<br>`Free Robots.txt Generator Online \| Zoqonyx` | Generating crawler crawl directives, user-agent rules, and sitemap paths. | In: Bot permissions & disallowed paths<br>Out: Valid robots.txt file | Follows standard Robots Exclusion Protocol (REP). | **AUDITED & VERIFIED** |
| `xml-sitemap-generator` | **XML Sitemap Generator**<br>`Free XML Sitemap Generator Online \| Zoqonyx` | Compiling URL lists with changefreq, priority, and lastmod tags into standard XML. | In: URL list and crawl parameters<br>Out: Standard sitemap.xml file | Generates W3C/Sitemaps.org schema-compliant XML. | **AUDITED & VERIFIED** |
| `qr-code-generator` | **QR Code Generator**<br>`Free QR Code Generator Online \| Zoqonyx` | Creating scannable QR codes for URLs, WiFi credentials, vCards, and plain text. | In: Text or URL<br>Out: Downloadable PNG / SVG QR code | High-density error correction levels (L, M, Q, H). | **AUDITED & VERIFIED** |
| `base64-encoder-decoder` | **Base64 Encoder / Decoder**<br>`Free Base64 Encoder & Decoder Online \| Zoqonyx` | Encoding binary strings to ASCII Base64 or decoding Base64 payloads safely. | In: UTF-8 text or Base64 string<br>Out: Decoded / Encoded string | Full Unicode multi-byte support via Uint8Array streams. | **AUDITED & VERIFIED** |

---

### 2.4 Text & Code Utilities (15 Active Tools)

| Tool Slug | H1 & SEO Title | Search Intent / Problem Solved | Supported Inputs & Outputs | Limitations & Privacy Disclosures | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ai-product-description` | **Product Description Generator for Shopify & Amazon**<br>`Free AI Product Description Generator for Shopify & Amazon \| Zoqonyx` | Creating high-converting product descriptions, Amazon 5-point bullets, and social ad scripts. | In: Product name, category, features, audience, tone<br>Out: 3 creative variants (Lifestyle, Specs, Problem-Solver), Markdown export | Client-side algorithmic copywriting engine; zero external cloud LLM dependencies. | **AUDITED & VERIFIED** |
| `ai-sales-pitch` | **Sales Pitch & Cold Outreach Playbook Generator**<br>`Free AI Sales Pitch Generator: B2B Cold Outreach Playbooks \| Zoqonyx` | Generating B2B sales playbooks: cold emails, 30s elevator pitches, cold call scripts, and objection matrices. | In: Prospect, problem, solution, CTA, framework<br>Out: Multi-touch playbook, Markdown export | Client-side structured sales framework generator; 100% private deal information. | **AUDITED & VERIFIED** |
| `word-counter` | **Word Counter**<br>`Free Word Counter & Character Count Tool \| Zoqonyx` | Measuring real-time word count, character count, sentence count, and reading time. | In: Pasted or typed text<br>Out: Statistical metrics table | Uses Intl.Segmenter for international grapheme and word boundary accuracy. | **AUDITED & VERIFIED** |
| `case-converter` | **Case Converter**<br>`Free Case Converter Online (UPPERCASE, lowercase, Title Case) \| Zoqonyx` | Converting text between uppercase, lowercase, title case, camelCase, snake_case, kebab-case. | In: Raw text<br>Out: Converted text | Preserves punctuation and spacing according to selected case rule. | **AUDITED & VERIFIED** |
| `text-diff` | **Text Diff Checker**<br>`Free Text Diff Checker Online \| Zoqonyx` | Side-by-side visual difference comparison highlighting additions, deletions, and edits. | In: Original text & Modified text<br>Out: Side-by-side and inline visual diff | Minimal edit distance computed locally using Myers' algorithm. | **AUDITED & VERIFIED** |

---

### 2.5 Calculators & Quantitative Tools (20 Active Tools)

| Tool Slug | H1 & SEO Title | Search Intent / Problem Solved | Supported Inputs & Outputs | Limitations & Privacy Disclosures | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `bmi-calculator` | **BMI Calculator**<br>`Free BMI Calculator – Calculate Body Mass Index Online \| Zoqonyx` | Evaluating adult Body Mass Index (BMI) using Metric (cm/kg) or Imperial (ft/in/lbs) with WHO categories. | In: Height & Weight<br>Out: BMI score, WHO classification, healthy weight range | Screening metric; does not directly measure body fat percentage. Data never saved. | **AUDITED & VERIFIED** |
| `age-calculator` | **Age Calculator**<br>`Free Age Calculator – Calculate Exact Chronological Age Online \| Zoqonyx` | Calculating chronological age and time elapsed between dates with leap year accuracy. | In: Date of birth & Target date<br>Out: Age in years, months, weeks, days, hours; birthday countdown | Gregorian calendar arithmetic; accounts for varying month lengths and leap years. | **AUDITED & VERIFIED** |
| `loan-emi-calculator` | **Loan EMI Calculator**<br>`Free Loan EMI Calculator Online \| Zoqonyx` | Computing monthly mortgage or auto loan payments, interest cost, and amortization schedules. | In: Principal, interest rate, tenure<br>Out: Monthly EMI, total interest, amortization schedule | Double-precision floating point formulas; consultation with lending bank advised for final contracts. | **AUDITED & VERIFIED** |
| `compound-interest-calculator` | **Compound Interest Calculator**<br>`Free Compound Interest Calculator Online \| Zoqonyx` | Projecting long-term investment growth with monthly contributions and variable compounding frequencies. | In: Initial deposit, monthly addition, annual rate, years<br>Out: Total balance, total interest earned, growth breakdown | Assumes steady annual rate without accounting for market volatility. | **AUDITED & VERIFIED** |
| `percentage-calculator` | **Percentage Calculator**<br>`Free Percentage Calculator Online \| Zoqonyx` | Calculating percentage increases, discounts, fractional shares, and difference ratios. | In: Numerical values<br>Out: Instant calculation results with step-by-step formulas | Double-precision IEEE 754 arithmetic with calibrated rounding. | **AUDITED & VERIFIED** |
| `aspect-ratio-calculator` | **Aspect Ratio Calculator**<br>`Free Aspect Ratio Calculator Online (16:9, 4:3, 21:9) \| Zoqonyx` | Calculating dimension proportions, scaling screen sizes, and computing crop coordinates. | In: Width, height, target dimension<br>Out: Proportional dimension and aspect ratio string | Real-time proportional calculation with standard aspect presets. | **AUDITED & VERIFIED** |

---

### 2.6 CSS & Design Generators (14 Active Tools)

| Tool Slug | H1 & SEO Title | Search Intent / Problem Solved | Supported Inputs & Outputs | Limitations & Privacy Disclosures | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `css-gradient-generator` | **CSS Gradient Generator**<br>`Free CSS Gradient Generator Online \| Zoqonyx` | Building linear, radial, and conic color gradients with multi-stop color pickers. | In: Color stops, angle, gradient type<br>Out: CSS background code & Tailwind classes | W3C CSS compliant with cross-browser syntax fallbacks. | **AUDITED & VERIFIED** |
| `border-radius-generator` | **Border Radius Generator**<br>`Free Border Radius Generator Online \| Zoqonyx` | Visual 8-point corner shaping for organic blob and button styling. | In: Corner percentage handles<br>Out: CSS border-radius code & Tailwind classes | Real-time reactive preview box. | **AUDITED & VERIFIED** |
| `box-shadow-generator` | **Box Shadow Generator**<br>`Free Box Shadow Generator Online \| Zoqonyx` | Layering multi-stop ambient shadows for subtle UI elevation. | In: Horizontal, vertical, blur, spread, opacity<br>Out: CSS box-shadow code & Tailwind classes | Generates clean CSS with zero unnecessary vendor prefixes. | **AUDITED & VERIFIED** |
| `flexbox-playground` | **Flexbox Playground**<br>`Free CSS Flexbox Playground & Code Generator \| Zoqonyx` | Interactive visual arrangement of flex containers, alignments, and wrapping. | In: Flex direction, justify, align, wrap<br>Out: CSS flexbox rules & interactive canvas | Renders live responsive flex child items. | **AUDITED & VERIFIED** |
| `contrast-checker` | **Color Palette + Contrast Checker**<br>`Free Color Contrast Checker (WCAG 2.1 AA/AAA) \| Zoqonyx` | Verifying color contrast ratios between text and backgrounds against accessibility standards. | In: Foreground & background hex codes<br>Out: Contrast ratio (e.g. 7.1:1), WCAG AA/AAA pass/fail badges | Evaluates against official W3C WCAG 2.1 relative luminance formulas. | **AUDITED & VERIFIED** |
