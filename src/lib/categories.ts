export interface CategoryFaq {
  question: string;
  answer: string;
}

export interface CategoryInfo {
  slug: string;
  aliases?: string[];
  name: string;
  dbCategories: string[];
  icon: string;
  tagline: string;
  description: string;
  metaTitle: string;
  metaDesc: string;
  badge: string;
  heroGradient: string;
  longContent: {
    overview: string;
    keyBenefits: { title: string; desc: string }[];
    popularWorkflows: { title: string; steps: string[] }[];
    deepDiveArticle: string;
  };
  faqs: CategoryFaq[];
  fallbackTools: {
    slug: string;
    name: string;
    description: string;
    icon: string;
    isComingSoon?: boolean;
    tag?: string;
  }[];
}

export const CATEGORIES_LIST: CategoryInfo[] = [
  {
    slug: "image-tools",
    aliases: ["images", "photo-tools", "image"],
    name: "Image & Photo Tools",
    dbCategories: ["Image Tools", "Advanced Image / AI"],
    icon: "FileArchive",
    tagline: "High-Performance Browser-Based Image Processing with Zero Server Uploads",
    description:
      "Compress, resize, crop, rotate, extract colors, and generate custom QR codes directly in your browser. Fast, 100% private, and losslessly optimized.",
    metaTitle: "Free Online Image Tools & Converters (100% Private) | Zoqonyx",
    metaDesc:
      "Compress JPEG/PNG/WebP, visually resize photos with drag handles, crop, pick colors with 10x magnifying loupe, and create custom branded QR codes online.",
    badge: "10+ Image Utilities",
    heroGradient: "from-cyan-500/20 via-blue-500/15 to-indigo-500/20",
    longContent: {
      overview: `Image optimization and manipulation are among the most frequent tasks undertaken by digital marketers, developers, graphic designers, and photographers. Traditional photo software often requires costly desktop licenses, heavyweight software installations, or cloud services that upload your personal and confidential media to remote servers.

Zoqonyx Solution Hub fundamentally changes this paradigm. Every image tool in our catalog is engineered using modern Web APIs—including HTML5 Canvas, Web Workers, WebP/AVIF encoding algorithms, and client-side memory buffers. This means your high-resolution photographs and private media never leave your device. Processing happens instantly at hardware-accelerated speeds with zero server lag, zero file size limits, and total privacy assurance.`,
      keyBenefits: [
        {
          title: "100% Client-Side Privacy",
          desc: "Files are processed entirely in your web browser. No photos or graphics are ever transmitted to or stored on external servers.",
        },
        {
          title: "Interactive Dual-Mode Resizing",
          desc: "Resize pictures using intuitive mouse and touch canvas drag handles or exact numeric pixel inputs with locked aspect ratios.",
        },
        {
          title: "Before & After Split Comparison",
          desc: "Inspect compressed images side-by-side with our real-time interactive divider slider to guarantee zero visible quality loss.",
        },
        {
          title: "Branded QR Code Generation",
          desc: "Create print-ready QR codes with custom company logos, color gradients, shaped eyes, and support for Wi-Fi, vCard, and WhatsApp.",
        },
      ],
      popularWorkflows: [
        {
          title: "E-Commerce Product Listing Optimization",
          steps: [
            "Upload raw high-resolution camera shots to the Image Cropper to achieve standard 1:1 square aspect ratios.",
            "Pass cropped photos through the Image Resizer to set standardized marketplace dimensions (e.g., 1200x1200px).",
            "Run the Image Compressor with a target file size under 150KB in modern WebP format for rapid store page speeds.",
          ],
        },
        {
          title: "Brand Asset & Marketing Package Creation",
          steps: [
            "Use the Color Picker from Image with the 10x magnifying loupe to extract primary and accent hex codes from a logo.",
            "Generate branded QR codes with embedded center logos and matching brand gradients for physical print materials.",
            "Convert raster assets to Base64 Data URIs to eliminate separate HTTP requests on fast landing pages.",
          ],
        },
      ],
      deepDiveArticle: `### The Importance of Client-Side Image Processing

Website speed and Core Web Vitals (specifically Largest Contentful Paint, or LCP) are core components of Google search ranking criteria. Large, uncompressed JPEG and PNG images are the single biggest cause of sluggish page loading on mobile devices and high bounce rates on e-commerce storefronts.

By converting legacy images to modern formats like WebP and AVIF, file sizes are typically reduced by 40% to 75% without perceptible loss of sharpness. Using Zoqonyx's in-browser image tools, developers and content creators can optimize hundreds of visual assets without installing complex command-line tools like ImageMagick or paying monthly subscriptions for online cloud compressors.

Furthermore, client-side execution means you can work completely offline after the initial page load, ensuring complete autonomy and security when working with confidential corporate assets or personal family portraits.`,
    },
    faqs: [
      {
        question: "Are my images uploaded to any server or saved in a cloud database?",
        answer:
          "No. All image tools on Zoqonyx execute entirely within your web browser using HTML5 Canvas and JavaScript Web APIs. Your images are never uploaded to our servers, keeping your confidential photos completely safe.",
      },
      {
        question: "What is the maximum image file size allowed?",
        answer:
          "Because processing occurs locally using your device's memory and CPU, there are no artificial file size limitations imposed by Zoqonyx. You can easily process high-resolution 20MB+ DSLR camera files.",
      },
      {
        question: "Can I generate QR codes for print marketing and physical banners?",
        answer:
          "Yes! The Zoqonyx QR Code Pro generator supports high-resolution export up to 2048x2048 pixels in PNG format with error correction levels up to 30%, making them ideal for large physical banners and restaurant menus.",
      },
      {
        question: "Which formats are supported for compression and conversion?",
        answer:
          "We support JPEG, PNG, WebP, AVIF, and BMP. You can losslessly compress or convert between any of these formats with instant download.",
      },
    ],
    fallbackTools: [
      {
        slug: "image-compressor",
        name: "Image Compressor Pro",
        description: "Compress JPG, PNG, and WebP with dual before/after split slider and live byte savings preview.",
        icon: "FileArchive",
        tag: "Updated Pro",
      },
      {
        slug: "image-resizer",
        name: "Image Resizer Pro",
        description: "Resize images visually with interactive canvas drag handles or exact numeric pixel values.",
        icon: "Maximize2",
        tag: "Updated Pro",
      },
      {
        slug: "qr-code-generator",
        name: "QR Code Generator Pro",
        description: "Create branded QR codes with center logos, color gradients, and Wi-Fi / vCard support.",
        icon: "QrCode",
        tag: "Updated Pro",
      },
      {
        slug: "color-picker-image",
        name: "Color Picker from Image",
        description: "10x magnifying loupe eyedropper with HEX, RGB, HSL, CMYK copy and auto-extracted palette.",
        icon: "Pipette",
        tag: "Updated Pro",
      },
      {
        slug: "image-cropper",
        name: "Image Cropper",
        description: "Crop photos to square 1:1, 16:9, 4:3, or custom dimensions with interactive canvas preview.",
        icon: "Crop",
      },
      {
        slug: "image-format-converter",
        name: "Image Format Converter",
        description: "Convert photos seamlessly between PNG, JPG, WebP, AVIF, and BMP in your browser.",
        icon: "RefreshCw",
      },
      {
        slug: "image-rotator-flipper",
        name: "Image Rotator & Flipper",
        description: "Rotate images 90/180/270 degrees and mirror flip horizontally or vertically with real-time preview.",
        icon: "RotateCw",
      },
      {
        slug: "image-to-base64",
        name: "Image to Base64 Converter",
        description: "Convert any image into Base64 Data URI strings for HTML, CSS, and Markdown embedding.",
        icon: "Binary",
      },
      {
        slug: "ai-background-remover-pro",
        name: "AI Background Remover Pro",
        description: "Ultra-high definition AI background removal for complex hair, fur, and product photography.",
        icon: "Sparkles",
        isComingSoon: true,
        tag: "Coming Soon",
      },
      {
        slug: "ai-image-upscaler",
        name: "AI Image Upscaler",
        description: "Enlarge photos up to 8x resolution without pixelation using generative super-resolution AI.",
        icon: "Zap",
        isComingSoon: true,
        tag: "Coming Soon",
      },
    ],
  },
  {
    slug: "css-design",
    aliases: ["design", "css-tools", "css"],
    name: "CSS & Design Generators",
    dbCategories: ["CSS & Design"],
    icon: "Layers",
    tagline: "Interactive Visual Code Generators for Modern Frontend Web Designers",
    description:
      "Generate clean, production-ready CSS code for multi-layer box shadows, fancy border radii, vibrant gradients, frosted glassmorphism, flexbox, and grid layouts.",
    metaTitle: "Free CSS Code Generators & UI Design Tools Online | Zoqonyx",
    metaDesc:
      "Visually design and generate production-ready CSS for box shadows, border radius, gradients, glassmorphism, and responsive flexbox layouts.",
    badge: "7+ CSS Generators",
    heroGradient: "from-purple-500/20 via-pink-500/15 to-rose-500/20",
    longContent: {
      overview: `Modern web interfaces demand polish, smooth depth, and responsive adaptability. However, manually calculating complex CSS values—such as 8-value organic border-radii, multi-layered elevation box-shadows, or complex conic and radial color gradients—is time-consuming and often requires endless trial-and-error in browser developer tools.

Zoqonyx CSS & Design Generators eliminate the guesswork. Our visual playgrounds provide instant real-time feedback with interactive sliders, direct canvas controls, and curated modern presets. Every tool generates clean, standards-compliant CSS code that you can copy and paste directly into React, Next.js, Tailwind CSS, or vanilla stylesheet setups.`,
      keyBenefits: [
        {
          title: "Multi-Layer Shadow Elevation",
          desc: "Create smooth, realistic ambient lighting shadows using multi-layer depth controls that mimic real-world lighting physics.",
        },
        {
          title: "Linear, Radial & Conic Gradients",
          desc: "Explore over 20+ hand-curated designer gradient presets or build custom multi-stop transitions with dynamic angle controls.",
        },
        {
          title: "Frosted Glassmorphism",
          desc: "Design trendy Apple-style frosted glass UI cards with live background blur, translucent border highlights, and dark mode preview.",
        },
        {
          title: "Visual Flexbox & Grid Playgrounds",
          desc: "Master modern layout alignment, wrap behaviors, and column spans visually before writing a single line of layout markup.",
        },
      ],
      popularWorkflows: [
        {
          title: "Modern SaaS Landing Page Design",
          steps: [
            "Use the Box Shadow Generator to create a subtle elevation shadow for pricing and feature cards.",
            "Generate an eye-catching hero background using the CSS Gradient Generator with 135-degree brand accent colors.",
            "Build interactive CTA buttons with hover transitions using the CSS Button Generator.",
          ],
        },
        {
          title: "Responsive Card & Layout Prototyping",
          steps: [
            "Configure organic asymmetrical card shapes using the 8-value Border Radius Generator.",
            "Experiment with card alignment and gaps inside the Flexbox and CSS Grid Playgrounds.",
            "Copy the resulting CSS rules directly into your component library or Tailwind config.",
          ],
        },
      ],
      deepDiveArticle: `### Crafting High-End UI Aesthetics with Modern CSS3

The transition from flat design to modern neumorphic and glassmorphic micro-textures has elevated user expectations. Today's premier interfaces feature subtle depth cues, soft diffused shadows, and semi-transparent frosted surfaces.

Creating realistic shadows requires layering multiple \`box-shadow\` definitions with graduated blur and spread radiuses. A single harsh black shadow looks amateurish; three delicate shadows with low opacity and high blur recreate authentic natural illumination.

Similarly, CSS backdrop filters (\`backdrop-filter: blur(16px)\`) combined with subtle translucent borders (\`rgba(255, 255, 255, 0.1)\`) yield the iconic modern glass aesthetic without relying on static Photoshop PNG cutouts. With Zoqonyx CSS Generators, crafting these intricate styles takes seconds instead of hours.`,
    },
    faqs: [
      {
        question: "Is the generated CSS code compatible with modern web browsers?",
        answer:
          "Yes. All generated CSS rules follow official W3C web standards and are supported in Chrome, Safari, Firefox, Edge, and mobile browsers. Where relevant, standard prefixes and modern fallbacks are included.",
      },
      {
        question: "Can I use the generated styles with Tailwind CSS or CSS-in-JS?",
        answer:
          "Absolutely. You can paste the generated CSS rules directly into your stylesheet, use them inside style attributes, or map the values into your \`tailwind.config.js\` theme extension file.",
      },
      {
        question: "Are these tools free for commercial software and client websites?",
        answer:
          "Yes, 100% free! All CSS code generated on Zoqonyx is completely unencumbered and can be freely used in personal, open-source, and commercial client projects.",
      },
    ],
    fallbackTools: [
      {
        slug: "box-shadow-generator",
        name: "Box Shadow Generator Pro",
        description: "Build layered, realistic CSS box shadows with blur, spread, opacity, color, and inset controls.",
        icon: "Layers",
        tag: "Updated Pro",
      },
      {
        slug: "css-gradient-generator",
        name: "CSS Gradient Generator Pro",
        description: "Craft linear, radial, and conic gradients with 20+ designer presets and angle dial controls.",
        icon: "Palette",
        tag: "Updated Pro",
      },
      {
        slug: "border-radius-generator",
        name: "Border Radius Generator",
        description: "Visually configure 8-value fancy organic CSS border-radius with live box preview.",
        icon: "Square",
      },
      {
        slug: "glassmorphism-generator",
        name: "Glassmorphism Generator",
        description: "Generate frosted glass UI effects using CSS backdrop-filter, border opacity, and blur.",
        icon: "Sparkles",
      },
      {
        slug: "button-generator",
        name: "CSS Button Generator",
        description: "Design interactive modern buttons with hover states, gradients, shadows, and clean code.",
        icon: "MousePointerClick",
      },
      {
        slug: "flexbox-playground",
        name: "Flexbox Playground",
        description: "Interactive visual flexbox builder with flex-direction, justify-content, and gap controls.",
        icon: "LayoutGrid",
      },
      {
        slug: "css-grid-generator",
        name: "CSS Grid Generator",
        description: "Visual interactive CSS grid builder with columns, rows, gap, and item layout controls.",
        icon: "LayoutGrid",
      },
    ],
  },
  {
    slug: "text-code",
    aliases: ["text", "code", "text-tools", "developer-utilities"],
    name: "Text & Code Utilities",
    dbCategories: ["Text & Code"],
    icon: "Code2",
    tagline: "Essential Fast In-Browser Utilities for Developers, Copywriters & Engineers",
    description:
      "Format JSON, compare text differences side-by-side, generate UUIDs and secure passwords, convert text casing, encode Base64, and count words with zero latency.",
    metaTitle: "Online Text Utilities, JSON Formatter & Code Tools | Zoqonyx",
    metaDesc:
      "Free developer utilities: JSON formatter with syntax error check, text diff checker, secure password and UUID generators, Base64 encoder, and case converter.",
    badge: "11+ Text & Code Tools",
    heroGradient: "from-emerald-500/20 via-teal-500/15 to-cyan-500/20",
    longContent: {
      overview: `Software engineers, technical writers, and content specialists constantly handle structured data payloads, configuration files, and raw text snippets. Navigating between heavy IDEs, complex command line utilities, or ad-laden websites just to format a JSON string or inspect code changes wastes valuable focus.

The Zoqonyx Text & Code Suite provides clean, distraction-free utilities built for speed. Equipped with client-side cryptography (Web Crypto API) and high-performance string comparison algorithms, these tools ensure that your API keys, configuration files, and confidential text snippets remain strictly on your local machine.`,
      keyBenefits: [
        {
          title: "JSON Beautifier, Minifier & Validator",
          desc: "Spot syntax errors instantly with line-by-line validation, collapsible tree exploration, and space indentation toggles.",
        },
        {
          title: "Side-by-Side & Unified Diff Checker",
          desc: "Compare two code snippets or documents with color-coded line additions, deletions, and character-level differences.",
        },
        {
          title: "Cryptographically Secure Generators",
          desc: "Generate RFC 4122 v4 UUIDs and high-entropy passwords using the browser's native window.crypto engine.",
        },
        {
          title: "Universal Case Transformation",
          desc: "Instantly convert between camelCase, snake_case, kebab-case, PascalCase, Title Case, and UPPERCASE.",
        },
      ],
      popularWorkflows: [
        {
          title: "REST & GraphQL API Debugging",
          steps: [
            "Paste unformatted API responses into the JSON Formatter to inspect deeply nested objects.",
            "Minify the validated JSON payload before embedding it into database seeds or production configs.",
            "Generate cryptographically unique UUIDs for mock IDs and test records in one click.",
          ],
        },
        {
          title: "Editorial & Content Quality Assurance",
          steps: [
            "Run drafts through the Word & Character Counter to verify social media limits and estimated reading time.",
            "Compare original and revised client copy with the Diff Checker to verify editorial updates.",
            "Generate dummy placeholder paragraphs with the Lorem Ipsum Generator for mockup styling.",
          ],
        },
      ],
      deepDiveArticle: `### Why Privacy Matters in Text and Code Utilities

When developers paste database records, JSON payloads, or token strings into third-party formatting websites, they frequently expose sensitive credentials, customer PII (Personally Identifiable Information), or proprietary algorithms to external logging servers.

Zoqonyx guarantees zero data transmission for our text utilities. When you format JSON, compute an MD5 or SHA-256 hash, or generate a high-entropy password, all computations take place in your browser's V8 or JavaScriptCore engine. Nothing is sent to an external API, protecting your codebase and complying with strict enterprise data security policies.`,
    },
    faqs: [
      {
        question: "Is my JSON data or source code saved on Zoqonyx servers?",
        answer:
          "Never. All parsing, validation, formatting, and minification runs strictly client-side in your browser. We never log, store, or transmit your input data.",
      },
      {
        question: "Are passwords and UUIDs generated using secure random numbers?",
        answer:
          "Yes. Our generators use the browser's native \`crypto.getRandomValues()\` API, which accesses operating-system-level cryptographic randomness (CSPRNG) rather than predictable pseudo-random seeds.",
      },
      {
        question: "Can I use the Diff Checker for code and programming languages?",
        answer:
          "Yes! The Diff Checker works with JavaScript, Python, HTML, CSS, SQL, Markdown, and plain prose, highlighting differences line-by-line with exact line numbers.",
      },
    ],
    fallbackTools: [
      {
        slug: "json-formatter",
        name: "JSON Formatter & Validator Pro",
        description: "Format, beautify, validate, minify, and inspect JSON with syntax error line detection.",
        icon: "Code2",
        tag: "Updated Pro",
      },
      {
        slug: "diff-checker",
        name: "Diff Checker Pro",
        description: "Compare two text snippets side-by-side or unified with line-by-line difference highlighting.",
        icon: "GitCompare",
        tag: "Updated Pro",
      },
      {
        slug: "case-converter",
        name: "Case Converter",
        description: "Convert text instantly between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case.",
        icon: "Type",
      },
      {
        slug: "base64-encode-decode",
        name: "Base64 Encoder & Decoder",
        description: "Encode text to Base64 or decode Base64 strings back to clean UTF-8 text safely and securely.",
        icon: "FileCode",
      },
      {
        slug: "uuid-generator",
        name: "UUID / GUID Generator",
        description: "Generate cryptographically secure Version 4 UUIDs in bulk with uppercase, lowercase, and hyphens.",
        icon: "Key",
      },
      {
        slug: "password-generator",
        name: "Password Generator",
        description: "Generate ultra-secure, random passwords with custom length, symbols, numbers, and entropy meter.",
        icon: "Lock",
      },
      {
        slug: "hash-generator",
        name: "Hash Generator",
        description: "Generate SHA-1, SHA-256, SHA-384, SHA-512, and MD5 cryptographic hashes from any input text.",
        icon: "Hash",
      },
      {
        slug: "url-encoder-decoder",
        name: "URL Encoder & Decoder",
        description: "Encode strings into percent-encoded URI format or decode complex URLs and query strings safely.",
        icon: "Link2",
      },
      {
        slug: "word-counter",
        name: "Word & Character Counter",
        description: "Count words, characters, sentences, paragraphs, and calculate estimated reading and speaking times.",
        icon: "AlignLeft",
      },
      {
        slug: "markdown-html-converter",
        name: "Markdown <-> HTML Converter",
        description: "Convert Markdown to clean HTML or convert HTML into formatted Markdown with live split-screen preview.",
        icon: "FileText",
      },
      {
        slug: "lorem-ipsum-generator",
        name: "Lorem Ipsum Generator",
        description: "Generate dummy placeholder text by paragraphs, sentences, or word counts for designers and developers.",
        icon: "Pilcrow",
      },
    ],
  },
  {
    slug: "developer-seo",
    aliases: ["dev", "seo", "developer-tools", "seo-tools"],
    name: "Developer & SEO Tools",
    dbCategories: ["Developer & SEO", "SEO & Marketing"],
    icon: "Globe",
    tagline: "Technical Optimization and Webmaster Tools to Elevate Google Search Visibility",
    description:
      "Craft complete Open Graph and Twitter Card meta tags, build robots.txt files, convert CSS responsive units (px to rem), and prepare your site for top search engine indexing.",
    metaTitle: "Free Technical SEO & Developer Tools Online | Zoqonyx",
    metaDesc:
      "Boost organic search traffic and social clicks with our Meta Tags Generator, Robots.txt builder, CSS Unit Converter, and site audit utilities.",
    badge: "5+ SEO & Dev Tools",
    heroGradient: "from-blue-600/20 via-indigo-500/15 to-violet-500/20",
    longContent: {
      overview: `Search engine visibility and social media shareability directly determine whether a website succeeds or remains unnoticed. Having great content is only half the battle; search crawlers like Googlebot need explicit metadata, well-structured robots directives, and responsive layouts to rank your pages favorably.

Zoqonyx Developer & SEO Tools streamline technical webmaster workflows. From generating standards-compliant Open Graph tags with live social previews to converting pixel values into scalable responsive rem units, our utilities provide the precise control web developers and digital marketers require.`,
      keyBenefits: [
        {
          title: "Live Social Snippet Previews",
          desc: "Inspect how your links will appear on Google Search, Facebook, X (Twitter), and LinkedIn before publishing.",
        },
        {
          title: "Standard Robots.txt Generation",
          desc: "Guide search engine spiders with custom allow/disallow directives, crawl delay instructions, and XML sitemap declarations.",
        },
        {
          title: "Scalable Responsive Unit Conversion",
          desc: "Effortlessly convert fixed pixel designs into fluid, accessible \`rem\` and \`em\` units based on custom root font sizes.",
        },
      ],
      popularWorkflows: [
        {
          title: "New Website Launch SEO Checklist",
          steps: [
            "Use the Meta Tags Generator to craft title tags, meta descriptions, and Open Graph image URLs for each landing page.",
            "Generate and validate a clean \`robots.txt\` file to instruct crawlers which sections to index and identify the sitemap location.",
            "Convert hardcoded design pixel values into fluid \`rem\` units using the CSS Unit Converter for perfect mobile accessibility.",
          ],
        },
      ],
      deepDiveArticle: `### The Pillars of Modern Technical SEO

Modern search engine optimization encompasses much more than keyword stuffing. Search algorithms heavily prioritize user experience, mobile responsiveness, and rich structured metadata.

When a URL is shared across social messaging platforms, missing Open Graph tags result in bland, unclickable links without preview thumbnails. By utilizing the Zoqonyx Meta Tags Generator, you ensure high-resolution preview cards on every major social network, significantly boosting organic click-through rates (CTR).

Similarly, responsive accessibility requires sizing typography and layout padding using relative \`rem\` units rather than rigid pixels. This allows users who adjust their browser font settings for visual impairment to experience seamless text scaling without broken page layouts.`,
    },
    faqs: [
      {
        question: "Why should I use rem units instead of pixels in modern CSS?",
        answer:
          "The \`rem\` unit scales relative to the user's root font size setting. If a visually impaired visitor has their default browser font set to 20px instead of 16px, layouts built with \`rem\` scale proportionally, fulfilling accessibility (a11y) standards.",
      },
      {
        question: "How does robots.txt impact my website's Google ranking?",
        answer:
          "Robots.txt directs search crawlers toward your high-value pages while preventing them from wasting crawl budget on duplicate admin, cart, or search filter URLs.",
      },
      {
        question: "Can I preview my Open Graph tags before launching a campaign?",
        answer:
          "Yes! Our Meta Tags Generator displays real-time interactive previews of Google Search, Facebook feed posts, and Twitter Cards as you type.",
      },
    ],
    fallbackTools: [
      {
        slug: "meta-tags-generator",
        name: "Meta Tags Generator",
        description: "Generate complete HTML meta tags, Open Graph, and Twitter Cards with live Google snippet preview.",
        icon: "Globe",
      },
      {
        slug: "robots-txt-generator",
        name: "Robots.txt Generator",
        description: "Create standard robots.txt files with custom user-agents, allow/disallow directives, and sitemaps.",
        icon: "Bot",
      },
      {
        slug: "unit-converter",
        name: "CSS Unit Converter",
        description: "Convert units between px, rem, em, %, and pt with custom root font base for fluid typography.",
        icon: "ArrowRightLeft",
      },
      {
        slug: "full-site-audit-tool",
        name: "Full Website SEO Audit",
        description: "Analyze any domain for Core Web Vitals, broken links, meta tag health, and indexing bottlenecks.",
        icon: "SearchCheck",
        isComingSoon: true,
        tag: "Coming Soon",
      },
    ],
  },
  {
    slug: "calculators",
    aliases: ["calc", "math", "finance", "health"],
    name: "Calculators & Math Tools",
    dbCategories: ["Calculators"],
    icon: "Calculator",
    tagline: "Accurate, Instant Math, Health, and Chronological Calculations",
    description:
      "Calculate your exact chronological age with birthday milestones, solve complex percentage problems, and evaluate Body Mass Index (BMI) with official WHO health standards.",
    metaTitle: "Free Online Calculators - Age, Percentage & BMI | Zoqonyx",
    metaDesc:
      "Instant, accurate online calculators for daily life: Precise chronological age calculator, percentage increase/decrease solver, and WHO BMI health calculator.",
    badge: "3+ Core Calculators",
    heroGradient: "from-amber-500/20 via-orange-500/15 to-yellow-500/20",
    longContent: {
      overview: `Quick numerical answers shouldn't require searching through complex spreadsheet formulas or using clunky mobile calculator apps. Whether you need to determine exact chronological age for official government paperwork, calculate financial discount margins on a purchase, or check your Body Mass Index (BMI) for personal fitness milestones, Zoqonyx Calculators deliver instant, accurate results.

Designed with clean typography and real-time computation, our calculators display not only the final number, but also helpful context—such as days remaining until your next birthday milestone or official World Health Organization (WHO) weight classification bands.`,
      keyBenefits: [
        {
          title: "Precision Chronological Breakdown",
          desc: "Calculate age down to years, months, weeks, days, hours, and minutes with an upcoming birthday countdown clock.",
        },
        {
          title: "Comprehensive Percentage Solutions",
          desc: "Solve standard percentage of values, percentage increases/decreases, and calculate percentage margins effortlessly.",
        },
        {
          title: "Dual Metric & Imperial BMI",
          desc: "Easily switch between centimeters/kilograms and feet/inches/pounds with color-coded health risk evaluations.",
        },
      ],
      popularWorkflows: [
        {
          title: "Financial Planning & Retail Discounts",
          steps: [
            "Use the Percentage Calculator to find exact discount savings on sales promotions.",
            "Compute profit margin percentages and price markups for e-commerce catalog pricing.",
          ],
        },
        {
          title: "Health & Milestone Tracking",
          steps: [
            "Input your birthdate into the Age Calculator to find out your exact age in days and celebrate round numerical milestones.",
            "Enter your height and weight into the BMI Calculator to track weight adjustments over time.",
          ],
        },
      ],
      deepDiveArticle: `### The Science Behind Body Mass Index (BMI)

Body Mass Index (BMI) is an international screening metric developed by Belgian statistician Adolphe Quetelet. It provides a simple, accessible ratio between an individual's weight in kilograms and the square of their height in meters (BMI = weight in kg / (height in meters)^2).

The World Health Organization categorizes adult BMI into four primary bands:
- Underweight: BMI under 18.5
- Normal weight: BMI between 18.5 and 24.9
- Overweight: BMI between 25.0 and 29.9
- Obese: BMI of 30.0 or higher

While BMI serves as an excellent broad indicator of health trends for general populations, it does not distinguish between muscle mass and fat tissue. Our calculator provides clear, educational context alongside your score to support balanced personal fitness planning.`,
    },
    faqs: [
      {
        question: "How accurate is the Age Calculator?",
        answer:
          "Our Age Calculator accounts for exact leap years, differing calendar month lengths, and timezones to provide 100% precision down to the exact day and hour.",
      },
      {
        question: "Does the BMI calculator support pounds and inches?",
        answer:
          "Yes! You can toggle seamlessly between Metric (cm/kg) and Imperial (feet/inches/lbs) units with automatic conversions.",
      },
      {
        question: "Can I use these calculators on my mobile smartphone?",
        answer:
          "Yes. All Zoqonyx calculators are fully responsive with touch-optimized numeric inputs and instant live calculation as you type.",
      },
    ],
    fallbackTools: [
      {
        slug: "age-calculator",
        name: "Age Calculator",
        description: "Calculate exact chronological age in years, months, days, hours, and countdown to next birthday.",
        icon: "Calendar",
      },
      {
        slug: "percentage-calculator",
        name: "Percentage Calculator",
        description: "Solve percentage problems: X% of Y, percentage increase/decrease, and discount savings.",
        icon: "Percent",
      },
      {
        slug: "bmi-calculator",
        name: "BMI Calculator",
        description: "Calculate Body Mass Index using Metric or Imperial units with WHO weight category evaluation.",
        icon: "Activity",
      },
    ],
  },
  {
    slug: "pdf-documents",
    aliases: ["pdf", "documents", "docs"],
    name: "PDF & Document Utilities",
    dbCategories: ["PDF & Documents"],
    icon: "FileEdit",
    tagline: "Secure, Private Document Management and In-Browser PDF Editing",
    description:
      "Edit text, reorder pages, merge contracts, insert digital signatures, and annotate PDF documents directly in your web browser with zero software installs.",
    metaTitle: "Online PDF Tools & Document Editors (100% Secure) | Zoqonyx",
    metaDesc:
      "Edit PDF text, merge multi-page documents, sign contracts electronically, and rearrange pages online for free without expensive desktop software.",
    badge: "Enterprise Grade PDF Suite",
    heroGradient: "from-rose-500/20 via-red-500/15 to-orange-500/20",
    longContent: {
      overview: `PDF documents are the universal standard for corporate contracts, official invoices, legal forms, and academic research. Yet, simple modifications—such as reordering a few pages, signing a contract, or editing a typo—routinely require exorbitant subscriptions to proprietary desktop software suites.

Zoqonyx is engineering a comprehensive, zero-cost online PDF suite that handles document tasks directly in your browser. Utilizing lightweight WebAssembly and JavaScript PDF rendering engines, you can annotate, rearrange, and sign documents locally without uploading confidential client files to third-party cloud servers.`,
      keyBenefits: [
        {
          title: "Confidential Document Security",
          desc: "Sensitive contracts and legal files remain strictly on your local machine with client-side WebAssembly processing.",
        },
        {
          title: "In-Browser Visual Page Reordering",
          desc: "Drag, drop, rotate, and delete specific PDF pages visually before exporting a unified document.",
        },
        {
          title: "Legally Binding Digital Signatures",
          desc: "Draw or import clean electronic signatures (eSign) to sign NDAs, invoices, and employment agreements in seconds.",
        },
      ],
      popularWorkflows: [
        {
          title: "Business Contract Execution",
          steps: [
            "Open your contract inside the browser-based PDF Editor.",
            "Verify all agreement clauses and append your personalized digital signature.",
            "Export the signed PDF immediately without any watermarks or subscription charges.",
          ],
        },
      ],
      deepDiveArticle: `### Eliminating the Proprietary PDF Tax

For decades, basic PDF manipulation has been gatekept behind expensive enterprise subscriptions. Small businesses, freelance contractors, and students are often forced to pay high monthly fees just to merge two files or sign an agreement.

Zoqonyx believes fundamental digital document utilities should be accessible to everyone for free. By leveraging browser-native canvas drawing and vector path manipulation, our upcoming PDF Editor delivers lightning-fast document management with zero subscription barriers and zero privacy compromises.`,
    },
    faqs: [
      {
        question: "When will the Full PDF Editor be available?",
        answer:
          "The Full PDF Editor is currently in active final testing. You can enter your email address on the tool page to receive an instant notification as soon as it goes live.",
      },
      {
        question: "Are confidential business contracts safe in an online tool?",
        answer:
          "Yes! Like all Zoqonyx tools, processing is engineered to run client-side on your device so that your confidential documents are never exposed to external servers.",
      },
    ],
    fallbackTools: [
      {
        slug: "ai-full-pdf-editor",
        name: "Full PDF Editor Online",
        description: "Edit text, rearrange pages, insert signatures, and annotate PDF documents directly in the browser.",
        icon: "FileEdit",
        isComingSoon: true,
        tag: "Coming Soon",
      },
    ],
  },
  {
    slug: "ai-tools",
    aliases: ["ai", "smart-tools", "artificial-intelligence"],
    name: "AI & Next-Gen Smart Tools",
    dbCategories: ["Advanced Image / AI", "AI Writing & Business"],
    icon: "Sparkles",
    tagline: "Cutting-Edge Neural Network Utilities for Creative Professionals",
    description:
      "Harness generative artificial intelligence for instant edge-perfect background removal, super-resolution photo upscaling, and automated copywriting.",
    metaTitle: "Free Online AI Tools - Background Remover, Upscaler & Copywriter | Zoqonyx",
    metaDesc:
      "Supercharge creative workflows with next-gen AI tools: Neural background remover for e-commerce, AI photo upscaler up to 8x, and AI content writer.",
    badge: "Next-Gen AI Tools",
    heroGradient: "from-violet-500/20 via-purple-500/15 to-indigo-500/20",
    longContent: {
      overview: `Artificial intelligence has fundamentally transformed digital content creation. What once required hours of manual pixel clipping, complex sharpening filters, or writer's block can now be accelerated in seconds using purpose-built neural network models.

Zoqonyx AI & Next-Gen Smart Tools are designed to democratize high-end creative workflows. Whether you need to isolate product photography for an Amazon or Shopify store, restore vintage low-resolution photos into 4K resolution, or draft compelling email marketing sequences, our AI tools provide studio-grade results without prohibitive subscription costs.`,
      keyBenefits: [
        {
          title: "Sub-Pixel Boundary Isolation",
          desc: "Our neural segmentation models isolate complex subjects including fine strands of hair, animal fur, and transparent glass.",
        },
        {
          title: "Generative Detail Synthesis",
          desc: "Upscale photos up to 8x resolution by intelligently reconstructing lost textures rather than simply blurring pixels.",
        },
        {
          title: "Conversion-Focused Marketing Copy",
          desc: "Generate high-ranking SEO blog posts, social media hooks, and sales copy tuned for modern audience engagement.",
        },
      ],
      popularWorkflows: [
        {
          title: "E-Commerce Catalog Enhancement",
          steps: [
            "Batch isolate product shots using the AI Background Remover Pro.",
            "Replace backgrounds with crisp, pure-white e-commerce studio backdrops.",
            "Upscale lower-resolution supplier images using the AI Image Upscaler for high-DPI zoom on product pages.",
          ],
        },
      ],
      deepDiveArticle: `### How Generative AI Is Redefining Visual Quality

Traditional bicubic interpolation algorithms enlarge images by copying neighboring pixels, inevitably creating muddy, blurred results when scaling beyond 150%. In contrast, generative super-resolution models are trained on deep semantic visual understanding. When enlarging an eye, texture, or fabric, the neural network predicts and synthesizes high-frequency details that genuinely belong there.

Similarly, machine learning models trained on millions of subject-background pairs can distinguish fine translucent strands of hair against high-contrast backgrounds in fractions of a second—a task that historically took professional photo retouchers 30 minutes per image in desktop editing software.`,
    },
    faqs: [
      {
        question: "How can I access the AI tools?",
        answer:
          "The AI tools are scheduled to launch in our upcoming milestone release. Enter your email on any AI tool page to join the early-access list and receive launch updates.",
      },
      {
        question: "Will the AI Background Remover leave watermarks on my photos?",
        answer:
          "No! Zoqonyx has a strict zero-watermark policy across all tools, ensuring your final graphics are ready for professional client presentation.",
      },
    ],
    fallbackTools: [
      {
        slug: "ai-background-remover-pro",
        name: "AI Background Remover Pro",
        description: "Ultra-high definition AI background removal for complex hair, transparent fabrics, and product photography.",
        icon: "Sparkles",
        isComingSoon: true,
        tag: "Coming Soon",
      },
      {
        slug: "ai-image-upscaler",
        name: "AI Image Upscaler",
        description: "Enlarge images up to 8x resolution without pixelation using generative super-resolution AI.",
        icon: "Zap",
        isComingSoon: true,
        tag: "Coming Soon",
      },
      {
        slug: "ai-content-writer",
        name: "AI Content Writer",
        description: "Generate compelling blog articles, marketing copy, social media hooks, and sales copy.",
        icon: "PenTool",
        isComingSoon: true,
        tag: "Coming Soon",
      },
    ],
  },
];

export function getCategoryBySlug(slug: string): CategoryInfo | null {
  const normalized = slug.toLowerCase().trim();
  const direct = CATEGORIES_LIST.find((c) => c.slug === normalized);
  if (direct) return direct;

  const aliased = CATEGORIES_LIST.find(
    (c) => c.aliases && c.aliases.includes(normalized)
  );
  return aliased || null;
}

export function getAllCategories(): CategoryInfo[] {
  return CATEGORIES_LIST;
}
