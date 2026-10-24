const fs = require('fs');

async function run() {
  const records = { tools: [] };
  const mockPrisma = {
    $disconnect: async () => {},
    user: { findUnique: async () => null, create: async () => {} },
    setting: { upsert: async () => {} },
    page: { upsert: async () => {} },
    tool: { upsert: async ({ create }) => records.tools.push(create) }
  };

  const seedCode = fs.readFileSync('prisma/seed.js', 'utf8')
    .replace(/const { PrismaClient } = require\(["']@prisma\/client["']\);/, '')
    .replace(/const bcrypt = require\(["']bcryptjs["']\);/, '')
    .replace(/const prisma = new PrismaClient\(\);/, '');

  const fn = new Function('prisma', 'bcrypt', seedCode + '\nreturn main();');
  await fn(mockPrisma, { hash: async () => 'mock' });

  const seen = new Set();
  const uniqueTools = [];
  for (const t of records.tools) {
    if (!seen.has(t.slug)) {
      seen.add(t.slug);
      uniqueTools.push(t);
    }
  }

  const tsContent = `// Auto-generated fallback tools catalog for 100% uptime and resilience
export interface DefaultTool {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  isComingSoon: boolean;
  icon: string | null;
  order: number;
  metaTitle?: string | null;
  metaDesc?: string | null;
  content?: string | null;
}

export const DEFAULT_TOOLS: DefaultTool[] = ${JSON.stringify(
    uniqueTools.map((t, idx) => ({
      id: `default-${t.slug}`,
      slug: t.slug,
      name: t.name,
      description: t.description,
      category: t.category,
      isActive: t.isActive,
      isComingSoon: t.isComingSoon,
      icon: t.icon,
      order: t.order || idx + 1,
      metaTitle: t.metaTitle || null,
      metaDesc: t.metaDesc || null,
      content: t.content || null,
    })),
    null,
    2
  )};

export function getDefaultToolBySlug(slug: string): DefaultTool | null {
  return DEFAULT_TOOLS.find((t) => t.slug === slug) || null;
}
`;

  fs.writeFileSync('src/lib/default-tools.ts', tsContent, 'utf8');
  console.log('Successfully generated src/lib/default-tools.ts with', records.tools.length, 'tools');
}

run();
