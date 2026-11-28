// Page text written for one tool at a time. Every statement here must match what the tool component does.
import type { ToolSeoArticle } from "./tool-seo-content";

type Pair = [string, string];

function article(
  slug: string,
  title: string,
  metaDesc: string,
  steps: Pair[],
  benefits: Pair[],
  proTips: string[],
  faqs: Pair[],
  deepDiveContent: string
): ToolSeoArticle {
  return {
    slug,
    title,
    metaDesc,
    howToSteps: steps.map(([t, instruction], i) => ({ step: i + 1, title: t, instruction })),
    keyBenefits: benefits.map(([t, desc]) => ({ title: t, desc })),
    proTips,
    faqs: faqs.map(([question, answer]) => ({ question, answer })),
    deepDiveContent,
  };
}

const list: ToolSeoArticle[] = [
  article(
    "merge-pdf",
    "Merge PDF Files Free, Without Uploading | Zoqonyx",
    "Combine PDF files into one in your browser. Reorder the files, merge and download. No sign-up, no watermark, and the files stay on your device.",
    [
      ["Add your PDFs", "Drop two or more PDF files into the box, or click to browse."],
      ["Put them in order", "Use the up and down buttons until the list matches the order you want."],
      ["Merge and download", "Press merge. The combined PDF downloads as soon as it is ready."],
    ],
    [
      ["Files stay with you", "Merging runs in your browser, so the documents are not sent to a server."],
      ["Order control", "Move any file up or down before merging."],
      ["No watermark", "The pages are copied as they are, with nothing added on top."],
    ],
    ["Name files with numbers first, such as 01-cover.pdf, so they are easy to check.", "Open the result and scroll through it once before sending it."],
    [
      ["How many PDFs can I merge?", "Up to 100 files, 1 GB combined. Very large sets depend on your device's memory."],
      ["Why does one file fail to merge?", "It is usually password protected or damaged. Remove the password in the program that created it, then try again."],
      ["Does merging reduce quality?", "No. Pages are copied into the new document without being re-rendered."],
    ],
    `### When merging helps

Job applications, tender documents, expense claims and scanned contracts often have to arrive as one file. Merging keeps every page in a fixed order and stops attachments from going missing.

### What carries over

Page content, text and images are copied. Interactive parts such as form fields or bookmarks may not survive in the combined file, so check them if you depend on them.

If the merged file is too large to email, try [Compress PDF](/tools/compress-pdf), or use [Split PDF](/tools/split-pdf) to remove pages you do not need.`
  ),
  article(
    "compress-pdf",
    "Compress PDF Free in Your Browser | Zoqonyx",
    "Reduce PDF size without uploading it. The tool rebuilds the file structure and shows the real saving. Best for PDFs with unused data, not large scans.",
    [
      ["Add your PDFs", "Drop one or more PDF documents into the box."],
      ["Choose a mode", "Keep the document's metadata, or clear title, author and producer for the smallest result."],
      ["Compress and save", "Each file shows its size before and after. Save the ones you want."],
    ],
    [
      ["Honest results", "If rebuilding does not make a file smaller, you get the original back and it shows 0% saved."],
      ["Private", "The file is processed on your device."],
      ["Batch work", "Handle several documents in one go."],
    ],
    ["Scanned PDFs are mostly pictures. To shrink them a lot, rescan at a lower resolution or in greyscale.", "Compress the final version, after merging and editing."],
    [
      ["How much smaller will my PDF get?", "It depends on the file. Documents with leftover objects can shrink noticeably. Files made of high-resolution images usually change very little."],
      ["Does it reduce image quality?", "No. Images are not re-encoded, so what you see stays the same."],
      ["Is my document uploaded?", "No. Compression runs in your browser."],
    ],
    `### How this compression works

The tool copies the pages into a clean new document and saves it with compact object streams. That removes unused data left behind by repeated editing. It does not lower the resolution of pictures.

### If you need a much smaller file

Export again from the original program with a "smaller file size" setting, reduce scan resolution, or send only the needed pages with [Split PDF](/tools/split-pdf). Our guide on [compressing a PDF for email](/blog/how-to-compress-a-pdf-for-email) walks through the options.`
  ),
  article(
    "split-pdf",
    "Split PDF and Extract Pages Free | Zoqonyx",
    "Extract the pages you need from a PDF. Type ranges such as 1-4 or 1, 3, 5 and download a new file. Runs in your browser, no sign-up.",
    [
      ["Choose a PDF", "Select the file. The tool reads how many pages it has."],
      ["Type the pages", "Use ranges and commas, for example 1-3, 5."],
      ["Download", "A new PDF with only those pages is saved to your device."],
    ],
    [
      ["Flexible ranges", "Mix single pages and ranges in one entry."],
      ["Original untouched", "Your source file is not changed."],
      ["Private", "Pages are extracted on your device."],
    ],
    ["Page numbers here are the position in the file, which can differ from numbers printed on the page.", "To reorder pages, extract them in separate files and combine them with Merge PDF."],
    [
      ["Can I split into several files at once?", "Each run creates one file from the pages you list. Run it again for the next group."],
      ["Does it work with protected PDFs?", "No. Remove the password first."],
      ["In what order are pages saved?", "In their original document order."],
    ],
    `### Common uses

Send one chapter of a report, pull a single invoice from a monthly statement, or remove cover pages before uploading a form.

To join the extracted parts with another document, use [Merge PDF](/tools/merge-pdf).`
  ),
  article(
    "image-to-pdf",
    "Image to PDF Converter Free (JPG, PNG, WebP) | Zoqonyx",
    "Turn photos, scans and receipts into one PDF. Choose A4 pages or pages that fit each image. Free and processed in your browser.",
    [
      ["Add images", "Drop JPG, PNG or WebP files in the order you want them."],
      ["Pick a page layout", "A4 with margins for printing, or a page sized to each image."],
      ["Create the PDF", "Convert and download one document."],
    ],
    [
      ["One file from many pictures", "Each image becomes its own page."],
      ["Two layouts", "Printable A4 or exact image size."],
      ["Private", "ID scans and receipts stay on your device."],
    ],
    ["Rotate sideways photos before converting.", "Resize very large photos first to keep the PDF small."],
    [
      ["Which formats can I use?", "JPG and PNG are embedded directly. Other formats your browser can open, such as WebP, are converted to PNG first."],
      ["How many images can I add?", "Up to 100, with a combined size of 1 GB."],
      ["Is the text searchable?", "No. The pages are pictures. Searchable text needs OCR."],
    ],
    `### Choosing the layout

Use A4 when the document will be printed or sent to an office. Use the fit option for screenshots and designs where white margins would look odd.

Need to shrink pictures first? Use the [image compressor](/tools/image-compressor).`
  ),
  article(
    "pdf-to-image",
    "PDF to JPG or PNG Converter Free | Zoqonyx",
    "Save every page of a PDF as a PNG or JPEG image at 72 or 144 DPI. Download pages one by one or as a ZIP. Runs in your browser.",
    [
      ["Add a PDF", "Drop the document into the box."],
      ["Pick format and quality", "PNG keeps sharp edges, JPEG is smaller. Choose standard or high resolution."],
      ["Download", "Save single pages or everything as a ZIP."],
    ],
    [
      ["Every page", "All pages are rendered, in order."],
      ["Two resolutions", "72 DPI for screens, 144 DPI for clearer text."],
      ["Private", "Rendering happens on your device."],
    ],
    ["Use PNG for text and diagrams, JPEG for photo-heavy pages.", "Choose high resolution if small text must stay readable."],
    [
      ["Can I convert only one page?", "Convert the file and download just that page, or extract it first with Split PDF."],
      ["Why is a large PDF slow?", "Each page is drawn on your own device, so long documents take longer."],
      ["Are transparent areas kept?", "Pages are drawn on a white background."],
    ],
    `### When an image is handier than a PDF

Slides, social posts and chat apps often accept pictures but not documents. Converting a page makes it easy to preview anywhere.

To go the other way, use [Image to PDF](/tools/image-to-pdf).`
  ),
  article(
    "invoice-generator",
    "Simple Free Invoice Generator (Print to PDF) | Zoqonyx",
    "Make a quick invoice: client name, line items, quantity and rate with 10% tax calculated for you. Print it or save it as a PDF. No sign-up.",
    [
      ["Enter the client", "Type the client's name."],
      ["Add line items", "Describe each item with quantity and rate. Add or remove lines as needed."],
      ["Print or save", "Use Print / Save PDF and pick your printer or the PDF option."],
    ],
    [
      ["Automatic totals", "Subtotal, tax and total update as you type."],
      ["No account", "Open the page and start."],
      ["Print ready", "Your browser creates the PDF."],
    ],
    ["Check the tax rule for your country. This tool applies a fixed 10%.", "Keep a saved PDF of every invoice for your records."],
    [
      ["Can I change the tax rate or add a logo?", "Not in this simple version. Ask for it on the free tool request page."],
      ["Is my invoice saved?", "No. Save the PDF before closing the page."],
      ["Which currency is used?", "Amounts are shown with a dollar sign."],
    ],
    `### What a clear invoice contains

Your business name and contact details, the client, an invoice number, the date, the items, the total and how to pay. Add anything the template does not show before you send it.

If you invoice often, a system that stores clients and numbering saves time. We build [ERP and CRM software](/services/erp-crm-development), or you can [request a tool feature](/request-tool).`
  ),
  article(
    "text-to-speech",
    "Free Text to Speech Online (Play Aloud) | Zoqonyx",
    "Paste text and hear it read aloud with your browser's voice. Change speed and pitch. Free, no sign-up.",
    [
      ["Paste your text", "Type or paste what you want to hear."],
      ["Set speed and pitch", "Use the sliders."],
      ["Press play", "Your browser reads the text. Press stop at any time."],
    ],
    [
      ["Built-in voice", "Uses the speech engine of your browser and operating system."],
      ["Proofreading help", "Hearing a draft makes missing words easier to notice."],
      ["No account", "Start straight away."],
    ],
    ["Add commas and full stops to get natural pauses.", "If it sounds odd, try another browser, because voices differ."],
    [
      ["Can I download the audio?", "No. This tool plays speech but does not create an audio file."],
      ["Why does the voice differ on my phone?", "Each device ships its own voices."],
      ["What if nothing plays?", "Check the volume, then try a current version of Chrome, Edge or Safari."],
    ],
    `### Where read aloud is useful

Checking an email before sending, listening to notes while doing something else, or making a page easier for someone who reads with difficulty.

Count words and reading time with the [word counter](/tools/word-counter).`
  ),
  article(
    "base64-encode-decode",
    "Base64 Encode and Decode Online (UTF-8) | Zoqonyx",
    "Encode text to Base64 or decode it back, including accented letters and emoji. Results update as you type, in your browser.",
    [
      ["Choose a mode", "Encode text to Base64, or decode a Base64 string."],
      ["Paste your input", "The result appears immediately."],
      ["Copy", "Use the copy button for the output."],
    ],
    [
      ["Unicode safe", "Text is treated as UTF-8, so non-English characters survive."],
      ["Clear errors", "Invalid Base64 shows a message instead of garbage."],
      ["Local", "What you paste is not sent anywhere."],
    ],
    ["Base64 is not encryption. Anyone can decode it.", "Remove spaces or line breaks if a pasted string will not decode."],
    [
      ["Why is the output longer than the input?", "Base64 uses four characters for every three bytes, so it grows by about a third."],
      ["Can I encode an image?", "Use the image to Base64 tool for files."],
      ["Is it safe for passwords?", "It does not protect them. Never treat Base64 as security."],
    ],
    `### What Base64 is for

It turns data into plain letters and digits so it can travel through systems that expect text: email attachments, data URLs in HTML and CSS, and tokens in web applications.

For files, use [image to Base64](/tools/image-to-base64).`
  ),
  article(
    "meta-tags-generator",
    "Free Meta Tags Generator (SEO and Open Graph) | Zoqonyx",
    "Create title, description, Open Graph and Twitter card tags from four fields. Copy the HTML into your page head.",
    [
      ["Fill the fields", "Page title, description, canonical URL and social image URL."],
      ["Check the code", "The tags update as you type."],
      ["Copy and paste", "Put them inside the head element of your page."],
    ],
    [
      ["One set for search and social", "Search, Facebook and X tags together."],
      ["No typing mistakes", "Property names are written for you."],
      ["Instant", "Nothing to submit."],
    ],
    ["Aim for a title under about 60 characters and a description under about 155.", "Use a 1200 x 630 image for link previews."],
    [
      ["Do meta tags improve ranking?", "The title matters. The description mainly affects how often people click. Neither replaces useful content."],
      ["Why does Google show a different description?", "Google may pick text from the page when it matches the search better."],
      ["Where do the tags go?", "Between <head> and </head>."],
    ],
    `### Writing tags people click

Say what the page offers, put the main words near the start, and give every page its own title and description.

Add structured data with the [schema markup generator](/tools/schema-markup-generator). If you want this done across a whole site, see our [digital marketing services](/services/digital-marketing-services).`
  ),
  article(
    "robots-txt-generator",
    "Free robots.txt Generator | Zoqonyx",
    "Build a robots.txt file with allow or block rules, disallowed paths and your sitemap address. Copy it to your site root.",
    [
      ["Choose the default", "Allow all crawlers, or block the whole site."],
      ["List blocked paths", "One path per line, such as /admin/."],
      ["Add your sitemap and copy", "Save the text as robots.txt in the root of your domain."],
    ],
    [
      ["Correct format", "Directives are written in the usual order."],
      ["Sitemap line", "Helps crawlers find your URL list."],
      ["Quick check", "See the whole file before you publish it."],
    ],
    ["Blocking the whole site removes it from search crawling. Use it only for staging sites.", "robots.txt is public, so never list secret addresses in it."],
    [
      ["Does robots.txt hide a page from Google?", "No. It stops crawling. A blocked address can still be indexed if others link to it. Use noindex or a password to keep pages out."],
      ["Where must the file be?", "At https://yourdomain.com/robots.txt."],
      ["Do all bots obey it?", "Well-behaved crawlers do. It is not a security control."],
    ],
    `### A sensible starting point

Allow everything, block admin and internal search result pages, and add the sitemap line. After publishing, open the address in a browser and check Search Console for crawl errors.

Create the sitemap with the [XML sitemap generator](/tools/xml-sitemap-generator).`
  ),
  article(
    "xml-sitemap-generator",
    "Free XML Sitemap Generator From a URL List | Zoqonyx",
    "Paste your URLs, set change frequency and priority, and download a valid sitemap.xml. Free and instant.",
    [
      ["Paste URLs", "One full address per line."],
      ["Set options", "Choose change frequency and priority."],
      ["Generate and download", "Upload sitemap.xml to your site and submit it in Search Console."],
    ],
    [
      ["Standard format", "Uses the sitemaps.org structure."],
      ["Download or copy", "Take the file or just the text."],
      ["No crawl needed", "You decide exactly which pages are listed."],
    ],
    ["List only pages that load successfully and that you want indexed.", "Google ignores priority and change frequency, so do not spend time tuning them."],
    [
      ["Does the tool find my pages automatically?", "No. You paste the list."],
      ["What is the limit for one sitemap?", "50,000 URLs or 50 MB uncompressed. Split larger sites."],
      ["Will a sitemap get my pages indexed?", "It helps search engines discover them. Indexing is still their decision."],
    ],
    `### After you download it

Place the file at your domain root, add its address to robots.txt, and submit it in Google Search Console and Bing Webmaster Tools. Today's date is written as the last-modified date, so regenerate only when pages actually change.`
  ),
  article(
    "utm-builder",
    "Free UTM Builder for Campaign Links | Zoqonyx",
    "Add utm_source, utm_medium, utm_campaign and utm_content to any link and copy it. See which posts and ads bring visitors.",
    [
      ["Paste the destination", "The page you want people to open."],
      ["Name the campaign", "Source, medium, campaign and optional content."],
      ["Copy the link", "Use it in your post, email or advert."],
    ],
    [
      ["Clean links", "Parameters are encoded correctly."],
      ["Keeps existing parameters", "Your address is extended, not replaced."],
      ["Works with any analytics", "UTM tags are widely supported."],
    ],
    ["Use lowercase names every time, or analytics counts them separately.", "Do not add UTM tags to links between pages of your own site."],
    [
      ["Which fields do I need?", "Source, medium and campaign are the useful minimum."],
      ["Do UTM links affect SEO?", "Not when your pages have a canonical address."],
      ["Where do I see the results?", "In your analytics tool's traffic or campaign reports."],
    ],
    `### A naming habit that pays off

Keep a short list of allowed values, such as newsletter, linkedin and cpc. Consistent names turn reports into answers about which channel brings enquiries.

We can set up tracking and campaigns through our [digital marketing services](/services/digital-marketing-services).`
  ),
  article(
    "word-counter",
    "Free Word Counter and Character Counter | Zoqonyx",
    "Count words, characters, sentences, paragraphs and reading time as you type. Free and private.",
    [
      ["Paste text", "Type or paste into the box."],
      ["Read the counts", "They update immediately."],
      ["Edit to length", "Trim until you reach your limit."],
    ],
    [
      ["Six measures", "Words, characters, characters without spaces, sentences, paragraphs and reading time."],
      ["Live", "No button to press."],
      ["Private", "Your text stays in the browser."],
    ],
    ["Check the platform's own limit, because some count emoji as two characters.", "Read the text aloud once if it is for a speech."],
    [
      ["How is reading time calculated?", "At 200 words per minute, rounded up."],
      ["How are sentences counted?", "By full stops, question marks and exclamation marks, so abbreviations can raise the count."],
      ["Is there a text limit?", "Normal documents work easily. Extremely large text depends on your device."],
    ],
    `### Handy targets

Page titles of about 60 characters and meta descriptions of about 155 usually display in full. Articles should be as long as the question needs.

Change letter case with the [case converter](/tools/case-converter).`
  ),
  article(
    "password-generator",
    "Strong Password and Passphrase Generator | Zoqonyx",
    "Create random passwords or word passphrases in your browser using the secure random generator. Bulk export to TXT or CSV.",
    [
      ["Pick a style", "Random characters or a passphrase of words."],
      ["Set the options", "Length, character types, or word count and separator."],
      ["Copy", "Copy a password, or generate several and download them."],
    ],
    [
      ["Secure randomness", "Uses the browser's cryptographic random generator."],
      ["Passphrases", "Easier to type and remember."],
      ["Created locally", "Passwords are not sent to a server."],
    ],
    ["Use a different password for every account and keep them in a password manager.", "Turn on two-step sign-in wherever it is offered."],
    [
      ["How long should a password be?", "Sixteen characters or more is a good habit for random passwords."],
      ["Are generated passwords stored by Zoqonyx?", "No."],
      ["Why exclude similar characters?", "It avoids mistakes between characters such as l, 1 and O, 0 when typing by hand."],
    ],
    `### Length beats complexity tricks

A long random password or several unrelated words is harder to guess than a short word with symbols swapped in. Downloaded lists are plain text files, so delete them after importing them into your password manager.`
  ),
  article(
    "age-calculator",
    "Age Calculator: Years, Months and Days | Zoqonyx",
    "Enter a date of birth to see your exact age today in years, months and days. Free, private and instant.",
    [
      ["Pick the date of birth", "Use the date field."],
      ["Read the age", "Years, months and days are shown."],
    ],
    [
      ["Calendar accurate", "Month lengths and leap years are taken into account."],
      ["Instant", "No button needed."],
      ["Private", "The date stays on your device."],
    ],
    ["Application forms sometimes ask for age on a particular date. This tool calculates age as of today."],
    [
      ["Can I calculate age on another date?", "Not yet. Ask for it on the tool request page."],
      ["How are leap day birthdays handled?", "Dates are compared on the calendar, so the result follows actual days."],
      ["Is my birth date saved?", "No."],
    ],
    `### How the result is worked out

The calculator subtracts the birth year, month and day from today's date and borrows from the previous month when needed, the same way you would on paper.`
  ),
  article(
    "bmi-calculator",
    "BMI Calculator (Metric) With Categories | Zoqonyx",
    "Calculate body mass index from height in centimetres and weight in kilograms, with the standard adult category.",
    [
      ["Enter height", "In centimetres."],
      ["Enter weight", "In kilograms."],
      ["Read your BMI", "The value and category update as you type."],
    ],
    [
      ["Standard formula", "Weight divided by height in metres squared."],
      ["Adult categories", "Underweight, normal weight, overweight and obesity."],
      ["Private", "Your numbers stay on your device."],
    ],
    ["To convert units, 1 inch is 2.54 cm and 1 pound is about 0.4536 kg.", "Treat BMI as a screening number, not a diagnosis."],
    [
      ["What are the categories?", "Below 18.5 underweight, 18.5 to 24.9 normal, 25 to 29.9 overweight, 30 and above obesity."],
      ["Is BMI right for everyone?", "No. It can mislead for athletes, older people, pregnancy and children."],
      ["Should I act on the result?", "Talk to a doctor or dietitian before making health decisions."],
    ],
    `### What BMI can and cannot tell you

BMI compares weight with height. It does not measure body fat, muscle or fitness. A health professional can put the number in context with other checks.`
  ),
  article(
    "percentage-calculator",
    "Percentage Calculator Online | Zoqonyx",
    "Find what X percent of a number is, and what percent one number is of another. Instant and free.",
    [
      ["Enter two numbers", "For example 15 and 200."],
      ["Read both answers", "15% of 200, and what percent 15 is of 200."],
    ],
    [
      ["Two questions at once", "Both common percentage results appear together."],
      ["Two decimals", "Results are rounded for easy reading."],
      ["Instant", "No button needed."],
    ],
    ["For a discount, work out the percentage of the price, then subtract it.", "For percentage change, divide the difference by the old value and multiply by 100."],
    [
      ["How do I find 20% of 80?", "Enter 20 and 80. The answer is 16."],
      ["What percent is 30 of 120?", "Enter 30 and 120. The answer is 25%."],
      ["Can the second number be zero?", "A percentage of zero has no meaning, so that result shows 0."],
    ],
    `### The two formulas

X percent of Y is X ÷ 100 × Y. What percent X is of Y is X ÷ Y × 100. Shop discounts, exam scores and budget shares use one of these two.`
  ),
  article(
    "css-gradient-generator",
    "CSS Gradient Generator (Linear, Radial, Conic) | Zoqonyx",
    "Design linear, radial and conic CSS gradients with color stops, angles and presets, then copy the code.",
    [
      ["Choose a type", "Linear, radial or conic."],
      ["Set colors and angle", "Adjust the stops, or start from a preset."],
      ["Copy the CSS", "Paste it into your stylesheet."],
    ],
    [
      ["Three gradient types", "Covers backgrounds, glows and dials."],
      ["Live preview", "See changes immediately."],
      ["Ready code", "No manual syntax."],
    ],
    ["Check text contrast on both ends of the gradient.", "Two close colors usually look calmer than three strong ones."],
    [
      ["Do gradients work in all browsers?", "Linear and radial gradients are supported everywhere in current browsers. Conic gradients need a reasonably recent version."],
      ["Is a CSS gradient better than an image?", "It is usually smaller and stays sharp at any size."],
      ["How do I add a fallback?", "Declare a solid background color before the gradient."],
    ],
    `### Using gradients well

Keep the strongest color away from body text and test on a phone. For custom interface design, see our [front-end development](/services/front-end-development) service.`
  ),
  article(
    "box-shadow-generator",
    "CSS Box Shadow Generator With Presets | Zoqonyx",
    "Create CSS box shadows with offset, blur, spread, opacity and inset. Preview and copy the code.",
    [
      ["Start from a preset", "Or begin with the sliders."],
      ["Tune the shadow", "Offset, blur, spread, opacity and inset."],
      ["Copy the CSS", "Paste it into your project."],
    ],
    [
      ["Visual control", "See the effect while you adjust it."],
      ["Layered presets", "Smoother results than a single heavy shadow."],
      ["Ready code", "Correct box-shadow syntax."],
    ],
    ["Soft, low-opacity shadows look more natural than dark ones.", "Use one shadow style per level of your interface."],
    [
      ["What does spread do?", "It grows or shrinks the shadow before blurring."],
      ["What is an inset shadow?", "A shadow drawn inside the element, useful for pressed states."],
      ["Do shadows slow a page?", "A few are fine. Animating large blurred shadows can be costly."],
    ],
    `### Choosing depth

Shadows signal which element sits above another. Give cards a small shadow and dialogs a larger one, and keep the light direction the same everywhere.`
  ),
  article(
    "image-cropper",
    "Crop Image Online Free (1:1, 16:9, 4:3) | Zoqonyx",
    "Crop a photo by size and position with 1:1, 16:9 and 4:3 presets, preview it and save a PNG. Runs in your browser.",
    [
      ["Add an image", "Drop a photo into the box."],
      ["Set the crop", "Pick a ratio and adjust width, height and start position."],
      ["Download", "Check the preview and save the result."],
    ],
    [
      ["Common ratios", "Square, widescreen and 4:3, or free size."],
      ["Exact pixels", "Type the numbers you need."],
      ["Private", "The photo is not uploaded."],
    ],
    ["Use 1:1 for profile pictures and 16:9 for video thumbnails.", "Crop first, then resize and compress."],
    [
      ["Can I drag the crop box?", "This version uses number fields for position and size."],
      ["Which format is saved?", "PNG."],
      ["Does cropping lower quality?", "No. The kept pixels are copied as they are."],
    ],
    `### A simple order of work

Crop to the shape you need, set the final dimensions with the [image resizer](/tools/image-resizer), then reduce the file with the [image compressor](/tools/image-compressor).`
  ),
  article(
    "background-remover",
    "Remove a Plain Image Background Free | Zoqonyx",
    "Make a plain, one-color background transparent and download PNGs. Adjust tolerance and edge smoothing. Runs in your browser.",
    [
      ["Add images", "Use pictures with an even background."],
      ["Adjust tolerance", "Raise it to remove more shades, lower it if the subject disappears."],
      ["Download", "Save single PNG files or a ZIP."],
    ],
    [
      ["Color-based removal", "Fast on studio, white or green backgrounds."],
      ["Edge smoothing", "Softens jagged outlines."],
      ["Private and batched", "Up to 100 images on your own device."],
    ],
    ["A background that contrasts with the subject gives the cleanest edge.", "Shoot against a plain wall with even light."],
    [
      ["Does it use AI to find people?", "No. It removes pixels close to the background color, so busy backgrounds do not work well."],
      ["Why did part of my subject vanish?", "That area is a similar color to the background. Lower the tolerance."],
      ["What file do I get?", "A PNG with transparency."],
    ],
    `### Best subjects

Product photos on white, logos on a flat color and portraits against a single backdrop work well. Complex scenes need a segmentation model. If your business needs that at volume, see [AI development](/services/ai-nlp-development).`
  ),
  article(
    "passport-photo-maker",
    "Passport Photo Maker: 4x6 Print Sheet | Zoqonyx",
    "Make a 6x4 inch sheet of six passport photos at true print size: US 2x2 in or UK and Schengen 35x45 mm. Check your authority's rules.",
    [
      ["Upload a portrait", "Face centred, plain light background."],
      ["Choose the size", "US, UK or Schengen."],
      ["Generate and print", "Download the sheet and print it at 100% on 6x4 inch photo paper."],
    ],
    [
      ["True print size", "Built at 300 DPI for 2x2 inch or 35x45 mm photos."],
      ["No stretching", "The picture is centre-cropped to the photo shape."],
      ["Private", "Your face photo stays on your device."],
    ],
    ["Frame the head with some space above, centred in the picture, before uploading.", "In the print dialog, turn off fit to page."],
    [
      ["Will my photo be accepted?", "The tool sets the size only. Head height, background, expression and lighting rules differ, so check the official requirements."],
      ["Does it remove the background?", "No. Take the photo against a plain light background."],
      ["Which paper should I use?", "6x4 inch (15x10 cm) photo paper."],
    ],
    `### Before you print

Measure one printed photo with a ruler. If it is not the expected size, the printer scaled the page. Reprint at actual size.`
  ),
  article(
    "bulk-image-resizer",
    "Bulk Image Resizer by Percentage (ZIP) | Zoqonyx",
    "Resize up to 100 images at once by percentage and download them as a ZIP. Processed in your browser.",
    [
      ["Add images", "Drop up to 100 files."],
      ["Choose the scale", "Set the percentage of the original size."],
      ["Resize and download", "Get a ZIP with the new files."],
    ],
    [
      ["Whole folders", "One setting for every picture."],
      ["Proportions kept", "Width and height scale together."],
      ["Private", "Images are not uploaded."],
    ],
    ["Output is PNG, which can be larger than a JPEG original. Compress afterwards if size matters.", "Keep your originals."],
    [
      ["Can I set exact pixel sizes?", "This batch tool scales by percentage. Use the single image resizer for exact dimensions."],
      ["What is in the file names?", "The original name plus the new width and height."],
      ["What limits apply?", "100 images and 1 GB combined, subject to your device's memory."],
    ],
    `### When to scale by percentage

It suits sets of photos from the same camera, where 50% halves both sides and leaves a quarter of the pixels. Follow with the [bulk image compressor](/tools/bulk-image-compressor).`
  ),
  article(
    "case-converter",
    "Case Converter: Title, Sentence, camelCase | Zoqonyx",
    "Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case and kebab-case.",
    [
      ["Paste text", "Type or paste into the box."],
      ["Find the style", "All eight versions are shown together."],
      ["Copy", "Copy the one you need."],
    ],
    [
      ["Writing and code styles", "Headline cases and programming cases in one place."],
      ["Instant", "Results update as you type."],
      ["Private", "Text stays in your browser."],
    ],
    ["Title Case here capitalises every word, so adjust small words if your style guide asks.", "Check names and acronyms after Sentence case."],
    [
      ["What is kebab-case?", "Lowercase words joined with hyphens, common in web addresses."],
      ["What is the difference between camelCase and PascalCase?", "PascalCase starts with a capital letter, camelCase does not."],
      ["Does it fix spelling?", "No. It changes letter case and separators only."],
    ],
    `### Where each style is used

Headlines use title or sentence case. JavaScript variables usually use camelCase, class names PascalCase, database columns snake_case and URLs kebab-case.`
  ),
];

export const UNIQUE_ARTICLES: Record<string, ToolSeoArticle> = Object.fromEntries(list.map((a) => [a.slug, a]));
