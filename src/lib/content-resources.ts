// Describes each admin-managed resource once: its Prisma delegate, the fields
// the admin form shows, and which fields are stored as-is. Used by both the
// generic admin API and the generic admin UI.

export type FieldType = "text" | "textarea" | "markdown" | "number" | "boolean" | "select" | "datetime";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  help?: string;
  required?: boolean;
}

export interface ResourceDef {
  key: "blog" | "services" | "testimonials" | "leads";
  title: string;
  singular: string;
  model: "blogPost" | "service" | "testimonial" | "lead";
  listColumns: string[];
  orderBy: Record<string, "asc" | "desc">;
  fields: FieldDef[];
  /** Admin can create new rows (leads come from the website form). */
  canCreate: boolean;
}

export const RESOURCES: Record<ResourceDef["key"], ResourceDef> = {
  blog: {
    key: "blog",
    title: "Blog posts",
    singular: "post",
    model: "blogPost",
    listColumns: ["title", "state", "category", "publishedAt", "source"],
    orderBy: { updatedAt: "desc" },
    canCreate: true,
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "URL slug", type: "text", required: true, help: "Lowercase words joined by hyphens, e.g. how-to-compress-a-pdf" },
      { key: "status", label: "Status", type: "select", options: ["draft", "published"] },
      { key: "publishedAt", label: "Publish date", type: "datetime", help: "To schedule: set Status to published and pick a future date. The post goes live on that date." },
      { key: "category", label: "Category", type: "text" },
      { key: "tags", label: "Tags", type: "text", help: "Comma separated" },
      { key: "excerpt", label: "Summary (also the default meta description)", type: "textarea", required: true },
      { key: "content", label: "Content (Markdown)", type: "markdown", required: true, help: "Use ## for headings, - for lists, **bold**, [text](url)." },
      { key: "coverImage", label: "Cover image URL", type: "text" },
      { key: "authorName", label: "Author", type: "text" },
      { key: "metaTitle", label: "SEO title (max 60 characters)", type: "text" },
      { key: "metaDesc", label: "SEO description (max 155 characters)", type: "textarea" },
    ],
  },
  services: {
    key: "services",
    title: "Services",
    singular: "service",
    model: "service",
    listColumns: ["name", "groupName", "isActive", "order", "source"],
    orderBy: { order: "asc" },
    canCreate: true,
    fields: [
      { key: "name", label: "Service name", type: "text", required: true },
      { key: "slug", label: "URL slug", type: "text", required: true, help: "Same slug as a built-in service replaces that page's text." },
      { key: "groupName", label: "Group", type: "text", help: "For example: Game Development" },
      { key: "isActive", label: "Show on the website", type: "boolean" },
      { key: "order", label: "Sort order", type: "number" },
      { key: "shortDesc", label: "Short description", type: "textarea", required: true },
      { key: "content", label: "Page content (Markdown)", type: "markdown", required: true },
      { key: "faqs", label: "FAQs (JSON)", type: "textarea", help: 'A list like [{"question":"…","answer":"…"}]' },
      { key: "metaTitle", label: "SEO title (max 60 characters)", type: "text" },
      { key: "metaDesc", label: "SEO description (max 155 characters)", type: "textarea" },
    ],
  },
  testimonials: {
    key: "testimonials",
    title: "Testimonials",
    singular: "testimonial",
    model: "testimonial",
    listColumns: ["name", "company", "isPublished", "rating"],
    orderBy: { order: "asc" },
    canCreate: true,
    fields: [
      { key: "name", label: "Client name", type: "text", required: true },
      { key: "role", label: "Role", type: "text" },
      { key: "company", label: "Company", type: "text" },
      { key: "quote", label: "What the client said", type: "textarea", required: true, help: "Only add real feedback from real clients, with their permission." },
      { key: "rating", label: "Rating (1-5)", type: "number" },
      { key: "serviceSlug", label: "Related service slug (optional)", type: "text" },
      { key: "isPublished", label: "Show on the website", type: "boolean" },
      { key: "order", label: "Sort order", type: "number" },
    ],
  },
  leads: {
    key: "leads",
    title: "Leads",
    singular: "lead",
    model: "lead",
    listColumns: ["name", "email", "service", "status", "createdAt"],
    orderBy: { createdAt: "desc" },
    canCreate: false,
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "company", label: "Company", type: "text" },
      { key: "service", label: "Service", type: "text" },
      { key: "budget", label: "Budget", type: "text" },
      { key: "message", label: "Message", type: "textarea" },
      { key: "sourcePage", label: "Sent from page", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["new", "contacted", "won", "lost"] },
      { key: "notes", label: "Your notes", type: "textarea" },
      { key: "createdAt", label: "Received", type: "datetime" },
    ],
  },
};

export function isResourceKey(key: string): key is ResourceDef["key"] {
  return key in RESOURCES;
}

/** Converts a posted JSON body into values safe to store for this resource. */
export function cleanBody(def: ResourceDef, body: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  for (const f of def.fields) {
    if (!(f.key in body)) continue;
    const v = body[f.key];
    if (f.type === "boolean") data[f.key] = Boolean(v);
    else if (f.type === "number") data[f.key] = Number.parseInt(String(v ?? 0), 10) || 0;
    else if (f.type === "datetime") data[f.key] = v ? new Date(String(v)) : null;
    else data[f.key] = typeof v === "string" ? v : v == null ? "" : String(v);
  }
  // Leads keep their received time and are not edited except status/notes/etc.
  if (def.key === "leads") delete data.createdAt;
  if (def.key === "blog") {
    if (data.status === "published" && !data.publishedAt) data.publishedAt = new Date();
    if (data.status === "draft" && "publishedAt" in data && !data.publishedAt) data.publishedAt = null;
    if ("coverImage" in data && !data.coverImage) data.coverImage = null;
    if ("metaTitle" in data && !data.metaTitle) data.metaTitle = null;
    if ("metaDesc" in data && !data.metaDesc) data.metaDesc = null;
  }
  if (def.key === "services") {
    if ("metaTitle" in data && !data.metaTitle) data.metaTitle = null;
    if ("metaDesc" in data && !data.metaDesc) data.metaDesc = null;
    if (typeof data.faqs === "string" && data.faqs.trim()) {
      try {
        JSON.parse(data.faqs as string);
      } catch {
        throw new Error("FAQs must be valid JSON, like [{\"question\":\"…\",\"answer\":\"…\"}].");
      }
    }
  }
  if (typeof data.slug === "string") {
    data.slug = (data.slug as string)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!data.slug) throw new Error("The URL slug can't be empty.");
  }
  return data;
}
