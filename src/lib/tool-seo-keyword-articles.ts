import type { ToolSeoArticle } from "@/lib/tool-seo-content";

// Keyword-led articles for the pages that get Search Console impressions.
// Titles, headings and FAQs follow the queries people actually search
// (Search Console, last 90 days). Every claim matches what the tool does:
// the copy tools are template-based and run in the browser, with no AI model.
// These override the older articles in tool-seo-content.ts.

export const KEYWORD_ARTICLES: Record<string, ToolSeoArticle> = {
  "backlink-checker": {
    slug: "backlink-checker",
    title: "Free Backlink Checker: Audit Your Website Backlinks | Zoqonyx",
    metaDesc:
      "Check backlinks for free: upload your Search Console, Ahrefs or Semrush export and see referring domains, anchor text and spam links. No sign-up.",
    workflowHeading: "How to check your backlinks for free",
    howToSteps: [
      {
        step: 1,
        title: "Export your backlinks",
        instruction:
          "In Google Search Console open Links, then export Top linking sites or Latest links. Ahrefs, Semrush and Moz exports work too.",
      },
      { step: 2, title: "Upload or paste", instruction: "Drop the CSV files here, or paste linking URLs or domains, one per line." },
      {
        step: 3,
        title: "Review the audit",
        instruction:
          "See the number of backlinks and referring domains, follow vs nofollow (if your file has it), top anchors and flagged links.",
      },
      { step: 4, title: "Export", instruction: "Download the audit as CSV, or a disavow file draft for the flagged domains." },
    ],
    keyBenefits: [
      { title: "Works with free Search Console data", desc: "No paid SEO tool needed: Google Search Console's link export is enough." },
      { title: "Referring domains and anchors", desc: "Counts unique linking domains and shows which anchor texts point to you most." },
      { title: "Spam link flags", desc: "Flags links from low-reputation domain endings and anchors with spam words." },
      { title: "Your file stays on your device", desc: "Files are read in your browser and are not uploaded." },
    ],
    proTips: [
      "Look at referring domains, not just total backlinks: 100 links from one site count far less than 10 links from 10 sites.",
      "A natural profile has many branded and URL anchors. Lots of exact-match keyword anchors can look manipulative.",
      "Only disavow links after a manual action for unnatural links, or when you know of paid links you can't remove.",
    ],
    faqs: [
      {
        question: "How do I check the backlinks of my website for free?",
        answer:
          "Open Google Search Console, go to Links and export Top linking sites or Latest links, then upload the file here. You'll see your referring domains, anchors and any suspicious links.",
      },
      {
        question: "Can this tool check backlinks of any domain?",
        answer:
          "Only from data you provide. A browser can't crawl the web, so the tool analyses exports from Search Console, Ahrefs, Semrush or Moz, or a list you paste. For a competitor, export their backlinks from a paid SEO tool.",
      },
      {
        question: "Is there a backlink checker API?",
        answer:
          "Zoqonyx doesn't offer an API. Google's Search Console API doesn't include the Links report either, so to get backlink data programmatically you need a paid provider such as Ahrefs, Semrush, Moz or Majestic. Export or download their data as CSV and upload it here to audit it.",
      },
      {
        question: "What are referring domains?",
        answer:
          "Referring domains are the unique websites that link to you. Ten links from one website count as one referring domain.",
      },
      {
        question: "Can I see my backlink history?",
        answer:
          "This tool doesn't store history. To compare over time, export your links on different dates and audit each file.",
      },
      {
        question: "When should I use a disavow file?",
        answer:
          "Google advises disavowing links only after a manual action for unnatural links, or when you have many paid or spam links you can't get removed. Most sites never need one.",
      },
    ],
    deepDiveContent: `
### What a backlink check tells you

A backlink is a link from another website to yours. Search engines treat links from relevant, trusted sites as a sign that your page is useful. Checking your backlinks shows who links to you, which pages they point to, and whether any of those links look like spam.

### Backlinks vs referring domains

- **Backlinks**: every individual link, including many from the same site.
- **Referring domains**: the number of different websites linking to you. This is usually the better measure.

### Getting the data from Search Console

In Search Console, the Links report lists your top linking sites and recent links. Export them as CSV and upload them here. Search Console shows a sample of your links, not every one, but it is free and comes straight from Google.

### Spotting bad links

Look for links from domains that have nothing to do with your topic, unusual domain endings, or anchors stuffed with keywords or adult and gambling terms. Most sites can ignore these: Google already discounts most spam links.
`,
  },

  "schema-markup-generator": {
    slug: "schema-markup-generator",
    title: "Schema Markup Generator: Free JSON-LD & FAQ Schema | Zoqonyx",
    metaDesc:
      "Generate JSON-LD schema markup online for FAQ, Product, Article, LocalBusiness, HowTo and more. Copy the code or test it in Google's Rich Results Test. Free.",
    workflowHeading: "How to generate schema markup",
    howToSteps: [
      {
        step: 1,
        title: "Choose a schema type",
        instruction:
          "Pick FAQPage, Article, Product, LocalBusiness, HowTo, Recipe, Event, BreadcrumbList, Organization or WebSite.",
      },
      {
        step: 2,
        title: "Fill in the fields",
        instruction:
          "Add the page title, description, URL and the details for that type, such as questions and answers for FAQ schema or price and rating for Product schema.",
      },
      {
        step: 3,
        title: "Copy the JSON-LD",
        instruction:
          "The code updates as you type. Copy it, or download it as a .jsonld file.",
      },
      {
        step: 4,
        title: "Add it to your page and test it",
        instruction:
          "Paste the script into the page's <head> (or your CMS's custom head field), then open Google's Rich Results Test to check it.",
      },
    ],
    keyBenefits: [
      { title: "10 schema types", desc: "FAQPage, Article, Product, LocalBusiness, HowTo, Recipe, Event, BreadcrumbList, Organization and WebSite." },
      { title: "JSON-LD output", desc: "The format Google recommends, kept separate from your HTML so it is easy to update." },
      { title: "Live preview of the code", desc: "See the script change as you fill in each field, then copy or download it." },
      { title: "One click to Google's test", desc: "Open the Rich Results Test with your code already loaded." },
    ],
    proTips: [
      "Only mark up content that is visible on the page. Google ignores, or can penalise, markup for content users cannot see.",
      "Use one main type per page (for example Product on a product page) and add BreadcrumbList alongside it.",
      "After publishing, check the Enhancements reports in Google Search Console for errors.",
    ],
    faqs: [
      {
        question: "What is schema markup?",
        answer:
          "Schema markup is structured data from schema.org that describes a page to search engines, for example that it is a product with a price or an article with an author. It is usually added as a JSON-LD script.",
      },
      {
        question: "How do I create FAQ schema?",
        answer:
          "Choose FAQPage, add each question and its answer, then copy the JSON-LD into the page that shows those questions. The questions and answers must also be visible on the page.",
      },
      {
        question: "Where do I put JSON-LD schema on my website?",
        answer:
          "Inside a <script type=\"application/ld+json\"> tag in the page's <head>. Most CMSs and SEO plugins have a custom head or schema field you can paste it into.",
      },
      {
        question: "Does schema markup guarantee rich results?",
        answer:
          "No. Valid markup makes a page eligible, but Google decides whether to show a rich result. FAQ rich results, for example, are now shown mainly for well-known government and health sites.",
      },
      {
        question: "Is this schema markup generator free?",
        answer: "Yes. It is free to use with no sign-up, and the code is generated in your browser.",
      },
    ],
    deepDiveContent: `
### What schema markup does

Schema markup tells search engines what the content on a page is: a product, an article, a recipe, a local business or a list of questions. Search engines use it to understand the page and, when they choose to, show rich results such as product prices, star ratings or breadcrumbs.

### JSON-LD vs microdata

JSON-LD is a single script block, separate from your HTML, which is why Google recommends it. Microdata is written into the HTML attributes themselves and is harder to keep in sync when the page changes.

### Which schema type to use

- **Product**: product pages with a name, price and availability.
- **Article**: blog posts and news articles.
- **LocalBusiness**: a business with an address and opening hours.
- **FAQPage**: a page that shows a list of questions with answers.
- **HowTo**: step-by-step instructions.
- **BreadcrumbList**: the trail of links that shows where a page sits on your site.

### Checking your markup

Paste the page URL or the code into Google's Rich Results Test. After the page is live, Search Console shows any structured data errors under Enhancements.
`,
  },

  "ai-product-description": {
    slug: "ai-product-description",
    title: "Product Description Generator for Amazon & Shopify | Zoqonyx",
    metaDesc:
      "Write product descriptions for Amazon, Shopify and ads in seconds. Enter the features, pick a tone and get three versions to copy. Free, no sign-up.",
    workflowHeading: "How to write a product description with this generator",
    howToSteps: [
      { step: 1, title: "Enter the product", instruction: "Type the product name, its category and the key features, one per line." },
      { step: 2, title: "Pick tone and channel", instruction: "Choose a tone (persuasive, luxury, minimal, playful, technical or urgent) and where it will be used: a store listing, Amazon bullets, a social ad or a Google snippet." },
      { step: 3, title: "Compare three versions", instruction: "You get a lifestyle version, a specs-led version and a problem-solving version of the copy." },
      { step: 4, title: "Copy or export", instruction: "Copy the version you like, or export all of them as Markdown." },
    ],
    keyBenefits: [
      { title: "Amazon 5-bullet format", desc: "Bullets kept under 200 characters each, the length Amazon listings use." },
      { title: "Store and ad copy", desc: "Shopify-style descriptions of 150–250 words, plus short ad copy and a search snippet under 155 characters." },
      { title: "Three angles per product", desc: "Lifestyle, specs and problem-solving versions to test against each other." },
      { title: "Use it commercially", desc: "The text is yours to use on your store and marketplace listings." },
    ],
    proTips: [
      "Lead with the benefit, then back it up with the spec: “Lasts all day: 40-hour battery”.",
      "Use the words your customers search for in the first sentence and in the product title.",
      "Edit the result in your own voice before publishing, so it doesn't read like other listings.",
    ],
    faqs: [
      {
        question: "How do I write an Amazon product description?",
        answer:
          "Lead with five short bullet points (under 200 characters each) that start with the main benefit, then add a fuller description below. Choose “Amazon 5 bullets” as the channel and the generator formats it for you.",
      },
      {
        question: "Is this an AI product description generator?",
        answer:
          "No AI model is used. The generator builds the copy from your inputs with writing templates, in your browser, so nothing you type is sent to a server.",
      },
      {
        question: "How long should a product description be?",
        answer:
          "About 150–250 words for a store page, under 200 characters per Amazon bullet, and under 155 characters for a Google search snippet.",
      },
      {
        question: "Can I use the descriptions on my store?",
        answer: "Yes. You can use the generated text commercially on your own store and marketplace listings.",
      },
      {
        question: "Is the product description generator free?",
        answer: "Yes. It is free with no sign-up and no limit on how many descriptions you create.",
      },
    ],
    deepDiveContent: `
### What makes a product description sell

A good description answers three questions quickly: what is it, why would I want it, and why this one. Start with the main benefit, back it up with specific details, and remove anything a shopper would skip.

### Amazon vs Shopify descriptions

- **Amazon**: shoppers scan. The five bullets do most of the work, so each one should start with a benefit and stay under 200 characters.
- **Shopify and your own store**: you have more room for a short story about who the product is for, plus specs and care details.
- **Ads**: one clear benefit and a call to action. Keep it short.

### Writing for search

Use the words people search for, such as the product type and its main feature, in the title and the first sentence. Don't repeat keywords unnaturally; write for the shopper first.
`,
  },

  "ai-sales-pitch": {
    slug: "ai-sales-pitch",
    title: "Sales Pitch Generator: Cold Emails & Call Scripts | Zoqonyx",
    metaDesc:
      "Write a sales pitch, cold email, LinkedIn message and call script from your product and the customer's pain point. PAS, AIDA and BAB frameworks. Free.",
    workflowHeading: "How to write a sales pitch with this generator",
    howToSteps: [
      { step: 1, title: "Describe the offer", instruction: "Enter your product or service and the customer's main pain point." },
      { step: 2, title: "Set the target", instruction: "Add the buyer's role, their industry, the result you deliver and your call to action." },
      { step: 3, title: "Pick a framework", instruction: "Choose PAS, AIDA, BAB or The Challenger Insight." },
      { step: 4, title: "Use the playbook", instruction: "Copy the cold email, 30-second elevator pitch, LinkedIn message, call script and three follow-ups, or export them as Markdown." },
    ],
    keyBenefits: [
      { title: "Every channel at once", desc: "Cold email with subject line, elevator pitch, LinkedIn message and call script from one set of inputs." },
      { title: "Follow-up sequence", desc: "Three follow-ups for day 3, day 7 and day 14." },
      { title: "Objection replies", desc: "Short answers to “we already have a solution”, “just send me an email” and “no budget”." },
      { title: "Proven frameworks", desc: "PAS, AIDA, BAB and The Challenger Insight." },
    ],
    proTips: [
      "Name one specific pain point. A pitch that tries to fix everything sounds like it fixes nothing.",
      "Put a number in the result (“cut onboarding time by 30%”) only if you can back it up.",
      "Keep the first cold email under about 120 words and end with one simple question.",
    ],
    faqs: [
      {
        question: "How do I write a good sales pitch?",
        answer:
          "State the customer's problem in their words, show the result you deliver, give one piece of proof and finish with a clear next step. Frameworks like PAS (Problem, Agitate, Solution) keep it in that order.",
      },
      {
        question: "What is the PAS framework?",
        answer:
          "PAS stands for Problem, Agitate, Solution: name the problem, show what it costs the buyer, then present your offer as the fix.",
      },
      {
        question: "Is this an AI sales pitch generator?",
        answer:
          "No AI model is used. The pitches are built from your inputs with sales-writing templates, in your browser, so your details are not sent to a server.",
      },
      {
        question: "Can it write follow-up emails?",
        answer: "Yes. It writes a three-step follow-up sequence for day 3, day 7 and day 14.",
      },
      {
        question: "Is the sales pitch generator free?",
        answer: "Yes. It is free with no sign-up and no limit on how many pitches you create.",
      },
    ],
    deepDiveContent: `
### The parts of a sales pitch

Every pitch, short or long, has the same parts: the buyer's problem, the result you deliver, proof that you can deliver it, and the next step. Change the length for the channel, not the structure.

### Choosing a framework

- **PAS (Problem, Agitate, Solution)**: good for cold emails to people who already feel the problem.
- **AIDA (Attention, Interest, Desire, Action)**: good for longer emails and landing pages.
- **BAB (Before, After, Bridge)**: shows life before and after your product, then how to get there.
- **The Challenger Insight**: opens with a surprising point about the buyer's business, then reframes the problem.

### Following up

Most replies come after a follow-up. Space them out (for example day 3, day 7 and day 14), add something new each time, and stop after the last one.
`,
  },
};
