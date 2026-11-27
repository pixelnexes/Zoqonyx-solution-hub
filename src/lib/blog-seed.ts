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

![Person pointing at a MacBook screen](/photos/u-mac.webp)

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

![Three colleagues reviewing work on a MacBook](/photos/u-review.webp)

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

![Team meeting around a table in an open office](/photos/u-office.webp)

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

![Two software developers at their desks in a bright office](/photos/u-dev.webp)

## What about large files?

Because the work happens on your device, speed depends on your computer and the size of the files. Very large or scanned PDFs may be slow on a phone. If a merge fails, try fewer files at a time.

## Compress the result

Merged files can be large. You can reduce the size with the [Compress PDF tool](/tools/compress-pdf). It rewrites the file structure into a more compact form, which helps most for text-based PDFs. It doesn't re-compress images, so scanned documents may not get much smaller. If the file can't be made smaller you get the original back.

## How to tell if a tool uploads your files

Open your browser's developer tools, go to the Network tab and merge a file. If you see a large upload request when you click merge, the tool sends your file to a server.`,
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

![Laptop on a glass desk in a workspace](/photos/u-laptop.webp)

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

![Three colleagues in a modern office meeting](/photos/u-office2.webp)

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
];

import { BLOG_SEEDS_2027 } from "./blog-seed-2027";
BLOG_SEEDS.push(...BLOG_SEEDS_2027);
import { BLOG_SEEDS_FUTURE } from "./blog-seed-future";
BLOG_SEEDS.push(...BLOG_SEEDS_FUTURE);
