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
];
