const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Zoqonyx Solution Hub database...");

  // 1. Seed Admin User
  const existingAdmin = await prisma.user.findUnique({
    where: { username: "admin" },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("AdminPassword2026!", 10);
    await prisma.user.create({
      data: {
        username: "admin",
        password: hashedPassword,
      },
    });
    console.log("Created admin user: admin");
  }

  // 2. Seed Default Settings
  const defaultSettings = [
    { key: "site_name", value: "ZOQONYX Solution Hub" },
    { key: "site_tagline", value: "Free Online Tools Platform" },
    { key: "contact_email_primary", value: "hello@zoqonyx.com" },
    { key: "contact_email_secondary", value: "zawwar.ahmed2006@gmail.com" },
    { key: "footer_credit", value: "Developed by Newix Tech Solutions" },
    { key: "footer_url", value: "https://newixtechsolutions.com/" },
    { key: "logo_path", value: "/logo/zoqonyx-logo.png" },
    { key: "icon_path", value: "/logo/zoqonyx-icon.png" },
    { key: "primary_color", value: "#1E3A8A" },
    { key: "secondary_color", value: "#2563EB" },
    { key: "electric_cyan", value: "#06B6D4" },
    { key: "soft_purple", value: "#7C3AED" },
    { key: "default_theme", value: "system" },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  // 3. Seed Core Pages
  const defaultPages = [
    {
      slug: "about",
      title: "About Zoqonyx Solution Hub",
      metaTitle: "About Us | Zoqonyx Solution Hub - Free Online Tools Platform",
      metaDesc: "Learn about Zoqonyx Solution Hub, created by Newix Tech Solutions to provide fast, accessible, 100% free digital tools for everyone.",
      content: `### Welcome to Zoqonyx Solution Hub

Zoqonyx (pronounced *Zo-kon-ix*) is a comprehensive, modern online tools platform built to empower creators, developers, designers, marketers, students, and professionals with powerful, client-side, zero-cost digital utilities.

#### Our Mission
Our mission is simple: **Eliminate paywalls and software bloat for essential everyday digital tasks.** We believe everyone deserves instant access to high-performance image tools, code formatters, CSS generators, calculators, and SEO utilities without subscriptions, watermarks, or intrusive data collection.

#### Why Choose Zoqonyx?
- **100% Free**: No surprise paywalls, monthly subscription traps, or credit systems.
- **Privacy First**: Most tools run entirely inside your browser (client-side), meaning your images, code, and text never touch external servers without your permission.
- **Fast & Responsive**: Built on cutting-edge Next.js 15 technology for lightning-fast speeds and top Core Web Vitals performance.
- **Continuous Evolution**: Regularly expanding with next-generation tools, AI capabilities, and advanced workflow generators.

Zoqonyx is proudly designed and engineered by **Newix Tech Solutions** under the direction of **Zawwar Ahmed**.`,
    },
    {
      slug: "privacy-policy",
      title: "Privacy Policy",
      metaTitle: "Privacy Policy | Zoqonyx Solution Hub",
      metaDesc: "Read the Zoqonyx Solution Hub privacy policy. Learn how we prioritize client-side processing to ensure your data stays secure and private.",
      content: `### Privacy Policy

*Effective Date: October 2026*

At Zoqonyx Solution Hub (https://zoqonyx.com), we place the highest priority on user privacy and data security. This Privacy Policy outlines what information we collect, how it is handled, and why your data is secure with us.

#### 1. Client-Side Processing Architecture
The vast majority of utilities on Zoqonyx operate **client-side directly within your web browser** using HTML5 Canvas, Web Crypto API, Web Workers, and local JavaScript. When you compress an image, convert text, format JSON, generate CSS, or create a QR code:
- Your files and inputs are processed locally on your device.
- Your sensitive files are **not** uploaded to or stored on our servers.

#### 2. Information We Collect
- **Contact Inquiries**: When you submit a message through our Contact form, we collect your name, email address, and message content solely to reply to your inquiry.
- **Tool Notifications**: If you opt into email alerts for Coming Soon tools, we store your email address solely to notify you when the tool goes live.
- **Technical Logs**: Standard web server logs (IP address, browser user-agent, pages viewed) for uptime monitoring and DDoS prevention.

#### 3. Cookies and Analytics
We may use lightweight, privacy-friendly cookies to store your preferred visual theme (Light / Dark mode). We do not sell, rent, or trade your personal information.

#### 4. Contact Us
For any privacy questions or requests, contact us at:
- **Email**: hello@zoqonyx.com / zawwar.ahmed2006@gmail.com
- **Website**: https://zoqonyx.com`,
    },
    {
      slug: "terms",
      title: "Terms of Service",
      metaTitle: "Terms of Service | Zoqonyx Solution Hub",
      metaDesc: "Read the terms of service governing your use of Zoqonyx Solution Hub's free online tools and utilities.",
      content: `### Terms of Service

*Effective Date: October 2026*

By accessing or using Zoqonyx Solution Hub (https://zoqonyx.com), you agree to comply with and be bound by the following Terms of Service.

#### 1. Permitted Use
Zoqonyx grants you a non-exclusive, revocable, free license to use our tools and utilities for personal, educational, commercial, and professional projects. You may freely use the outputs generated by our tools (such as images, CSS, formatted code, QR codes, and calculators) without royalties or attribution.

#### 2. Acceptable Use
You agree not to use Zoqonyx for:
- Any unlawful purpose, including malware distribution or unauthorized scraping.
- Attempting to disrupt, compromise, or bypass the platform's security, server infrastructure, or administrative endpoints.

#### 3. Disclaimer of Warranties
Zoqonyx tools are provided on an "as is" and "as available" basis without warranties of any kind. While we strive for extreme accuracy and reliability, we do not warrant that calculations, conversions, or outputs are error-free.

#### 4. Attribution & Ownership
Zoqonyx Solution Hub is developed and owned by Newix Tech Solutions and Zawwar Ahmed. All brand identity, logos, custom software architecture, and website content are protected by intellectual property laws.`,
    },
  ];

  for (const p of defaultPages) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  // 4. Seed Initial Tools Catalog
  const tools = [
    // --- Active Image Tools ---
    {
      slug: "image-compressor",
      name: "Image Compressor",
      description: "Compress JPG, PNG, and WebP images client-side with zero quality loss and instant savings preview.",
      category: "Image Tools",
      isActive: true,
      isComingSoon: false,
      icon: "FileArchive",
      order: 1,
      metaTitle: "Free Image Compressor Online - Reduce File Size Fast | Zoqonyx",
      metaDesc: "Compress JPEG, PNG, and WebP images online for free. Adjust quality in real-time, preserve visual fidelity, and download reduced files instantly.",
      content: `## Free Online Image Compressor

Optimize your images instantly without compromising visual fidelity. The Zoqonyx Image Compressor processes images directly in your browser using high-performance canvas algorithms.

### Key Benefits
- **Zero Server Uploads**: Your private photos never leave your device.
- **Custom Quality Control**: Fine-tune your compression ratio between 1% and 100%.
- **Live Size Comparison**: See original vs compressed file sizes with exact percentage reduction before downloading.
- **Multiple Formats**: Supports JPEG, PNG, WebP, and AVIF.

### Frequently Asked Questions
**Does image compression affect SEO?**
Yes! Faster loading images drastically improve Core Web Vitals (LCP), leading to better Google rankings and reduced bounce rates.`,
    },
    {
      slug: "image-resizer",
      name: "Image Resizer",
      description: "Resize images by exact pixels or percentage with aspect ratio lock and high-definition smoothing.",
      category: "Image Tools",
      isActive: true,
      isComingSoon: false,
      icon: "Maximize2",
      order: 2,
      metaTitle: "Free Image Resizer Online - Change Picture Dimensions | Zoqonyx",
      metaDesc: "Resize image dimensions online for free. Lock aspect ratio, enter target dimensions or percentage scaling, and export in seconds.",
      content: `## Fast & Free Image Resizer

Quickly resize images for social media headers, profile avatars, website banners, and e-commerce listings with zero blurriness.

### Features
- Scale by pixel dimensions (width/height) or scale factor percentage.
- Automatic aspect ratio locking to prevent distortion.
- Instant client-side download with smooth interpolation.`,
    },
    {
      slug: "image-format-converter",
      name: "Image Format Converter",
      description: "Convert photos seamlessly between PNG, JPG, WebP, AVIF, and BMP formats in your browser.",
      category: "Image Tools",
      isActive: true,
      isComingSoon: false,
      icon: "RefreshCw",
      order: 3,
      metaTitle: "Image Format Converter Online - Convert PNG, JPG, WebP | Zoqonyx",
      metaDesc: "Easily convert between PNG, JPG, WebP, and BMP format online. 100% free client-side image converter with high quality output.",
      content: `## Universal Image Format Converter

Convert any image to modern formats like WebP for ultra-fast website loading, or export transparent PNGs with a single click.`,
    },
    {
      slug: "color-picker-image",
      name: "Color Picker from Image",
      description: "Extract color palettes and pinpoint exact HEX, RGB, and HSL values from any uploaded image.",
      category: "Image Tools",
      isActive: true,
      isComingSoon: false,
      icon: "Pipette",
      order: 4,
      metaTitle: "Color Picker from Image - Extract HEX & RGB Codes | Zoqonyx",
      metaDesc: "Upload an image and use our precision magnifying eyedropper to extract exact HEX, RGB, and HSL color values instantly.",
      content: `## Precise Eyedropper & Palette Extractor

Find exact color harmonies and inspect design colors directly from UI screenshots, photographs, or graphics.`,
    },
    {
      slug: "qr-code-generator",
      name: "QR Code Generator",
      description: "Generate custom QR codes for URLs, text, Wi-Fi credentials, and contact cards with custom colors.",
      category: "Image Tools",
      isActive: true,
      isComingSoon: false,
      icon: "QrCode",
      order: 5,
      metaTitle: "Free QR Code Generator Online - Create Custom QR Codes | Zoqonyx",
      metaDesc: "Create high-resolution QR codes for websites, Wi-Fi passwords, text, and vCards. Customize colors and download in PNG format.",
      content: `## High-Resolution Custom QR Code Generator

Create scannable, crystal-clear QR codes for print marketing, restaurant menus, Wi-Fi sharing, and digital business cards.`,
    },
    {
      slug: "image-cropper",
      name: "Image Cropper",
      description: "Crop photos to square 1:1, 16:9, 4:3, or custom dimensions with interactive canvas preview.",
      category: "Image Tools",
      isActive: true,
      isComingSoon: false,
      icon: "Crop",
      order: 6,
      metaTitle: "Free Image Cropper Online - Crop Pictures Easily | Zoqonyx",
      metaDesc: "Crop images online with preset aspect ratios for Instagram, YouTube, and LinkedIn, or create custom crops with live canvas preview.",
      content: `## Browser-Based Free Image Cropper

Crop your images with precision without installing expensive photo editing suites.`,
    },
    {
      slug: "image-rotator-flipper",
      name: "Image Rotator & Flipper",
      description: "Rotate images 90, 180, or 270 degrees and flip horizontally or vertically with real-time preview.",
      category: "Image Tools",
      isActive: true,
      isComingSoon: false,
      icon: "RotateCw",
      order: 7,
      metaTitle: "Rotate & Flip Images Online Free | Zoqonyx Solution Hub",
      metaDesc: "Quickly rotate images clockwise, counter-clockwise, or mirror flip horizontally and vertically in your browser.",
      content: `## Rotate and Mirror Images Online

Fix sideways mobile photos or create mirror effects in one click.`,
    },
    {
      slug: "image-to-base64",
      name: "Image to Base64 Converter",
      description: "Convert any image file into Base64 Data URI strings for HTML, CSS, and markdown embedding.",
      category: "Image Tools",
      isActive: true,
      isComingSoon: false,
      icon: "Binary",
      order: 8,
      metaTitle: "Image to Base64 Converter Online - Free Data URI Tool | Zoqonyx",
      metaDesc: "Convert image files to Base64 strings. Copy raw string, HTML <img> tag, or CSS background syntax instantly.",
      content: `## Image to Base64 Data URI Converter

Embed images directly into your HTML and CSS files to eliminate extra HTTP requests.`,
    },
    {
      slug: "ai-watermark-remover",
      name: "AI Watermark Remover",
      description: "Erase watermarks, logos, timestamps, and AI generator labels from photos using client-side canvas inpainting.",
      category: "Image Tools",
      isActive: true,
      isComingSoon: false,
      icon: "Sparkles",
      order: 9,
      metaTitle: "AI Watermark Remover Online - Remove Watermarks Free | Zoqonyx",
      metaDesc: "Remove watermarks, logos, copyright text, and timestamps from images and AI photos for free with interactive brush inpainting.",
      content: `## Free Online AI Watermark Remover

Erase watermarks, stock stamps, date tags, and AI engine logos seamlessly without quality degradation. 100% private in-browser processing.`,
    },
    {
      slug: "object-remover-photo",
      name: "Photo Object Remover",
      description: "Magic eraser tool to remove unwanted people, photobombers, wires, and clutter from photos instantly.",
      category: "Image Tools",
      isActive: true,
      isComingSoon: false,
      icon: "Eraser",
      order: 10,
      metaTitle: "Object Remover from Photo Online - Free Magic Eraser | Zoqonyx",
      metaDesc: "Erase unwanted objects, photobombers, blemishes, and clutter from photos online for free. Brush over items and reconstruct background textures.",
      content: `## Magic Object Remover from Photo

Clean up your travel snapshots and portraits by brushing over unwanted distractions with client-side patch inpainting.`,
    },

    // --- Active CSS & Design Generators ---
    {
      slug: "border-radius-generator",
      name: "Border Radius Generator",
      description: "Visually configure 8-value fancy CSS border radius with real-time box preview and one-click copy.",
      category: "CSS & Design",
      isActive: true,
      isComingSoon: false,
      icon: "Square",
      order: 10,
      metaTitle: "CSS Border Radius Generator - Visual 8-Value Tool | Zoqonyx",
      metaDesc: "Design modern organic shapes and smooth rounded corners with our interactive 8-point CSS border radius generator.",
      content: `## Interactive CSS Border Radius Generator

Create modern organic blobs and custom card borders visually. Copy clean CSS declarations ready for production.`,
    },
    {
      slug: "box-shadow-generator",
      name: "Box Shadow Generator",
      description: "Build layered, realistic CSS box shadows with blur, spread, opacity, color, and inset controls.",
      category: "CSS & Design",
      isActive: true,
      isComingSoon: false,
      icon: "Layers",
      order: 11,
      metaTitle: "CSS Box Shadow Generator - Create Smooth Elevation Shadows | Zoqonyx",
      metaDesc: "Design realistic, multi-layered CSS box shadows with interactive sliders for blur, spread, offset, and color.",
      content: `## Modern CSS Box Shadow Generator

Add depth and elevation to your UI components with realistic, smooth shadows.`,
    },
    {
      slug: "css-gradient-generator",
      name: "CSS Gradient Generator",
      description: "Craft vibrant linear and radial CSS gradients with multi-color stops, angles, and preset palettes.",
      category: "CSS & Design",
      isActive: true,
      isComingSoon: false,
      icon: "Palette",
      order: 12,
      metaTitle: "CSS Gradient Generator - Linear & Radial Backgrounds | Zoqonyx",
      metaDesc: "Generate beautiful CSS gradients with color stops, angle controls, and copy-paste ready CSS background code.",
      content: `## Free CSS Gradient Generator

Create stunning gradients with custom color stops, angles, and copy clean CSS code instantly.`,
    },
    {
      slug: "button-generator",
      name: "CSS Button Generator",
      description: "Design interactive modern CSS buttons with hover states, gradients, shadows, and icons.",
      category: "CSS & Design",
      isActive: true,
      isComingSoon: false,
      icon: "MousePointerClick",
      order: 13,
      metaTitle: "CSS Button Generator - Design Interactive Buttons | Zoqonyx",
      metaDesc: "Create stylish buttons with CSS styling, hover effects, padding, border-radius, and ready-to-use HTML/CSS code.",
      content: `## Interactive CSS Button Styler

Design call-to-action buttons for websites and landing pages with custom padding, borders, shadows, and hover transitions.`,
    },
    {
      slug: "flexbox-playground",
      name: "Flexbox Playground",
      description: "Interactive visual flexbox builder with flex-direction, justify-content, align-items, and gap controls.",
      category: "CSS & Design",
      isActive: true,
      isComingSoon: false,
      icon: "LayoutGrid",
      order: 14,
      metaTitle: "CSS Flexbox Playground - Interactive Layout Builder | Zoqonyx",
      metaDesc: "Master and preview CSS Flexbox visually. Adjust justify-content, align-items, flex-direction, and copy the CSS layout code.",
      content: `## Visual CSS Flexbox Playground

Learn and build flexbox layouts visually. Add or remove items, change alignment properties, and export pure CSS.`,
    },
    {
      slug: "glassmorphism-generator",
      name: "Glassmorphism Generator",
      description: "Generate modern frosted glass UI effects using CSS backdrop-filter, border opacity, and blur.",
      category: "CSS & Design",
      isActive: true,
      isComingSoon: false,
      icon: "Sparkles",
      order: 15,
      metaTitle: "Glassmorphism CSS Generator - Frosted Glass UI | Zoqonyx",
      metaDesc: "Create trendy frosted glass cards with interactive sliders for backdrop blur, transparency, border, and shadow.",
      content: `## Frosted Glass Glassmorphism Generator

Produce the Apple-style frosted glass UI aesthetic with CSS backdrop-filter blur and subtle transparent borders.`,
    },
    {
      slug: "css-grid-generator",
      name: "CSS Grid Generator",
      description: "Visual interactive CSS grid builder with columns, rows, gap, and item layout controls.",
      category: "CSS & Design",
      isActive: true,
      isComingSoon: false,
      icon: "LayoutGrid",
      order: 16,
      metaTitle: "CSS Grid Generator - Visual Layout Builder | Zoqonyx",
      metaDesc: "Create responsive CSS Grid layouts with real-time preview and export clean CSS grid-template code.",
      content: `## Interactive CSS Grid Generator

Build complex responsive grid layouts visually and copy clean CSS declarations for your web applications.`,
    },

    // --- Active Text & Code Tools ---
    {
      slug: "case-converter",
      name: "Case Converter",
      description: "Convert text instantly between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case.",
      category: "Text & Code",
      isActive: true,
      isComingSoon: false,
      icon: "Type",
      order: 20,
      metaTitle: "Case Converter Online - Upper, Lower, Camel, Snake Case | Zoqonyx",
      metaDesc: "Convert text cases online for free. Transform titles, code variable names, slugify text, and copy to clipboard.",
      content: `## Universal Text Case Converter

Easily switch text casing for programmers, writers, and copy editors. Supports Sentence case, Title Case, UPPERCASE, lowercase, camelCase, PascalCase, snake_case, and kebab-case.`,
    },
    {
      slug: "json-formatter",
      name: "JSON Formatter & Validator",
      description: "Format, beautify, validate, minify, and inspect JSON with detailed syntax error highlighting.",
      category: "Text & Code",
      isActive: true,
      isComingSoon: false,
      icon: "Code2",
      order: 21,
      metaTitle: "Free JSON Formatter & Validator Online | Zoqonyx Solution Hub",
      metaDesc: "Format and validate JSON online with syntax highlighting, indentation options (2 or 4 spaces), minification, and instant error line detection.",
      content: `## High-Performance JSON Formatter & Validator

Clean up messy JSON payloads, validate structure, minify for production, and spot syntax mistakes in seconds.`,
    },
    {
      slug: "base64-encode-decode",
      name: "Base64 Encoder & Decoder",
      description: "Encode text to Base64 or decode Base64 strings back to clean UTF-8 text safely and securely.",
      category: "Text & Code",
      isActive: true,
      isComingSoon: false,
      icon: "FileCode",
      order: 22,
      metaTitle: "Base64 Encode and Decode Online - Fast & Free | Zoqonyx",
      metaDesc: "Encode strings to Base64 or decode Base64 data to plain text. 100% client-side with UTF-8 character support.",
      content: `## Secure Base64 Text Encoder & Decoder

Convert UTF-8 text strings to Base64 format and decode encoded data safely in your browser.`,
    },
    {
      slug: "markdown-html-converter",
      name: "Markdown <-> HTML Converter",
      description: "Convert Markdown to clean HTML or convert HTML into formatted Markdown with live split-screen preview.",
      category: "Text & Code",
      isActive: true,
      isComingSoon: false,
      icon: "FileText",
      order: 23,
      metaTitle: "Markdown to HTML & HTML to Markdown Converter | Zoqonyx",
      metaDesc: "Convert Markdown syntax to HTML markup and vice-versa with live dual-pane preview and one-click copy.",
      content: `## Live Markdown and HTML Converter

Write Markdown and get instant semantic HTML, or paste HTML to get clean GitHub-flavored Markdown.`,
    },
    {
      slug: "uuid-generator",
      name: "UUID / GUID Generator",
      description: "Generate cryptographically secure Version 4 UUIDs in bulk with uppercase, lowercase, and hyphen options.",
      category: "Text & Code",
      isActive: true,
      isComingSoon: false,
      icon: "Key",
      order: 24,
      metaTitle: "UUID / GUID Generator Online - Cryptographically Secure | Zoqonyx",
      metaDesc: "Generate single or bulk Version 4 UUIDs using browser crypto. getRandomValues. Customize format with uppercase or hyphens.",
      content: `## RFC 4122 v4 UUID Generator

Generate unique identifiers using the browser's native Web Crypto API for maximum randomness and security.`,
    },
    {
      slug: "password-generator",
      name: "Password Generator",
      description: "Generate ultra-secure, random passwords with custom length, symbols, numbers, and entropy meter.",
      category: "Text & Code",
      isActive: true,
      isComingSoon: false,
      icon: "Lock",
      order: 25,
      metaTitle: "Strong Password Generator Online - Secure & Random | Zoqonyx",
      metaDesc: "Create unbreakable, secure passwords with custom character sets, entropy score calculation, and zero server storage.",
      content: `## Cryptographically Secure Password Generator

Protect your online accounts with cryptographically strong random passwords generated purely on your device.`,
    },
    {
      slug: "lorem-ipsum-generator",
      name: "Lorem Ipsum Generator",
      description: "Generate dummy placeholder text by paragraphs, sentences, or word counts for designers and developers.",
      category: "Text & Code",
      isActive: true,
      isComingSoon: false,
      icon: "Pilcrow",
      order: 26,
      metaTitle: "Lorem Ipsum Generator - Dummy Text for Designers | Zoqonyx",
      metaDesc: "Generate standard Lorem Ipsum dummy placeholder text for website mockups, layouts, and typography testing.",
      content: `## Free Lorem Ipsum Generator

Quickly generate placeholder text for mockups, graphic designs, and web layouts.`,
    },
    {
      slug: "word-counter",
      name: "Word & Character Counter",
      description: "Count words, characters, sentences, paragraphs, and calculate estimated reading and speaking times.",
      category: "Text & Code",
      isActive: true,
      isComingSoon: false,
      icon: "AlignLeft",
      order: 27,
      metaTitle: "Word Counter & Character Count Tool Online | Zoqonyx",
      metaDesc: "Real-time word counter, character counter, sentence counter, and reading time estimator for essays, articles, and social posts.",
      content: `## Real-Time Word & Character Counter

Analyze your text metrics in real-time. Track character limits for Twitter/X, Google Meta descriptions, and essays.`,
    },
    {
      slug: "hash-generator",
      name: "Hash Generator",
      description: "Generate SHA-1, SHA-256, SHA-384, SHA-512, and MD5 cryptographic hashes from any input text.",
      category: "Text & Code",
      isActive: true,
      isComingSoon: false,
      icon: "Hash",
      order: 28,
      metaTitle: "Hash Generator Online - SHA-256, SHA-512, MD5 | Zoqonyx",
      metaDesc: "Calculate cryptographic hash digests using Web Crypto API. Support for SHA-256, SHA-512, SHA-1, and MD5.",
      content: `## Cryptographic Hash Digest Generator

Compute cryptographic checksums and hash digests client-side using industry-standard hashing algorithms.`,
    },
    {
      slug: "url-encoder-decoder",
      name: "URL Encoder & Decoder",
      description: "Encode strings into percent-encoded URI format or decode complex URLs and query strings safely.",
      category: "Text & Code",
      isActive: true,
      isComingSoon: false,
      icon: "Link2",
      order: 29,
      metaTitle: "URL Encoder & Decoder Online - URI Percent Encoding | Zoqonyx",
      metaDesc: "Encode and decode URLs, query parameters, and URI components online with UTF-8 character compatibility.",
      content: `## URL Percent Encoding & Decoding Tool

Ensure query parameters and URL components are safely encoded according to RFC 3986.`,
    },
    {
      slug: "diff-checker",
      name: "Diff Checker",
      description: "Compare two text snippets side-by-side with line-by-line difference highlighting.",
      category: "Text & Code",
      isActive: true,
      isComingSoon: false,
      icon: "GitCompare",
      order: 30,
      metaTitle: "Text Diff Checker Online - Compare Text Difference | Zoqonyx",
      metaDesc: "Compare two text documents side-by-side and highlight additions, removals, and changes instantly in your browser.",
      content: `## Online Text Diff Checker

Spot differences between code files, essays, or text documents with side-by-side visual difference highlighting.`,
    },

    // --- Active SEO & Developer Tools ---
    {
      slug: "open-graph-generator",
      name: "Open Graph & Social Card Generator",
      description: "Preview and generate Open Graph, Twitter Cards, and Next.js metadata with live simulators for X, Facebook, LinkedIn, Google, and WhatsApp.",
      category: "Developer & SEO",
      isActive: true,
      isComingSoon: false,
      icon: "Share2",
      order: 34,
      metaTitle: "Open Graph Generator & Social Card Preview Tool | Zoqonyx",
      metaDesc: "Generate 100% valid Open Graph, Twitter Cards, and Next.js metadata. Live pixel-accurate simulator for X, Facebook, LinkedIn, Google, and WhatsApp.",
      content: `## Open Graph Generator & Social Card Simulator

Maximize click-through rates across Twitter/X, Facebook, LinkedIn, and search engines with pixel-accurate live card previews and code export.`,
    },
    {
      slug: "meta-tags-generator",
      name: "Meta Tags Generator",
      description: "Generate complete HTML meta tags, Open Graph, and Twitter Cards with live Google search snippet preview.",
      category: "Developer & SEO",
      isActive: true,
      isComingSoon: false,
      icon: "Globe",
      order: 35,
      metaTitle: "Meta Tags Generator - Open Graph & Twitter Cards | Zoqonyx",
      metaDesc: "Generate SEO-optimized title, description, Open Graph, and Twitter Card meta tags with live social previews.",
      content: `## Complete SEO Meta Tags & Open Graph Generator

Boost click-through rates on Google, Facebook, Twitter, and LinkedIn with properly formatted meta tags.`,
    },
    {
      slug: "robots-txt-generator",
      name: "Robots.txt Generator",
      description: "Create standard robots.txt files with custom user-agents, allow/disallow directives, and sitemap paths.",
      category: "Developer & SEO",
      isActive: true,
      isComingSoon: false,
      icon: "Bot",
      order: 36,
      metaTitle: "Robots.txt Generator Online - Create Crawl Rules | Zoqonyx",
      metaDesc: "Generate a clean robots.txt file to guide search engine crawlers like Googlebot, Bingbot, and protect private paths.",
      content: `## Free Robots.txt Generator

Tell search engine web crawlers which URLs they can access on your site to optimize crawl budget.`,
    },
    {
      slug: "unit-converter",
      name: "CSS Unit Converter",
      description: "Convert units seamlessly between pixels (px), rem, em, percentage (%), and points (pt) with custom root base.",
      category: "Developer & SEO",
      isActive: true,
      isComingSoon: false,
      icon: "ArrowRightLeft",
      order: 37,
      metaTitle: "CSS Unit Converter - px to rem, em, and % | Zoqonyx",
      metaDesc: "Convert between px, rem, em, and % instantly. Set custom root font size (16px default) for fluid responsive typography.",
      content: `## CSS Unit Converter (px to rem, em, %)

Simplify responsive design calculations by converting pixel values to scalable rem and em units.`,
    },

    // --- Active Calculators & Utilities ---
    {
      slug: "age-calculator",
      name: "Age Calculator",
      description: "Calculate exact chronological age in years, months, weeks, days, hours, and minutes with next birthday countdown.",
      category: "Calculators",
      isActive: true,
      isComingSoon: false,
      icon: "Calendar",
      order: 40,
      metaTitle: "Age Calculator Online - Calculate Exact Age | Zoqonyx",
      metaDesc: "Calculate your exact age in years, months, and days from date of birth, plus days remaining until next birthday.",
      content: `## Precise Chronological Age Calculator

Find out your exact age down to the day, along with interesting milestones and your upcoming birthday countdown.`,
    },
    {
      slug: "percentage-calculator",
      name: "Percentage Calculator",
      description: "Solve percentage problems quickly: X% of Y, percentage increase/decrease, and what percent X is of Y.",
      category: "Calculators",
      isActive: true,
      isComingSoon: false,
      icon: "Percent",
      order: 41,
      metaTitle: "Percentage Calculator Online - Quick Math Tool | Zoqonyx",
      metaDesc: "Calculate percentages easily. Find percentage increase, percentage discount, and fraction percentages instantly.",
      content: `## All-in-One Percentage Calculator

Calculate discounts, markups, tips, test scores, and percentage changes with step-by-step formulas.`,
    },
    {
      slug: "bmi-calculator",
      name: "BMI Calculator",
      description: "Calculate Body Mass Index (BMI) using Metric or Imperial units with WHO weight category evaluation.",
      category: "Calculators",
      isActive: true,
      isComingSoon: false,
      icon: "Activity",
      order: 42,
      metaTitle: "BMI Calculator Online - Body Mass Index Chart | Zoqonyx",
      metaDesc: "Calculate your Body Mass Index (BMI) using height and weight. Understand your healthy weight range with official WHO categories.",
      content: `## Free BMI (Body Mass Index) Calculator

Determine your BMI score using metric (cm/kg) or imperial (ft/in/lbs) units and view healthy body mass guidance.`,
    },

    // --- Coming Soon Tools (Full SEO Content + Animated Component) ---
    {
      slug: "ai-background-remover-pro",
      name: "AI Background Remover Pro",
      description: "Ultra-high definition AI background removal for complex hair, transparent fabrics, and product photography.",
      category: "Advanced Image / AI",
      isActive: true,
      isComingSoon: true,
      icon: "Sparkles",
      order: 100,
      metaTitle: "AI Background Remover Pro - Remove Image Backgrounds Online | Zoqonyx",
      metaDesc: "Remove backgrounds from images automatically in seconds with deep learning AI. Perfect for e-commerce, portraits, and marketing.",
      content: `## Professional AI Background Remover

Say goodbye to manual clipping paths and tedious lasso tool selections. The upcoming Zoqonyx AI Background Remover Pro uses advanced neural network edge detection to isolate subjects with pinpoint hair and boundary accuracy.

### Planned Capabilities
- **One-Click Instant Extraction**: Upload any portrait, product photo, animal, or graphic, and let the AI compute clean transparency in under 3 seconds.
- **Feathered Hair & Fur Handling**: Deep learning segmentation trained on millions of high-resolution images to preserve fine strands of hair and semi-transparent fabrics.
- **Custom Background Replacements**: Swap transparent backgrounds with solid studio backdrops, aesthetic gradients, or custom uploaded scenes.
- **Batch Processing**: Upload dozens of product catalog images at once for automated e-commerce optimization.

### Why Quality Background Removal Matters
For digital retailers selling on Shopify, Amazon, or eBay, high-quality isolated product photography increases conversion rates by up to 35%. Zoqonyx is engineering a zero-compromise, free-tier accessible solution to make professional editing available to all creators.

Be the first to know when AI Background Remover Pro goes live by entering your email above!`,
    },
    {
      slug: "ai-image-upscaler",
      name: "AI Image Upscaler",
      description: "Enlarge images up to 4x and 8x resolution without pixelation using generative super-resolution AI.",
      category: "Advanced Image / AI",
      isActive: true,
      isComingSoon: true,
      icon: "Zap",
      order: 101,
      metaTitle: "AI Image Upscaler - Enlarge Photos Without Quality Loss | Zoqonyx",
      metaDesc: "Upscale low-resolution photos and digital art up to 8x resolution with AI detail enhancement. Free coming soon on Zoqonyx.",
      content: `## Generative AI Image Upscaler

Restore low-resolution images, vintage family photographs, and compressed graphics into crisp, 4K print-ready masterpieces.

### Advanced Super-Resolution Architecture
Unlike standard bicubic interpolation that blurs pixels, our AI model predicts and synthesizes missing high-frequency details, textures, and edges.

### Target Applications
- Print production for posters and merchandise.
- Enhancing low-res smartphone photos.
- Sharpening AI-generated artworks for wall displays.`,
    },
    {
      slug: "ai-content-writer",
      name: "AI Content Writer",
      description: "Generate compelling blog articles, marketing copy, social media hooks, and sales copy powered by LLMs.",
      category: "AI Writing & Business",
      isActive: true,
      isComingSoon: true,
      icon: "PenTool",
      order: 102,
      metaTitle: "AI Content Writer - Generate Articles & Marketing Copy | Zoqonyx",
      metaDesc: "Craft high-ranking SEO articles, engaging newsletters, and persuasive ad copy with Zoqonyx AI Content Writer.",
      content: `## Next-Gen AI Content & Copywriting Engine

Supercharge your content workflow with an intelligent assistant designed to produce human-sounding, authoritative copy across any niche.

### Key Content Templates
- Long-form SEO blog posts with structured headings and FAQs.
- High-converting email marketing sequences and pitch emails.
- Viral social media hooks for X, LinkedIn, and Instagram.
- E-commerce product descriptions tailored to increase buyer urgency.`,
    },
    {
      slug: "ai-full-pdf-editor",
      name: "Full PDF Editor Online",
      description: "Edit text, rearrange pages, insert signatures, and annotate PDF documents directly in the browser.",
      category: "PDF & Documents",
      isActive: true,
      isComingSoon: true,
      icon: "FileEdit",
      order: 103,
      metaTitle: "Full PDF Editor Online - Edit Text & Sign Documents Free | Zoqonyx",
      metaDesc: "Edit PDF text, merge contracts, insert digital e-signatures, and annotate pages online with Zoqonyx PDF Editor.",
      content: `## Complete Online PDF Editing Suite

Manage and edit your business documents without expensive Adobe Acrobat subscriptions.

### Planned Features
- In-place text editing and font matching.
- Visual page reordering, rotation, and deletion.
- Legally binding electronic signatures (eSign).
- Form field filling and PDF form creation.`,
    },
    {
      slug: "full-site-audit-tool",
      name: "Full Website SEO Audit",
      description: "Analyze any domain for Core Web Vitals, broken links, meta tag health, and indexing bottlenecks.",
      category: "SEO & Marketing",
      isActive: true,
      isComingSoon: true,
      icon: "SearchCheck",
      order: 104,
      metaTitle: "Website SEO Audit Tool - Deep Site Health Analysis | Zoqonyx",
      metaDesc: "Audit your website for technical SEO issues, page speed warnings, broken links, and mobile responsiveness.",
      content: `## Comprehensive Technical SEO Site Auditor

Uncover critical technical issues holding your website back from Google page 1 rankings.

### What We Inspect
- Status codes, redirects, and 404 broken links.
- Meta title, description length, and Open Graph compliance.
- Google Lighthouse Core Web Vitals metrics (LCP, FID, CLS).
- Heading hierarchy (H1-H6) and image alt tag coverage.`,
    },
  ];

  for (const t of tools) {
    await prisma.tool.upsert({
      where: { slug: t.slug },
      update: t,
      create: t,
    });
  }

  console.log(`Seeded ${tools.length} initial tools successfully.`);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
