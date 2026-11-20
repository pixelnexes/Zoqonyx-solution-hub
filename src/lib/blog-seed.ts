// Built-in blog posts. A published row in the BlogPost table with the same
// slug replaces one of these; new slugs in the admin add new posts.

export interface BlogSeed {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  publishedAt: string; // ISO date
  metaTitle: string; // max 60 characters
  metaDesc: string; // max 155 characters
  content: string; // Markdown
}

export const BLOG_SEEDS: BlogSeed[] = [
  {
    slug: "how-to-check-backlinks-for-free",
    title: "How to Check Your Website's Backlinks for Free",
    excerpt:
      "You don't need a paid SEO tool to see who links to your site. Here is how to export your backlinks from Google Search Console and what to look for.",
    category: "SEO",
    tags: ["backlinks", "google search console", "seo"],
    publishedAt: "2026-11-18",
    metaTitle: "How to Check Your Backlinks for Free (Step by Step)",
    metaDesc: "Check backlinks for free with Google Search Console: where to find the Links report, how to export it and how to spot spammy links.",
    content: `A backlink is a link from another website to yours. Search engines use links as one signal of whether a page is worth showing, so it helps to know who links to you. You can check your backlinks for free with Google Search Console, and no paid tool is needed to get started.

## What you need

- A website verified in [Google Search Console](https://search.google.com/search-console) (it's free)
- A few minutes

If your site isn't set up yet, add it as a property and verify ownership. Search Console only shows links data for sites you own.

## Step 1: Open the Links report

In Search Console, choose **Links** in the left menu. You'll see two sections: **External links** (other sites linking to you) and **Internal links** (your own pages linking to each other).

Under external links you can see:

- **Top linked pages**: which of your pages have the most links
- **Top linking sites**: the websites that link to you most
- **Top linking text**: the anchor text used in the links

## Step 2: Export your links

Open **Top linking sites** and use the export button to download the list as a CSV file. You can also export the latest links from the external links report. Search Console shows a sample of your links rather than every link on the web, but it comes straight from Google and covers your most important ones.

## Step 3: Read the results

Open the file and look at three things:

1. **Referring domains.** Count the number of different websites linking to you. Ten links from one site count for much less than ten links from ten different sites.
2. **Anchor text.** A natural profile has a mix of your brand name, your web address and descriptive phrases. If almost every link uses the same keyword phrase, that can look manipulated.
3. **Relevance.** Links from sites related to your topic are worth more than links from unrelated sites.

You can paste the exported file into the [Zoqonyx backlink checker](/tools/backlink-checker). It counts backlinks and referring domains, lists the most common anchor texts and flags links from low-reputation domains. Your file is read in your browser and isn't uploaded.

## What about spammy links?

Almost every site gets some low-quality links, and Google says it is good at ignoring them. You usually don't need to do anything. A disavow file is only for cases where you have received a manual action for unnatural links, or you know of a large number of paid or spam links you cannot get removed.

## Can I check a competitor's backlinks?

Search Console only shows your own site. To see another site's backlinks you need a tool that crawls the web, such as Ahrefs, Semrush or Moz. Their free tiers show a limited sample.

## How to get better backlinks

- Publish pages that people want to cite, such as original data, useful tools and clear guides
- List your business in relevant, reputable directories
- Share your work where your audience already gathers, and answer questions helpfully
- Avoid buying links or joining link exchanges. Google treats them as spam, and the penalty can cost more than the links ever gained

Backlinks take time. Check your report once a month, and look for slow, steady growth in referring domains rather than a sudden spike.`,
  },
  {
    slug: "how-to-add-faq-schema-markup",
    title: "How to Add FAQ Schema Markup to Your Website",
    excerpt:
      "FAQ schema is simple to add, but Google now shows FAQ rich results only for some sites. Here is how to add it, test it and decide if it's worth it.",
    category: "SEO",
    tags: ["schema markup", "faq schema", "json-ld"],
    publishedAt: "2026-11-18",
    metaTitle: "How to Add FAQ Schema Markup (JSON-LD Example)",
    metaDesc: "Add FAQ schema markup with JSON-LD: a copy-and-paste example, where to put it, how to test it and what Google now shows for FAQ pages.",
    content: `FAQ schema is structured data that tells search engines a page contains a list of questions and answers. It is written as JSON-LD, a small block of code added to the page.

## Important: what Google shows today

In 2023 Google reduced FAQ rich results so that they appear mainly for well-known government and health websites. For most sites, adding FAQ schema will not show expandable questions in search results any more.

It can still be worth adding. The markup is valid, it clearly describes your page content to search engines, and other tools may use it. Just don't expect a visual change in Google results.

## The rules

- Only mark up questions and answers that are **visible on the page**
- Each question should have one complete answer written by you
- Don't use FAQ schema for advertising or for questions people can answer in a forum
- Keep the text in the markup identical to the text on the page

## Example JSON-LD

Replace the questions and answers with your own:

\`\`\`
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does delivery take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Orders are delivered in 3 to 5 working days."
      }
    }
  ]
}
</script>
\`\`\`

## Step by step

1. Write your questions and answers on the page first
2. Create the JSON-LD with the [Zoqonyx schema markup generator](/tools/schema-markup-generator): choose FAQPage, add your questions and copy the code
3. Paste the script into the \`<head>\` of the page, or into your CMS's custom head or schema field
4. Test it with Google's Rich Results Test and fix any errors
5. After the page is live, check the Enhancements section of Search Console for problems

## Other schema types that still help

- **Product** for product pages with price and availability
- **Article** for blog posts
- **LocalBusiness** for a business with an address and opening hours
- **BreadcrumbList** to show the path to a page

These can still produce rich results, so they usually give more benefit than FAQ schema does today.`,
  },
  {
    slug: "how-to-write-an-amazon-product-description",
    title: "How to Write an Amazon Product Description That Sells",
    excerpt:
      "Shoppers scan listings in seconds. Here is how to structure your title, five bullet points and description so they answer the buyer's questions fast.",
    category: "E-commerce",
    tags: ["amazon", "product descriptions", "copywriting"],
    publishedAt: "2026-11-18",
    metaTitle: "How to Write an Amazon Product Description That Sells",
    metaDesc: "Write a better Amazon listing: title, five bullet points and description, with a simple formula and common mistakes to avoid.",
    content: `Most shoppers decide from the title, the main image and the first few bullet points. The rest of the description matters mostly for people who are already interested. Write the top of your listing first, and make it easy to scan.

## Start with the title

A good title says what the product is and the main reasons to buy it:

- The brand and product type
- The most important feature or size
- Who it is for, if that isn't obvious

Follow Amazon's current character limits and style rules for your category, and avoid promotional phrases they don't allow.

## Write five bullet points that answer questions

The bullets are the most read part of the page. Each one should:

1. **Start with the benefit**, then give the detail. "Lasts all day: 40-hour battery" works better than "Battery: 40 hours".
2. **Cover one idea.** One bullet for size and fit, one for materials, one for use cases.
3. **Stay short.** Aim for under 200 characters each, and check Amazon's current limit for your category.
4. **Be specific.** Numbers, sizes and materials build trust.

## Use the description for what bullets can't hold

The description is a place for a short story: who the product is for, what problem it solves and how to use or care for it. Keep paragraphs short. If your listing has Enhanced Brand Content, use it to show the product in use.

## Use the words customers search for

Put the main search term in the title and the first bullet in natural language. Don't repeat the same word again and again; that makes the listing harder to read and doesn't help.

## Common mistakes

- Listing features without saying what they mean for the buyer
- Vague claims such as "high quality" with no detail
- Copying the manufacturer's text, which many other sellers also use
- Claims you can't back up, such as health benefits

## Draft faster

You can enter your product name, features and tone into the [Zoqonyx product description generator](/tools/ai-product-description). It creates three versions (lifestyle, specs and problem-solving) as a starting point. It uses writing templates, not an AI model, so edit the result in your own voice before you publish.`,
  },
  {
    slug: "how-to-merge-pdf-files-without-uploading-them",
    title: "How to Merge PDF Files Without Uploading Them",
    excerpt:
      "Most online PDF tools upload your files to a server. Here is how to combine PDFs in your browser instead, so confidential documents stay on your device.",
    category: "Tools",
    tags: ["pdf", "merge pdf", "privacy"],
    publishedAt: "2026-11-18",
    metaTitle: "How to Merge PDF Files Without Uploading Them",
    metaDesc: "Merge PDF files in your browser so the documents never leave your device: step by step, plus tips for order, size and password-protected files.",
    content: `Many online PDF tools work by uploading your files to a server, merging them there and sending the result back. For a contract, an invoice or an ID document, that is more exposure than you need.

Some tools do the work inside your browser instead. The files are read by your device and the merged file is created locally, so nothing is sent anywhere.

## Merge PDFs in your browser

1. Open the [Zoqonyx Merge PDF tool](/tools/merge-pdf)
2. Add your PDF files by dragging them in or choosing them from your device
3. Put them in the order you want
4. Click merge and download the combined PDF

## Tips for a clean result

- **Name your files in order** (01-cover.pdf, 02-report.pdf) so they load in the right sequence
- **Check page sizes.** Mixing A4 and Letter pages is fine, but the merged file keeps each page's own size
- **Check the page count** of the result against the sum of your files
- **Unlock first.** A password-protected PDF has to be unlocked before it can be merged, and you need to know its password

## What about large files?

Because the work happens on your device, speed depends on your computer and the size of the files. Very large or scanned PDFs may be slow on a phone. If a merge fails, try fewer files at a time.

## Compress the result

Merged files can be large. You can reduce the size with the [Compress PDF tool](/tools/compress-pdf). It rewrites the file structure into a more compact form, which helps most for text-based PDFs. It doesn't re-compress images, so scanned documents may not get much smaller. If the file can't be made smaller you get the original back.

## How to tell if a tool uploads your files

Open your browser's developer tools, go to the Network tab and merge a file. If you see a large upload request when you click merge, the tool sends your file to a server.`,
  },
  {
    slug: "website-maintenance-checklist",
    title: "Website Maintenance Checklist: What to Do Every Month",
    excerpt:
      "A website that isn't looked after slowly breaks. Use this monthly checklist to keep updates, backups, security, speed and SEO under control.",
    category: "Websites",
    tags: ["website maintenance", "security", "backups"],
    publishedAt: "2026-11-18",
    metaTitle: "Website Maintenance Checklist: Monthly Tasks",
    metaDesc: "A monthly website maintenance checklist: updates, backups, security, speed, broken links, forms and SEO checks to keep your site healthy.",
    content: `Websites don't stay finished. Software ages, links break, and a form that quietly stops working can cost you enquiries for weeks before anyone notices. A short monthly routine prevents most problems.

## Every month

### Updates

- Update your CMS (such as WordPress), themes and plugins
- Update framework dependencies if your site is custom-built
- Test the site after updating, ideally on a staging copy first

### Backups

- Confirm automatic backups ran
- **Test a restore** at least a few times a year. A backup you haven't restored may not work.
- Keep a copy somewhere other than the web server

### Security

- Remove unused plugins, themes and user accounts
- Use strong, unique passwords and two-factor login for admin accounts
- Check that your SSL certificate is valid and renews automatically

### Speed

- Run a speed test on your main pages
- Compress new images before uploading them
- Check Core Web Vitals in Google Search Console

## Check what visitors see

- Submit each contact form and make sure the message arrives
- Click through your main pages on a phone
- Look for broken links and missing images
- Check checkout or booking steps if you have them

## SEO checks

- Look at the Pages report in Search Console for pages that aren't indexed and for new errors
- Make sure important pages still have unique titles and descriptions
- Keep your sitemap up to date
- Check that redirects work after any pages were moved

## Content

- Update opening hours, prices, team and contact details
- Refresh or remove outdated posts
- Add something new, such as a post or case study

## Don't have time?

A maintenance plan can cover these tasks for you. See [website maintenance services](/services/website-maintenance-services), or tell us about your site and we'll suggest what it needs.`,
  },
  {
    slug: "native-vs-cross-platform-app-development",
    title: "Native vs Cross-Platform App Development: Which Should You Choose?",
    excerpt:
      "Native apps feel best on each platform; cross-platform apps cost less to build and maintain. Here is how to choose for your project.",
    category: "Apps",
    tags: ["app development", "flutter", "react native", "native apps"],
    publishedAt: "2026-11-18",
    metaTitle: "Native vs Cross-Platform App Development: How to Choose",
    metaDesc: "Native or cross-platform? Compare cost, speed, performance and maintenance for Android and iOS apps, and see which fits your project.",
    content: `If you are planning a mobile app, one of the first decisions is whether to build two native apps, one for Android and one for iOS, or a single cross-platform app that runs on both.

## What each option means

- **Native apps** are written separately for each platform: Kotlin for Android and Swift for iOS.
- **Cross-platform apps** share most of their code between platforms, using frameworks such as Flutter or React Native.

## Comparison

| | Native | Cross-platform |
|---|---|---|
| Codebases | Two | Mostly one |
| Build cost | Higher | Usually lower |
| Time to launch both platforms | Longer | Often shorter |
| Access to new OS features | Immediately | After framework support |
| Heavy graphics and complex device features | Best | Possible, with extra work |
| Maintenance | Two sets of fixes | One main set of fixes |

## When cross-platform is a good choice

- You need Android and iOS and have a limited budget
- The app is mostly screens, forms, lists and API data, like many business, booking and e-commerce apps
- You want to release changes to both platforms at the same time
- You are validating an idea and want to launch quickly

## When native is a better choice

- The app relies on advanced graphics, augmented reality or heavy real-time processing
- You need the newest platform features on day one
- You are building for only one platform
- You want the most platform-specific look and behaviour

## Flutter or React Native?

Flutter draws its own interface, which gives consistent visuals on every device. React Native uses native components and suits teams that already work in JavaScript or React. Both are mature and widely used.

## A practical approach

Start by listing the features your first release needs. If none of them require deep device access or heavy graphics, cross-platform is usually the cheaper and faster way to learn whether the app works. You can still replace a part with native code later if you need it.

Not sure which fits? Read about our [app development services](/services/app-development) or send us your idea and we'll suggest an approach with the reasons.`,
  },
  {
    slug: "backlink-checker-api",
    title: "Backlink Checker API: How to Get Backlink Data Programmatically",
    excerpt:
      "Looking for a backlink checker API? Google's Search Console API doesn't include backlinks. Here are the options that do, what they cost and how to use the data.",
    category: "SEO",
    tags: ["backlink checker api", "seo api", "backlinks"],
    publishedAt: "2026-11-19",
    metaTitle: "Backlink Checker API: Options for Backlink Data",
    metaDesc: "Need a backlink checker API? Google Search Console's API has no links data. See which providers offer backlink APIs and how to audit the results.",
    content: `If you want backlink data inside your own dashboard, report or script, you need an API. The first thing to know is what **doesn't** work: Google's Search Console API gives you search performance data, sitemaps and URL inspection, but it does not include the Links report. You can view and export links in the Search Console website, but not fetch them through the API.

## Where backlink APIs come from

Backlink data comes from web crawlers that continuously visit pages and record the links they find. Building a crawler is expensive, so almost all backlink APIs are paid products from companies that run their own:

- **Ahrefs**: large link index, API access on higher plans
- **Semrush**: backlink analytics through its API, billed with API units
- **Moz**: Link Explorer API with a free tier of limited requests
- **Majestic**: a long-running link index with an API
- **DataForSEO**: pay-as-you-go API that resells backlink data

Check each provider's current pricing and limits before you commit, because plans change.

## What to look for

- **Coverage and freshness.** How many links the index holds and how often it is updated. Different providers show different numbers for the same site, so don't compare totals across tools.
- **Fields returned.** At minimum you want the linking page, the target page, the anchor text and whether the link is follow or nofollow.
- **Rate limits and cost per request.** Pulling a large site's full link list can use a lot of quota.
- **Export options.** Many providers let you export CSV from the dashboard, which is cheaper if you only need data now and then.

## A free route for your own site

For your own website, Search Console's Links report is free. Export **Top linking sites** and the latest links as CSV and keep a dated copy each month. It is a sample rather than the full set, but it comes from Google.

## Audit the data once you have it

An API or export gives you rows; the useful part is what you do with them. Upload the CSV to the [Zoqonyx backlink checker](/tools/backlink-checker) to count backlinks and referring domains, see the most common anchor texts and flag links from low-reputation domains. The file is read in your browser and is not uploaded.

## Building your own integration

If you do build against an API:

1. Store raw responses with a date, so you can compare changes over time
2. Deduplicate by referring domain as well as by URL
3. Respect rate limits and cache results
4. Never expose your API key in front-end code. Call the provider from your server

Need help building an SEO dashboard or data pipeline? See our [custom software development](/services/custom-software-development) services.`,
  },
  {
    slug: "how-to-compress-a-pdf-for-email",
    title: "How to Compress a PDF for Email (and When It Won't Shrink)",
    excerpt:
      "Email attachments often have a size limit. Here is how to make a PDF smaller, why scanned PDFs resist compression and what else you can try.",
    category: "Tools",
    tags: ["compress pdf", "pdf", "email attachments"],
    publishedAt: "2026-11-19",
    metaTitle: "How to Compress a PDF for Email: Practical Guide",
    metaDesc: "Make a PDF small enough to email: compress it in your browser, understand why some PDFs won't shrink, and see other ways to reduce file size.",
    content: `Most email services limit attachments to around 20 to 25 MB, and some company systems set lower limits. If your PDF is too big, there are several ways to make it smaller, and which one works depends on what is inside the file.

## Why PDFs get large

- **Images.** Photos and scanned pages are the biggest cause. A scanned document is just a stack of page images.
- **Embedded fonts.** Many fonts are included in full.
- **Extra data.** Metadata, thumbnails, form fields and editing history add weight.
- **Many merged files.** Combining PDFs can duplicate resources.

## Step 1: Try compressing in your browser

The [Zoqonyx Compress PDF tool](/tools/compress-pdf) rewrites your PDF into a more compact structure and can clear metadata. Everything happens in your browser, so the file isn't uploaded.

It's important to know what it does **not** do: it doesn't re-compress the images inside the PDF. That means:

- Text-based PDFs (reports, contracts exported from Word) often get a little smaller
- Image-heavy and scanned PDFs may barely change
- If the file can't be made smaller, the tool returns the original and shows 0% saved

## Step 2: Reduce the images before they go in the PDF

If you create the PDF yourself, shrink the images first. Use the [Image Compressor](/tools/image-compressor) to compress JPG, PNG or WebP files, then build the PDF with [Image to PDF](/tools/image-to-pdf). A photo that is 4 MB can often be reduced a lot with little visible difference.

## Step 3: Re-export with a lower quality setting

If you have the original document, export it again as PDF from your word processor or design program and choose a "minimum size" or "reduced size" option. This is often the most effective method because the program can resample the images.

## Step 4: Split the file

If you can't make it smaller, send it in parts. The [Split PDF tool](/tools/split-pdf) can extract page ranges into separate files, and you can send them in several emails.

## Step 5: Share a link instead

For very large files, upload the PDF to cloud storage and send a link. The recipient downloads it directly, and there is no attachment limit to worry about.

## Quick guide

| Situation | Best option |
|---|---|
| Text-only PDF slightly over the limit | Compress PDF tool |
| Scanned document | Re-scan at lower resolution, or share a link |
| Photos in a PDF you created | Compress the images first |
| Large report | Split it or share a link |

Whatever you use, keep the original file and check the compressed copy before you send it.`,
  },
  {
    slug: "what-is-a-crm-and-does-your-business-need-one",
    title: "What Is a CRM and Does Your Small Business Need One?",
    excerpt:
      "A CRM keeps track of customers, leads and conversations in one place. Here is what it does, signs you need one and whether to buy or build.",
    category: "Business software",
    tags: ["crm", "sales", "business software"],
    publishedAt: "2026-11-19",
    metaTitle: "What Is a CRM? Does Your Small Business Need One?",
    metaDesc: "What a CRM does, five signs your business needs one, and how to decide between an off-the-shelf CRM and a custom-built system.",
    content: `CRM stands for customer relationship management. A CRM is software that stores information about your customers and leads, such as contact details, conversations and deals, so everyone on your team sees the same up-to-date picture.

## What a CRM does

- **Stores contacts and companies** with their history in one place
- **Tracks leads and deals** through stages from first enquiry to a closed sale
- **Sets reminders and tasks** so follow-ups don't get forgotten
- **Records emails, calls and notes** against each customer
- **Reports on sales** such as how many leads you get, how many convert and where deals stall

## Signs you need a CRM

1. **Customer details live in spreadsheets, inboxes or people's heads.** When someone leaves or is away, the information goes with them.
2. **Leads get lost.** You are not sure who has been followed up, or when.
3. **You can't answer simple questions** such as how many enquiries came last month or which source brings the best customers.
4. **Several people talk to the same customer** and they repeat questions or send mixed messages.
5. **Your sales process has steps** that you want to be done the same way each time.

If you have a handful of customers and one person handling them, a spreadsheet may be enough for now.

## Off-the-shelf or custom?

**Off-the-shelf CRMs** such as HubSpot, Zoho or Pipedrive are quick to start and cheap at small scale. They suit most businesses whose sales process is fairly standard.

**A custom CRM** makes sense when:

- Your process is unusual and you would be fighting the software
- You need it connected closely to your own systems, such as a portal, ordering system or ERP
- Licences for several users and add-ons are adding up
- You want the data and the logic fully under your control

A common approach is to start with an existing CRM and move to a custom system only when its limits start to cost you more than building one.

## How to get the most from a CRM

- Keep the first set of fields small. People stop using forms that ask for too much
- Capture leads automatically from your website form instead of typing them in
- Agree what each pipeline stage means
- Review the pipeline weekly in a short team meeting

## Getting help

We build custom CRMs and extend existing ones, with website lead capture, email integration and reporting. See our [CRM development services](/services/crm-development-services) or [send us your requirements](/services/crm-development-services#contact).`,
  },
  {
    slug: "redesign-a-website-without-losing-seo",
    title: "How to Redesign a Website Without Losing Your SEO",
    excerpt:
      "A redesign can wipe out years of search rankings if URLs, content and redirects aren't handled. Here is a practical checklist to protect your traffic.",
    category: "SEO",
    tags: ["website redesign", "seo migration", "redirects"],
    publishedAt: "2026-11-19",
    metaTitle: "Redesign a Website Without Losing SEO: Checklist",
    metaDesc: "A website redesign checklist to protect your rankings: audit current pages, keep URLs, set 301 redirects, preserve content and monitor after launch.",
    content: `Many businesses see traffic drop after a redesign, and the cause is usually not the new look. Pages were moved without redirects, content was cut, or technical settings from the old site were lost. Plan for search from the start, and a redesign can improve results instead.

## Before you start

### 1. Record how the site performs now

- Export top pages, queries, clicks and impressions from Google Search Console
- Export traffic and conversions from your analytics
- Crawl the current site and save the list of URLs, titles, descriptions and headings

This is your baseline. Without it you can't tell what changed.

### 2. Decide which pages matter

Rank pages by traffic, conversions and links. Pages that bring visitors or links need the most care. Pages with no traffic and no value can be merged or removed on purpose.

## During the redesign

### 3. Keep URLs where you can

The simplest way to protect rankings is not to change a page's address. If the structure must change, plan every new URL deliberately.

### 4. Map every old URL to a new one

For each URL that changes, set a **301 (permanent) redirect** to the closest equivalent new page. Redirect to a relevant page, not just to the home page. Test the whole list before launch.

### 5. Keep what ranks

- Keep the main headings, useful text and key phrases of pages that perform well
- Don't replace detailed text with a few lines and an image
- Keep titles and meta descriptions unless you are improving them on purpose

### 6. Carry over the technical basics

- Canonical tags, meta robots and hreflang if you use them
- Structured data (schema markup)
- XML sitemap and robots.txt
- Image alt text and clean internal links

### 7. Check speed and mobile

A redesign that is heavier and slower can hurt. Test Core Web Vitals on your key page types before launch.

## At launch

- Switch off any "noindex" setting that was used on the test version. This is a common and costly mistake
- Submit the new sitemap in Search Console
- Check that redirects, forms and tracking work
- Keep the old site's files and a backup for a few weeks

## After launch

- Watch Search Console daily in the first weeks: coverage errors, crawl errors and drops in impressions
- Compare traffic with your baseline each week
- Fix broken links and redirect chains
- Expect small fluctuations for a few weeks while search engines process the changes

## Need a redesign?

We plan redesigns around search from the beginning. See our [website development services](/services/website-development-services), or tell us about your site and we'll suggest what to keep, change and redirect.`,
  },
];

import { BLOG_SEEDS_2027 } from "./blog-seed-2027";
BLOG_SEEDS.push(...BLOG_SEEDS_2027);
