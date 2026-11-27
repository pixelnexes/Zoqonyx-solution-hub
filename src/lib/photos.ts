/* Real photographs in /public/photos (Unsplash License, see CREDITS.txt). Each has descriptive alt text for image search and screen readers. */

export const PHOTOS: Record<string, string> = {
  "u-team": "Developers working on laptops around a wooden table",
  "u-dev": "Two software developers at their desks in a bright office",
  "u-office": "Team meeting around a table in an open office",
  "u-office2": "Three colleagues in a modern office meeting",
  "u-network": "Network cables plugged into a switch in a data room",
  "u-server": "Server rack with green status lights",
  "u-ai": "Circuit-board drawing of a brain representing artificial intelligence",
  "u-aichip": "Glowing AI chip on a circuit board",
  "u-phone": "Smartphone showing an app dashboard",
  "u-app": "Mobile app interface on a phone next to a laptop",
  "u-analytics": "Laptop screen showing website analytics graphs",
  "u-laptop": "Laptop on a glass desk in a workspace",
  "u-game": "Gamer playing a video game with headphones at a monitor",
  "u-web": "Laptop open on a desk showing a website",
  "u-meeting": "Colleague gesturing during a team meeting with a laptop",
  "u-group": "Four people working together on laptops",
  "u-mac": "Person pointing at a MacBook screen",
  "u-wireframe": "Hand-drawn website wireframe on paper",
  "u-ecom": "Person paying online with a card on a laptop",
  "u-shop": "Laptop displaying an online clothing store",
  "u-support": "Customer support agents wearing headsets",
  "u-review": "Three colleagues reviewing work on a MacBook",
  "u-board": "Man writing a plan on a whiteboard",
  "u-standup": "Three men with laptops during a team stand-up",
  "u-collab": "People collaborating in a sunlit office",
};

export function photoSrc(key: string) {
  return `/photos/${key}.webp`;
}

export function photoAlt(keyOrSrc: string) {
  const key = keyOrSrc.replace(/^\/photos\//, "").replace(/\.(jpg|webp)$/, "");
  return PHOTOS[key] || "Zoqonyx team at work";
}

export const GROUP_PHOTO_KEY: Record<string, string> = {
  "Game Development": "u-game",
  "App Development": "u-phone",
  "Website Development": "u-web",
  "Custom Software": "u-dev",
  "Digital Marketing": "u-analytics",
  "AI & NLP Development": "u-ai",
  "NFT Development": "u-network",
  "Staff Augmentation": "u-team",
  "ERP & CRM Development": "u-meeting",
};

export function groupPhotoKey(group: string) {
  return GROUP_PHOTO_KEY[group] || "u-dev";
}

const BLOG_SETS: [RegExp, string[]][] = [
  [/seo|search/i, ["u-analytics", "u-mac", "u-board"]],
  [/tool/i, ["u-laptop", "u-dev", "u-standup"]],
  [/business|erp|crm/i, ["u-meeting", "u-group", "u-office2", "u-review"]],
  [/e-?commerce|shop/i, ["u-ecom", "u-shop"]],
  [/app|mobile/i, ["u-phone", "u-app"]],
  [/web|design/i, ["u-web", "u-wireframe", "u-collab"]],
  [/ai/i, ["u-ai", "u-aichip"]],
];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const COVER_OVERRIDE: Record<string, string> = {
  "earn-money-with-ai-tool-website": "u-laptop",
  "best-business-to-start-in-2027": "u-meeting",
  "ai-business-ideas-for-2027": "u-aichip",
  "how-much-does-it-cost-to-build-an-ai-app": "u-ai",
  "get-leads-with-a-free-tools-website": "u-analytics",
  "seo-in-2027-ai-search-geo-aeo": "u-mac",
  "mobile-app-ideas-for-2027": "u-phone",
  "web3-game-and-nft-business-in-2027": "u-network",
  "ai-in-crm-and-erp-software": "u-office2",
  "hire-dedicated-developers-or-agency": "u-team",
  "how-to-check-backlinks-for-free": "u-analytics",
  "how-to-merge-pdf-files-without-uploading-them": "u-laptop",
  "how-to-compress-a-pdf-for-email": "u-dev",
  "backlink-checker-api": "u-analytics",
  "php-backlink-checker-script": "u-dev",
  "backlink-history-checker": "u-board",
  "how-to-write-an-amazon-product-description": "u-shop",
  "how-to-add-schema-markup": "u-mac",
  "gta-6-launch-lessons-for-game-and-app-launches": "u-game",
  "free-tools-for-gaming-content-creators": "u-laptop",
  "future-of-free-online-tools": "u-aichip",
  "business-growth-plan-for-small-businesses": "u-board",
  "custom-tool-for-your-business": "u-wireframe",
};

/** Picks a photo related to the post's category; the slug keeps the choice stable. */
export function blogPhotoKey(slug: string, category = "") {
  if (COVER_OVERRIDE[slug]) return COVER_OVERRIDE[slug];
  const set = (BLOG_SETS.find(([re]) => re.test(category)) || [null, ["u-dev", "u-office2", "u-board", "u-collab", "u-review", "u-group"]])[1];
  return set[hash(slug) % set.length];
}
