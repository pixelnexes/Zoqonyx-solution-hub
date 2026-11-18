export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceStep {
  title: string;
  text: string;
}

/** Built-in service page. The page text is generated from these fields. */
export interface ServiceSeed {
  slug: string;
  name: string;
  /** Group name, e.g. "Game Development". Group hub pages use their own name. */
  group: string;
  /** Hub pages list their child services. */
  isHub?: boolean;
  shortDesc: string;
  metaTitle: string; // max 60 characters
  metaDesc: string; // max 155 characters
  intro: string[];
  includes: string[];
  tech: string[];
  process: ServiceStep[];
  faqs: ServiceFaq[];
  /** Slugs of related services. */
  related?: string[];
}
