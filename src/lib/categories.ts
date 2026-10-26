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
    "slug": "image-tools",
    "aliases": [
      "images",
      "photo-tools",
      "image"
    ],
    "name": "Image & Photo Tools",
    "dbCategories": [
      "Image Tools",
      "Advanced Image / AI"
    ],
    "icon": "FileArchive",
    "tagline": "High-Performance Browser-Based Image Processing with Zero Server Uploads",
    "description": "Compress, resize, crop, rotate, extract colors, and generate custom QR codes directly in your browser. Fast, 100% private, and losslessly optimized.",
    "metaTitle": "Free Online Image Tools & Converters (100% Private) | Zoqonyx",
    "metaDesc": "Compress JPEG/PNG/WebP, visually resize photos with drag handles, crop, pick colors with 10x magnifying loupe, and create custom branded QR codes online.",
    "badge": "20+ Image Utilities",
    "heroGradient": "from-teal-500/20 via-emerald-500/15 to-cyan-500/20",
    "longContent": {
      "overview": "Every image tool in our catalog is engineered using modern Web APIs—including HTML5 Canvas, Web Workers, WebP/AVIF encoding algorithms, and client-side memory buffers. This means your high-resolution photographs and private media never leave your device. Processing happens instantly at hardware-accelerated speeds with zero server lag, zero file size limits, and total privacy assurance.",
      "keyBenefits": [
        {
          "title": "100% Client-Side Privacy",
          "desc": "Files are processed entirely in your web browser. No photos or graphics are ever transmitted to or stored on external servers."
        },
        {
          "title": "Dual-Mode Bulk Resizing",
          "desc": "Process single photos with live dimensions or batch-process up to 50 images in background threads."
        },
        {
          "title": "Zero Quality Loss",
          "desc": "Fine-tune compression levels with mathematical fidelity preview."
        },
        {
          "title": "Universal Format Support",
          "desc": "Full input and export support for PNG, JPG, WebP, AVIF, and SVG."
        }
      ],
      "popularWorkflows": [
        {
          "title": "E-Commerce Product Optimization",
          "steps": [
            "Upload catalog photos",
            "Batch compress to WebP under 150KB",
            "Generate 1:1 square crops"
          ]
        },
        {
          "title": "Social Media Asset Preparation",
          "steps": [
            "Scale photos to exact platform dimensions",
            "Convert to crisp PNGs",
            "Strip EXIF device tags for privacy"
          ]
        }
      ],
      "deepDiveArticle": "Optimizing digital imagery is vital for Core Web Vitals (LCP) and search engine visibility. Zoqonyx executes all rendering on your local GPU/CPU threads, delivering instantaneous transformations with zero data sharing."
    },
    "faqs": [
      {
        "question": "Are my photos uploaded to any server?",
        "answer": "No. All image operations occur strictly inside your device's browser memory using HTML5 Canvas APIs."
      },
      {
        "question": "Is there a limit on how many images I can process?",
        "answer": "Zoqonyx supports bulk processing of up to 50 images at a time with automated concurrency limiting to prevent browser lag."
      }
    ],
    "fallbackTools": [
      {
        "slug": "image-compressor",
        "name": "Image Compressor",
        "description": "Compress JPG, PNG, and WebP images client-side with zero quality loss and instant savings preview.",
        "icon": "FileArchive",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "image-resizer",
        "name": "Image Resizer",
        "description": "Resize images by exact pixels or percentage with aspect ratio lock and high-definition smoothing.",
        "icon": "Maximize2",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "image-format-converter",
        "name": "Image Format Converter",
        "description": "Convert photos seamlessly between PNG, JPG, WebP, AVIF, and BMP formats in your browser.",
        "icon": "RefreshCw",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "color-picker-image",
        "name": "Color Picker from Image",
        "description": "Extract color palettes and pinpoint exact HEX, RGB, and HSL values from any uploaded image.",
        "icon": "Pipette",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "image-cropper",
        "name": "Image Cropper",
        "description": "Crop photos to square 1:1, 16:9, 4:3, or custom dimensions with interactive canvas preview.",
        "icon": "Crop",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "image-rotator-flipper",
        "name": "Image Rotator & Flipper",
        "description": "Rotate images by 90, 180, or 270 degrees and flip horizontally or vertically with instant export.",
        "icon": "RotateCw",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "image-to-base64",
        "name": "Image to Base64 Converter",
        "description": "Convert image files into base64 encoded Data URIs ready for embedding directly in HTML or CSS.",
        "icon": "Code2",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "ai-watermark-remover",
        "name": "Watermark Remover",
        "description": "Erase watermarks, logos, timestamps, and unwanted text from photos client-side.",
        "icon": "Sparkles",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "object-remover-photo",
        "name": "Object Remover",
        "description": "Remove unwanted objects, photobombers, and defects from pictures with intelligent canvas inpainting.",
        "icon": "Sparkles",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "bulk-image-compressor",
        "name": "Bulk Image Compressor",
        "description": "Compress up to 50 photos simultaneously in your browser with zip archive export.",
        "icon": "FileArchive",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "bulk-image-resizer",
        "name": "Bulk Image Resizer",
        "description": "Batch resize dozens of photos at once with uniform scale percentage and zip download.",
        "icon": "Maximize2",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "favicon-generator",
        "name": "Favicon Generator",
        "description": "Generate 16x16, 32x32, 48x48, 180x180, and 512x512 website icons plus HTML link tags.",
        "icon": "Sparkles",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "passport-photo-maker",
        "name": "Passport Photo Maker",
        "description": "Crop and format photos to US, UK, and Schengen passport specs with 4x6 printable grid sheets.",
        "icon": "Crop",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "watermark-adder",
        "name": "Watermark Adder",
        "description": "Stamp customized copyright watermarks, text badges, and branding onto images.",
        "icon": "Layers",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "exif-data-remover",
        "name": "EXIF Data Remover",
        "description": "Strip GPS coordinates, camera serial numbers, and device metadata from photos for privacy.",
        "icon": "Shield",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "svg-to-png-converter",
        "name": "SVG to PNG Converter",
        "description": "Render SVG vector markup into high-definition rasterized PNG images with transparent backgrounds.",
        "icon": "Image",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "ai-background-remover",
        "name": "AI Background Remover",
        "description": "Neural edge-detection model to remove backgrounds from portraits and product photography with 100% precision.",
        "icon": "Sparkles",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "video-compressor-online",
        "name": "Video Compressor Online",
        "description": "In-browser WebAssembly FFmpeg video encoder to reduce MP4, MOV, and WebM video sizes without quality loss.",
        "icon": "Video",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "video-to-gif-converter",
        "name": "Video to GIF Converter",
        "description": "Convert video clips into lightweight, animated GIFs with custom frame rates and resolution controls.",
        "icon": "Film",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "audio-converter-mp3",
        "name": "Audio Converter to MP3",
        "description": "Convert audio recordings, WAV, and AAC files into high-bitrate MP3 format in your browser.",
        "icon": "Music",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "voice-recorder-editor",
        "name": "Voice Recorder & Audio Editor",
        "description": "Capture voice audio, trim clips, and export high-clarity voice recordings directly in the browser.",
        "icon": "Mic",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "screen-recorder-pro",
        "name": "Browser Screen Recorder Pro",
        "description": "Record entire screens, application windows, or browser tabs with microphone audio and instant WebM export.",
        "icon": "Monitor",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "ai-headshot-generator",
        "name": "AI Headshot Photo Enhancer",
        "description": "Transform casual portraits into studio-quality executive headshots with balanced studio lighting.",
        "icon": "UserCheck",
        "isComingSoon": true,
        "tag": "Coming Soon"
      }
    ]
  },
  {
    "slug": "pdf-documents",
    "aliases": [
      "pdf",
      "documents",
      "pdf-tools"
    ],
    "name": "PDF & Document Utilities",
    "dbCategories": [
      "PDF & Documents"
    ],
    "icon": "FileText",
    "tagline": "Professional Client-Side PDF Tools: Merge, Split, Rotate & Protect with Zero Server Uploads",
    "description": "Manage and manipulate PDF files entirely in your browser using pdf-lib. Merge documents, extract pages, rotate orientations, protect with passwords, and extract text privately.",
    "metaTitle": "Free PDF Tools Online (100% Client-Side & Private) | Zoqonyx",
    "metaDesc": "Merge multiple PDFs, split pages, rotate orientation, add page numbers, inspect page counts, and convert images to PDF without uploading confidential files to any server.",
    "badge": "13+ PDF Solutions",
    "heroGradient": "from-teal-500/20 via-cyan-500/15 to-blue-500/20",
    "longContent": {
      "overview": "Traditional PDF tools require uploading confidential legal contracts, financial invoices, and medical records to third-party web servers. Zoqonyx is different: our PDF engine runs 100% client-side inside your browser using WebAssembly and Web Workers. Your documents never touch external storage.",
      "keyBenefits": [
        {
          "title": "Confidentiality Guaranteed",
          "desc": "Legal agreements, tax records, and medical files never leave your computer."
        },
        {
          "title": "No File Upload Delays",
          "desc": "Instantaneous compilation and modification directly on your local device."
        },
        {
          "title": "Complete Document Control",
          "desc": "Reorder pages, merge multiple reports, stamp page numbers, and add metadata."
        },
        {
          "title": "Zero Subscription Paywalls",
          "desc": "No daily page quotas or hidden fees for high-volume documents."
        }
      ],
      "popularWorkflows": [
        {
          "title": "Contract Consolidation",
          "steps": [
            "Upload multiple PDF agreements",
            "Drag to reorder sequence",
            "Merge and download single document"
          ]
        },
        {
          "title": "Page Numbering & Stamping",
          "steps": [
            "Select document",
            "Choose header/footer position and format",
            "Export numbered document"
          ]
        }
      ],
      "deepDiveArticle": "Document security is non-negotiable for enterprise workflows. By utilizing in-browser PDF byte streaming, Zoqonyx eliminates the security vulnerabilities of cloud-based PDF services."
    },
    "faqs": [
      {
        "question": "Can anyone else see my uploaded PDF files?",
        "answer": "No! All PDF rendering and compiling happens locally inside your browser tab memory. Nothing is ever sent over the network."
      },
      {
        "question": "Can I merge large PDF files?",
        "answer": "Yes, you can merge multiple files up to several hundred pages with responsive progress indicators."
      }
    ],
    "fallbackTools": [
      {
        "slug": "merge-pdf",
        "name": "Merge PDF Files",
        "description": "Combine multiple PDF documents into a single organized file in seconds with custom page ordering.",
        "icon": "FileText",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "split-pdf",
        "name": "Split PDF Pages",
        "description": "Extract specific page ranges or split large PDF documents into smaller independent files.",
        "icon": "Layers",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "rotate-pdf",
        "name": "Rotate PDF Pages",
        "description": "Rotate individual or all PDF pages by 90, 180, or 270 degrees with live orientation preview.",
        "icon": "RotateCw",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "protect-pdf",
        "name": "Password Protect PDF",
        "description": "Encrypt and secure confidential PDF documents with custom owner passwords.",
        "icon": "Lock",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "unlock-pdf",
        "name": "Unlock PDF Document",
        "description": "Remove security restrictions and passwords from encrypted PDF files for editing and printing.",
        "icon": "Unlock",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "add-page-numbers-pdf",
        "name": "Add Page Numbers to PDF",
        "description": "Stamp customized header or footer page numbers across all pages of your PDF document.",
        "icon": "Hash",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "pdf-page-counter",
        "name": "PDF Page Counter",
        "description": "Instantly inspect total page counts, file dimensions, and structural volumes across bulk PDF files.",
        "icon": "FileCheck",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "pdf-metadata-editor",
        "name": "PDF Metadata Editor",
        "description": "View and edit document title, author, subject, and search keywords inside any PDF document.",
        "icon": "FileText",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "image-to-pdf",
        "name": "Image to PDF Converter",
        "description": "Convert multiple JPG, PNG, and WebP images into a single professional A4 or fitted PDF document.",
        "icon": "Upload",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "pdf-to-text",
        "name": "PDF to Text Extractor",
        "description": "Extract raw text content, structural data, and metadata streams directly from PDF files.",
        "icon": "FileText",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "pdf-ocr-converter",
        "name": "PDF OCR Scanned Text Converter",
        "description": "Recognize and convert scanned PDF documents and image files into searchable, selectable text.",
        "icon": "FileSearch",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "pdf-form-filler",
        "name": "PDF Form Field Filler & Signer",
        "description": "Fill out interactive PDF forms, checkboxes, and form fields directly in your browser.",
        "icon": "FileSignature",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "pdf-signature-signer",
        "name": "PDF Electronic Signature Signer",
        "description": "Draw or upload electronic signatures to legally sign agreements and contracts in PDF format.",
        "icon": "PenTool",
        "isComingSoon": true,
        "tag": "Coming Soon"
      }
    ]
  },
  {
    "slug": "developer-seo",
    "aliases": [
      "developer",
      "seo",
      "dev-tools",
      "developer-tools"
    ],
    "name": "Developer & SEO Utilities",
    "dbCategories": [
      "Developer & SEO",
      "SEO & Marketing"
    ],
    "icon": "Globe",
    "tagline": "High-Precision Utilities for Web Developers, Engineers & Technical SEO Specialists",
    "description": "Test regular expressions, decode JWT tokens, inspect HTTP status codes, format SQL, generate XML sitemaps, build UTM links, and simulate Google SERP snippets.",
    "metaTitle": "Free Developer & SEO Tools Online | Zoqonyx Solution Hub",
    "metaDesc": "JWT token decoder, Regex tester, SQL query formatter, XML sitemap generator, UTM campaign link builder, HTTP status reference, and Google SERP snippet preview.",
    "badge": "31+ Dev & SEO Tools",
    "heroGradient": "from-teal-500/20 via-blue-500/15 to-purple-500/20",
    "longContent": {
      "overview": "Engineering modern web applications requires dozens of daily micro-utilities: inspecting auth tokens, debugging regular expressions, formatting queries, and auditing meta tags. Zoqonyx provides a unified, zero-distraction developer toolkit with instant execution.",
      "keyBenefits": [
        {
          "title": "Offline-First Execution",
          "desc": "Tools run instantly with zero network round-trip overhead."
        },
        {
          "title": "Security for Secrets",
          "desc": "Decode JWTs and inspect JSON payloads without exposing private API keys or customer data."
        },
        {
          "title": "Technical SEO Precision",
          "desc": "Generate XML sitemaps, validate canonical tags, and build trackable UTM parameters."
        },
        {
          "title": "Cross-Language Compatibility",
          "desc": "Format SQL, HTML, CSS, JavaScript, and XML with standard conventions."
        }
      ],
      "popularWorkflows": [
        {
          "title": "API Authentication Debugging",
          "steps": [
            "Paste JWT token",
            "Inspect header algorithm & expiration",
            "Verify claims"
          ]
        },
        {
          "title": "Technical SEO Campaign Setup",
          "steps": [
            "Build UTM parameter link",
            "Verify canonical tag",
            "Generate XML sitemap"
          ]
        }
      ],
      "deepDiveArticle": "Developer velocity improves dramatically when tools are instantaneous, reliable, and respectful of sensitive credentials. Zoqonyx delivers competitor-grade utilities with zero registration."
    },
    "faqs": [
      {
        "question": "Are decoded JWT tokens logged on your server?",
        "answer": "Never. The JWT decoder runs purely through JavaScript atob and JSON.parse in your browser tab."
      },
      {
        "question": "Do the SEO tools conform to official Google guidelines?",
        "answer": "Yes, our Schema generators and SERP snippet previews follow schema.org and Google Search Central specifications."
      }
    ],
    "fallbackTools": [
      {
        "slug": "json-formatter",
        "name": "JSON Formatter & Validator",
        "description": "Validate, format, indent, and minify complex JSON documents with real-time error detection.",
        "icon": "Braces",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "base64-encode-decode",
        "name": "Base64 Encoder / Decoder",
        "description": "Encode and decode text strings, binary data, and payloads using standard Base64 encoding.",
        "icon": "Binary",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "uuid-generator",
        "name": "UUID / GUID Generator",
        "description": "Generate cryptographically secure Version 4 UUIDs in bulk for database keys and testing.",
        "icon": "Fingerprint",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "password-generator",
        "name": "Strong Password Generator",
        "description": "Create random high-entropy passwords with custom length, symbols, and memorability settings.",
        "icon": "Lock",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "diff-checker",
        "name": "Text & Code Diff Checker",
        "description": "Compare two blocks of code or text side-by-side with line-by-line difference highlights.",
        "icon": "GitCompare",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "hash-generator",
        "name": "Hash Generator",
        "description": "Compute secure cryptographic checksums including MD5, SHA-1, SHA-256, and SHA-512.",
        "icon": "ShieldCheck",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "url-encoder-decoder",
        "name": "URL Encoder / Decoder",
        "description": "Safely encode and decode query parameters, special characters, and URI components.",
        "icon": "Link",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "jwt-decoder",
        "name": "JWT Token Decoder",
        "description": "Decode JSON Web Tokens, inspect header algorithms, payload claims, and check expiration status.",
        "icon": "Key",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "regex-tester",
        "name": "Regular Expression Tester",
        "description": "Test regular expressions interactively with live match highlights, flags, and capture groups.",
        "icon": "Code2",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "html-beautifier-minifier",
        "name": "HTML Beautifier & Minifier",
        "description": "Format, indent, or compress HTML markup with clean spacing and tag preservation.",
        "icon": "FileCode",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "css-beautifier-minifier",
        "name": "CSS Beautifier & Minifier",
        "description": "Format messy CSS stylesheets or minify them into lightweight production bundles.",
        "icon": "Palette",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "javascript-beautifier-minifier",
        "name": "JavaScript Beautifier & Minifier",
        "description": "Cleanly format and indent JavaScript scripts or minify code to reduce bundle sizes.",
        "icon": "Terminal",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "sql-formatter",
        "name": "SQL Query Formatter",
        "description": "Beautify complex SQL queries with standard uppercase keywords and readable line breaks.",
        "icon": "Database",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "xml-formatter",
        "name": "XML Formatter",
        "description": "Indent, format, and validate hierarchical XML documents with syntax error detection.",
        "icon": "FileText",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "code-to-image",
        "name": "Code Snippet to Image",
        "description": "Turn source code snippets into beautiful social media screenshots with custom themes and Mac window buttons.",
        "icon": "Image",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "timestamp-converter",
        "name": "Unix Timestamp Converter",
        "description": "Convert Unix epoch timestamps to UTC and local date formats, or dates to epoch seconds.",
        "icon": "Clock",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "css-to-tailwind",
        "name": "CSS to Tailwind Converter",
        "description": "Convert standard CSS property declarations into Tailwind CSS utility classes.",
        "icon": "Code2",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "html-entity-encoder-decoder",
        "name": "HTML Entity Encoder",
        "description": "Convert special characters into HTML entities and decode numeric entity codes back to text.",
        "icon": "Type",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "cron-expression-generator",
        "name": "Cron Expression Generator",
        "description": "Build cron job schedules visually and get instant plain-English explanations.",
        "icon": "Calendar",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "json-to-csv",
        "name": "JSON to CSV Converter",
        "description": "Transform structured JSON arrays into clean CSV spreadsheets with one-click export.",
        "icon": "Table",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "qr-code-generator",
        "name": "QR Code Generator",
        "description": "Create customized, high-resolution QR codes for websites, text, and Wi-Fi credentials.",
        "icon": "QrCode",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "open-graph-preview",
        "name": "Open Graph Generator & Preview",
        "description": "Generate Open Graph and Twitter Card meta tags with live social media card previews.",
        "icon": "Globe",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "meta-tags-generator",
        "name": "Meta Tags Generator",
        "description": "Generate comprehensive search engine meta tags for optimal Google indexing.",
        "icon": "FileCode",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "robots-txt-generator",
        "name": "Robots.txt Generator",
        "description": "Create customized robots.txt files to manage search engine crawler crawl budgets.",
        "icon": "Bot",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "xml-sitemap-generator",
        "name": "XML Sitemap Generator",
        "description": "Build search-engine-ready XML sitemaps from URL lists with change frequencies and priorities.",
        "icon": "FileText",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "utm-builder",
        "name": "Google Analytics UTM Builder",
        "description": "Build trackable campaign URLs with source, medium, campaign, and content parameters.",
        "icon": "Link",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "keyword-density-checker",
        "name": "Keyword Density Checker",
        "description": "Analyze word frequency and keyword density percentages to prevent search engine over-optimization.",
        "icon": "Search",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "canonical-tag-checker",
        "name": "Canonical Tag Generator",
        "description": "Format and validate search engine canonical link tags to resolve duplicate content issues.",
        "icon": "CheckCircle",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "schema-markup-generator",
        "name": "Schema Markup Generator",
        "description": "Generate structured JSON-LD schema code for FAQ pages, articles, and corporate entities.",
        "icon": "Braces",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "http-status-codes",
        "name": "HTTP Status Codes Diagnostic",
        "description": "Look up 1xx to 5xx HTTP response codes with clear definitions and SEO implications.",
        "icon": "HelpCircle",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "serp-snippet-preview",
        "name": "Google SERP Snippet Simulator",
        "description": "Preview how your page title, meta description, and URL will appear in Google search results.",
        "icon": "Search",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "website-speed-audit",
        "name": "Website Speed & Core Web Vitals Audit",
        "description": "Benchmark website load times, Largest Contentful Paint (LCP), and render bottlenecks.",
        "icon": "Gauge",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "broken-link-checker",
        "name": "Broken Link Checker",
        "description": "Crawl domains to detect 404 dead links, redirect loops, and server connection failures.",
        "icon": "Link2Off",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "dns-lookup-tool",
        "name": "DNS Records Lookup",
        "description": "Query A, AAAA, MX, CNAME, TXT, and NS records across global DNS nameservers.",
        "icon": "Server",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "whois-domain-checker",
        "name": "WHOIS Domain & Registrar Lookup",
        "description": "Inspect domain ownership records, expiry dates, registrar information, and DNS servers.",
        "icon": "Search",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "ssl-certificate-checker",
        "name": "SSL Certificate Health Checker",
        "description": "Verify SSL/TLS certificate validity, issuer trust chains, expiry alerts, and cipher security.",
        "icon": "ShieldAlert",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "subdomain-finder",
        "name": "Subdomain Scanner & Discovery",
        "description": "Discover public subdomains and web assets associated with any target domain name.",
        "icon": "Network",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "api-mock-server",
        "name": "API Mock Server & Endpoint Tester",
        "description": "Simulate REST and GraphQL API responses with custom JSON schema mocks and latency control.",
        "icon": "Cpu",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "graphql-query-builder",
        "name": "GraphQL Query & Schema Builder",
        "description": "Build, test, and lint GraphQL queries, mutations, and fragments against live endpoints.",
        "icon": "Share2",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "dockerfile-generator",
        "name": "Dockerfile & Container Generator",
        "description": "Generate hardened, multi-stage Dockerfiles for Node.js, Python, Go, and Rust applications.",
        "icon": "Box",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "kubernetes-yaml-validator",
        "name": "Kubernetes YAML Validator & Linter",
        "description": "Validate Kubernetes deployments, services, and ingress manifests against official schemas.",
        "icon": "CheckSquare",
        "isComingSoon": true,
        "tag": "Coming Soon"
      }
    ]
  },
  {
    "slug": "text-code",
    "aliases": [
      "text",
      "code",
      "text-tools",
      "string-utilities"
    ],
    "name": "Text & Code Utilities",
    "dbCategories": [
      "Text & Code"
    ],
    "icon": "Code2",
    "tagline": "Clean, Format, Transform & Analyze Text and Source Code with Instant Browser Execution",
    "description": "Transform text casing, clean extra spaces, generate markdown tables, convert markdown to HTML, count words and characters, sort lists, and run text-to-speech.",
    "metaTitle": "Free Online Text & Code Utilities | Zoqonyx Solution Hub",
    "metaDesc": "Case converter, word & character counter, Markdown to HTML converter, text to speech, speech to text dictation, list sorter, duplicate remover, and diff checker.",
    "badge": "21+ Text Solutions",
    "heroGradient": "from-teal-500/20 via-indigo-500/15 to-blue-500/20",
    "longContent": {
      "overview": "From stripping awkward copy-paste whitespace to converting casing for code identifiers, text formatting tools are essential for authors, programmers, and editors. Zoqonyx provides reactive text manipulation with instantaneous feedback.",
      "keyBenefits": [
        {
          "title": "Live Reactive Statistics",
          "desc": "Real-time updates of characters, words, sentences, and estimated reading times."
        },
        {
          "title": "Voice Integration",
          "desc": "Listen to natural speech synthesis or dictate notes using speech-to-text."
        },
        {
          "title": "Markdown Productivity",
          "desc": "Visual table generator and instant Markdown-to-HTML rendering."
        },
        {
          "title": "Clean Data Sanitization",
          "desc": "Remove duplicate lines, sort lists, and eliminate redundant whitespace."
        }
      ],
      "popularWorkflows": [
        {
          "title": "Content Copywriting Polish",
          "steps": [
            "Paste draft",
            "Inspect readability and word counts",
            "Strip excess formatting spaces"
          ]
        },
        {
          "title": "Code Identifier Conversion",
          "steps": [
            "Paste strings",
            "Convert to camelCase or snake_case",
            "One-click copy to clipboard"
          ]
        }
      ],
      "deepDiveArticle": "High-quality text formatting eliminates mundane friction in writing and programming workflows. Zoqonyx executes all text parsing in-memory."
    },
    "faqs": [
      {
        "question": "Can I dictate using my microphone?",
        "answer": "Yes, our Speech to Text Dictation tool utilizes modern Web Speech Recognition APIs to transcribe voice in real time."
      },
      {
        "question": "Is there a limit on text length?",
        "answer": "You can paste tens of thousands of words without lag thanks to client-side memory handling."
      }
    ],
    "fallbackTools": [
      {
        "slug": "case-converter",
        "name": "Case Converter",
        "description": "Convert text instantly between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case.",
        "icon": "CaseSensitive",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "markdown-html-converter",
        "name": "Markdown to HTML Converter",
        "description": "Convert Markdown syntax into sanitized HTML markup with real-time rendered preview.",
        "icon": "FileCode",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "lorem-ipsum-generator",
        "name": "Lorem Ipsum Generator",
        "description": "Generate custom paragraphs, sentences, or words of classic placeholder filler text.",
        "icon": "AlignLeft",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "word-counter",
        "name": "Word Counter",
        "description": "Count words, characters, sentences, and estimated reading time with real-time text analysis.",
        "icon": "FileText",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "character-counter",
        "name": "Character Counter",
        "description": "Count characters with and without whitespace, syllables, and speaking durations.",
        "icon": "Type",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "find-and-replace",
        "name": "Find and Replace Text",
        "description": "Search and replace words or regex patterns across text documents in real time.",
        "icon": "Search",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "remove-extra-spaces",
        "name": "Remove Extra Spaces",
        "description": "Strip multiple consecutive spaces, trailing whitespace, and blank lines from text.",
        "icon": "Scissors",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "reverse-text",
        "name": "Reverse Text Generator",
        "description": "Reverse text character by character, word by word, or line by line.",
        "icon": "RotateCcw",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "slug-generator",
        "name": "URL Slug Generator",
        "description": "Convert article titles and headlines into clean, search-engine-friendly URL slugs.",
        "icon": "Link",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "markdown-table-generator",
        "name": "Markdown Table Generator",
        "description": "Interactive visual table builder that outputs formatted Markdown and HTML table code.",
        "icon": "Table",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "text-to-speech",
        "name": "Text to Speech",
        "description": "Listen to natural speech playback of any text with customizable voice pitch and speed.",
        "icon": "Volume2",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "speech-to-text",
        "name": "Speech to Text Dictation",
        "description": "Transcribe spoken words from your microphone directly into text using web speech recognition.",
        "icon": "Mic",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "list-sorter",
        "name": "List Sorter",
        "description": "Sort text lists alphabetically (A-Z or Z-A), by length, or randomize order.",
        "icon": "ArrowUpDown",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "duplicate-line-remover",
        "name": "Duplicate Line Remover",
        "description": "Detect and remove duplicate lines from lists and datasets while preserving line order.",
        "icon": "Trash2",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "random-string-generator",
        "name": "Random String Generator",
        "description": "Generate random strings, cryptographic salts, and test tokens with customizable characters.",
        "icon": "Sparkles",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "text-statistics",
        "name": "Text Readability Statistics",
        "description": "Calculate Flesch Reading Ease scores, average sentence lengths, and vocabulary metrics.",
        "icon": "BookOpen",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "ai-article-writer",
        "name": "AI Article & Blog Writer",
        "description": "Generate well-researched, SEO-optimized blog posts, outlines, and educational articles.",
        "icon": "PenTool",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "ai-code-explainer",
        "name": "AI Code Explainer & Reviewer",
        "description": "Understand complex algorithms, detect edge-case bugs, and get human-readable code explanations.",
        "icon": "Code2",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "ai-resume-builder",
        "name": "AI Resume & CV Builder",
        "description": "Build ATS-friendly modern resumes with automated bullet-point suggestions and formatting.",
        "icon": "FileText",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "ai-email-generator",
        "name": "AI Professional Email Generator",
        "description": "Draft persuasive cold outreach emails, customer support responses, and executive correspondence.",
        "icon": "Mail",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "ai-grammar-checker",
        "name": "AI Grammar & Spelling Checker",
        "description": "Polish essays, articles, and communications with advanced stylistic and grammatical enhancements.",
        "icon": "CheckCircle",
        "isComingSoon": true,
        "tag": "Coming Soon"
      }
    ]
  },
  {
    "slug": "css-design",
    "aliases": [
      "css",
      "design",
      "css-generators"
    ],
    "name": "CSS & Design Generators",
    "dbCategories": [
      "CSS & Design"
    ],
    "icon": "Layers",
    "tagline": "Visual CSS Generators with Real-Time Interactive Previews & Clean Code Export",
    "description": "Design neumorphic shadows, clip paths, multi-layer drop shadows, CSS gradients, flexbox layouts, glassmorphism, buttons, and responsive grid structures.",
    "metaTitle": "Free Visual CSS Generators & Web Design Tools | Zoqonyx",
    "metaDesc": "Design border-radius, box-shadows, CSS gradients, neumorphism, clip-paths, text-shadows, glassmorphism, and flexbox layouts with instant CSS code export.",
    "badge": "12+ CSS Generators",
    "heroGradient": "from-teal-500/20 via-pink-500/15 to-purple-500/20",
    "longContent": {
      "overview": "Crafting modern web interfaces requires precise CSS properties that can be tedious to hand-code. Zoqonyx CSS generators provide intuitive visual controls, real-time canvases, and production-ready code with single-click clipboard copying.",
      "keyBenefits": [
        {
          "title": "Interactive Canvas Previews",
          "desc": "See shadow blurs, border curvatures, and gradient transitions update at 60 FPS."
        },
        {
          "title": "Clean Semantic Code",
          "desc": "Generates modern CSS rules with vendor-free, W3C-standard declarations."
        },
        {
          "title": "Preset Inspiration",
          "desc": "Includes curated aesthetic presets for soft UI, glassmorphism, and modern cards."
        },
        {
          "title": "Zero Layout Shift",
          "desc": "Responsive test areas help you verify designs across viewport constraints."
        }
      ],
      "popularWorkflows": [
        {
          "title": "Card Elevation Design",
          "steps": [
            "Adjust light/dark shadow offsets",
            "Fine-tune blur and opacity",
            "Copy box-shadow CSS"
          ]
        },
        {
          "title": "Hero Gradient Styling",
          "steps": [
            "Select multi-stop color palette",
            "Adjust linear angle",
            "Copy background declaration"
          ]
        }
      ],
      "deepDiveArticle": "Visual tools accelerate design iteration. By testing elevations, clip shapes, and gradients visually, developers create polish in minutes instead of trial-and-error."
    },
    "faqs": [
      {
        "question": "Is the generated CSS compatible with all browsers?",
        "answer": "Yes, our tools export standard modern CSS supported by Google Chrome, Firefox, Safari, and Edge."
      },
      {
        "question": "Can I use these styles with Tailwind CSS?",
        "answer": "Yes, you can use our CSS to Tailwind converter or paste the values directly into tailwind.config.js."
      }
    ],
    "fallbackTools": [
      {
        "slug": "border-radius-generator",
        "name": "Border Radius Generator",
        "description": "Design custom 8-value rounded corners visually and copy clean CSS border-radius code.",
        "icon": "Square",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "box-shadow-generator",
        "name": "Box Shadow Generator",
        "description": "Create complex multi-layer CSS drop shadows and inset glow effects with live preview.",
        "icon": "Layers",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "css-gradient-generator",
        "name": "CSS Gradient Generator",
        "description": "Design linear, radial, and multi-color gradients with angle controls and CSS output.",
        "icon": "Sparkles",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "button-generator",
        "name": "CSS Button Generator",
        "description": "Style modern buttons with hover transitions, padding, shadows, and copy ready-to-use CSS.",
        "icon": "MousePointer",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "flexbox-playground",
        "name": "Flexbox Playground",
        "description": "Interactive visual simulator to master CSS flex directions, alignments, wraps, and gaps.",
        "icon": "Layout",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "glassmorphism-generator",
        "name": "Glassmorphism Generator",
        "description": "Generate frosted-glass UI styling with backdrop filters, border transparency, and reflection shadows.",
        "icon": "Eye",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "css-grid-generator",
        "name": "CSS Grid Generator",
        "description": "Visually create CSS grid layouts with dynamic columns, rows, and gaps.",
        "icon": "Grid",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "neumorphism-generator",
        "name": "Neumorphism Generator",
        "description": "Generate soft UI neumorphic shadow elevations with inset and flat surface toggles.",
        "icon": "Layers",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "clip-path-generator",
        "name": "CSS Clip Path Generator",
        "description": "Design polygons, circles, stars, and complex geometric shapes using CSS clip-path.",
        "icon": "Crop",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "text-shadow-generator",
        "name": "Text Shadow Generator",
        "description": "Create vibrant neon glows, 3D text effects, and deep typographic shadows with CSS code.",
        "icon": "Type",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "color-palette-generator",
        "name": "Color Palette Generator",
        "description": "Generate cohesive color palettes with copy-ready HEX codes and contrast previews.",
        "icon": "Palette",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "aspect-ratio-calculator",
        "name": "Aspect Ratio Calculator",
        "description": "Calculate 16:9, 4:3, 1:1, and 21:9 dimensions and copy CSS aspect-ratio properties.",
        "icon": "Maximize2",
        "isComingSoon": false,
        "tag": "Active Free"
      }
    ]
  },
  {
    "slug": "calculators",
    "aliases": [
      "calc",
      "math",
      "finance"
    ],
    "name": "Calculators & Financial Math",
    "dbCategories": [
      "Calculators"
    ],
    "icon": "Calculator",
    "tagline": "Accurate Loan EMI, Compound Interest, Discounts, Invoices, Tips & Math Calculators",
    "description": "Calculate monthly loan installments, split restaurant checks, compute compound investment returns, generate client invoices, and convert numbers across numerical bases.",
    "metaTitle": "Free Online Calculators (Finance, Math & Business) | Zoqonyx",
    "metaDesc": "Loan EMI calculator, compound interest growth, discount & sales tax, tip split, number to words, client invoice generator, and multi-base binary hex decimal conversions.",
    "badge": "20+ Calculators",
    "heroGradient": "from-teal-500/20 via-emerald-500/15 to-teal-600/20",
    "longContent": {
      "overview": "Financial planning and mathematical estimation require accuracy and clarity. Zoqonyx calculators offer transparent breakdowns, amortization summaries, and formatted outputs without ads or hidden paywalls.",
      "keyBenefits": [
        {
          "title": "Mathematical Precision",
          "desc": "Calculations follow standard financial compounding and loan amortization algorithms."
        },
        {
          "title": "Instant Dynamic Updates",
          "desc": "Change any variable to see live updates to installments, savings, and totals."
        },
        {
          "title": "Printable Document Generation",
          "desc": "Create and print itemized client invoices with tax and discounts directly to PDF."
        },
        {
          "title": "Multi-Base Conversion",
          "desc": "Simultaneously view values across Decimal, Binary, Hexadecimal, and Octal."
        }
      ],
      "popularWorkflows": [
        {
          "title": "Loan Financing Planning",
          "steps": [
            "Enter loan amount and tenure",
            "Set interest rate",
            "Inspect monthly EMI and total interest"
          ]
        },
        {
          "title": "Client Invoicing",
          "steps": [
            "Add billable line items and rates",
            "Calculate subtotal and tax",
            "Print or save PDF invoice"
          ]
        }
      ],
      "deepDiveArticle": "Transparent financial calculators empower consumers and businesses to make informed borrowing and investment decisions without consulting biased sales representatives."
    },
    "faqs": [
      {
        "question": "How accurate is the Loan EMI calculator?",
        "answer": "Our Loan EMI calculator uses the standard banking reducing-balance formula used by major financial institutions worldwide."
      },
      {
        "question": "Can I download or print generated invoices?",
        "answer": "Yes! Click the Print / Save PDF button on the Invoice Generator to export a clean, client-ready invoice."
      }
    ],
    "fallbackTools": [
      {
        "slug": "unit-converter",
        "name": "Universal Unit Converter",
        "description": "Convert units of length, mass, temperature, area, volume, and digital data storage.",
        "icon": "Scale",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "age-calculator",
        "name": "Age Calculator",
        "description": "Calculate your exact age in years, months, weeks, days, hours, and minutes.",
        "icon": "Calendar",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "percentage-calculator",
        "name": "Percentage Calculator",
        "description": "Compute percentages, fractional differences, percentage increases, and discounts.",
        "icon": "Percent",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "bmi-calculator",
        "name": "BMI Health Calculator",
        "description": "Calculate Body Mass Index (BMI) and discover healthy weight ranges based on height.",
        "icon": "Activity",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "loan-emi-calculator",
        "name": "Loan EMI Calculator",
        "description": "Calculate monthly installments, total interest, and repayment schedules for loans.",
        "icon": "DollarSign",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "tip-calculator",
        "name": "Tip Calculator",
        "description": "Split restaurant bills evenly and calculate custom tip percentages per person.",
        "icon": "Receipt",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "discount-calculator",
        "name": "Discount & Sale Calculator",
        "description": "Calculate sale prices, final costs, and total dollars saved during retail shopping.",
        "icon": "Percent",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "compound-interest-calculator",
        "name": "Compound Interest Calculator",
        "description": "Calculate long-term investment growth with recurring monthly contributions.",
        "icon": "TrendingUp",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "sales-tax-calculator",
        "name": "Sales Tax Calculator",
        "description": "Calculate gross totals and net tax amounts based on local VAT and sales tax rates.",
        "icon": "Receipt",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "number-to-words",
        "name": "Number to Words Converter",
        "description": "Convert numeric currency figures and integers into formal English words.",
        "icon": "Type",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "binary-hex-decimal",
        "name": "Binary / Hex / Decimal Calculator",
        "description": "Convert numbers across Decimal, Binary, Hexadecimal, and Octal bases simultaneously.",
        "icon": "Binary",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "invoice-generator",
        "name": "Client Invoice Generator",
        "description": "Create and print professional client invoices with itemized line totals and tax.",
        "icon": "FileText",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "gpa-calculator",
        "name": "College GPA Calculator",
        "description": "Calculate semester and cumulative Grade Point Averages across custom credit courses.",
        "icon": "GraduationCap",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "fuel-cost-calculator",
        "name": "Trip Fuel Cost Calculator",
        "description": "Estimate road trip gasoline expenses using distance, vehicle fuel economy, and gas prices.",
        "icon": "Car",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "time-duration-calculator",
        "name": "Time Duration Calculator",
        "description": "Calculate exact hours and minutes elapsed between two times or dates.",
        "icon": "Clock",
        "isComingSoon": false,
        "tag": "Active Free"
      },
      {
        "slug": "crypto-portfolio-tracker",
        "name": "Crypto Portfolio & Profit Tracker",
        "description": "Track cryptocurrency balances, average buy prices, profit/loss, and portfolio allocation.",
        "icon": "Coins",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "sip-investment-calculator",
        "name": "SIP Mutual Fund Investment Calculator",
        "description": "Calculate expected mutual fund returns and wealth accumulation for Systematic Investment Plans.",
        "icon": "TrendingUp",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "mortgage-refinance-calculator",
        "name": "Mortgage Refinance Savings Calculator",
        "description": "Determine whether refinancing your home mortgage reduces monthly payments and lifetime interest.",
        "icon": "Home",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "retirement-corpus-calculator",
        "name": "Retirement Corpus & Pension Calculator",
        "description": "Estimate the nest egg needed to retire comfortably based on inflation and life expectancy.",
        "icon": "Clock",
        "isComingSoon": true,
        "tag": "Coming Soon"
      },
      {
        "slug": "freelance-hourly-rate-calculator",
        "name": "Freelance Hourly Rate & Income Calculator",
        "description": "Calculate the ideal billable hourly rate needed to cover taxes, expenses, and desired salary.",
        "icon": "DollarSign",
        "isComingSoon": true,
        "tag": "Coming Soon"
      }
    ]
  },
  {
    "slug": "ai-tools",
    "aliases": [
      "ai",
      "smart-tools",
      "ai-utilities"
    ],
    "name": "AI & Smart Tools",
    "dbCategories": [
      "Advanced Image / AI",
      "AI Writing & Business"
    ],
    "icon": "Cpu",
    "tagline": "Next-Generation Machine Learning & Neural Utilities for Creative Workflows",
    "description": "Object removal, watermark elimination, neural background segmentation, voice synthesis, and upcoming generative writing assistants.",
    "metaTitle": "AI & Smart Tools Online (Free & Fast) | Zoqonyx Solution Hub",
    "metaDesc": "Object remover, watermark eraser, text to speech, speech recognition, and upcoming neural video and article writing assistants.",
    "badge": "8+ AI Utilities",
    "heroGradient": "from-teal-500/20 via-violet-500/15 to-purple-500/20",
    "longContent": {
      "overview": "Artificial intelligence transforms time-consuming media editing tasks into one-click actions. Zoqonyx integrates intelligent canvas inpainting and web neural models to clean photos and enhance workflows.",
      "keyBenefits": [
        {
          "title": "Zero Watermarks",
          "desc": "Final outputs are clean, high-resolution, and unencumbered by platform logos."
        },
        {
          "title": "Client-Side Processing",
          "desc": "Watermark and object removal run on canvas primitives inside your browser."
        },
        {
          "title": "Audio & Speech Intelligence",
          "desc": "Browser-based neural text-to-speech and real-time speech recognition."
        },
        {
          "title": "Upcoming Generative Tools",
          "desc": "Full suite of video compression, screen recording, and article generators in active development."
        }
      ],
      "popularWorkflows": [
        {
          "title": "Photo Cleanup",
          "steps": [
            "Upload photograph",
            "Brush over unwanted text or photobomber",
            "Inpaint clean background"
          ]
        },
        {
          "title": "Audio Transcription",
          "steps": [
            "Click Start Dictation",
            "Speak notes into microphone",
            "Copy transcribed text"
          ]
        }
      ],
      "deepDiveArticle": "AI tools should empower creators without subscription hostage tactics. Zoqonyx continues expanding its suite of accessible, zero-cost smart utilities."
    },
    "faqs": [
      {
        "question": "Are the AI tools completely free?",
        "answer": "Yes, our watermark remover, object eraser, and speech tools are 100% free with no login required."
      },
      {
        "question": "How can I get early access to upcoming AI tools?",
        "answer": "Enter your email on any Coming Soon tool page to receive an early access invite when it launches."
      }
    ],
    "fallbackTools": []
  }
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
