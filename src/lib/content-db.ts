import { prisma } from "@/lib/prisma";

// Creates the content tables if they don't exist yet, so the admin works right
// after a deploy without running `prisma db push` by hand. The statements match
// the models in prisma/schema.prisma (MySQL). Running `prisma db push` is still
// the official way and is safe: it leaves existing tables alone.

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS \`BlogPost\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`slug\` VARCHAR(191) NOT NULL,
    \`title\` VARCHAR(191) NOT NULL,
    \`excerpt\` TEXT NOT NULL,
    \`content\` LONGTEXT NOT NULL,
    \`category\` VARCHAR(191) NOT NULL DEFAULT 'General',
    \`tags\` VARCHAR(191) NOT NULL DEFAULT '',
    \`coverImage\` VARCHAR(191) NULL,
    \`authorName\` VARCHAR(191) NOT NULL DEFAULT 'Zoqonyx Team',
    \`metaTitle\` VARCHAR(191) NULL,
    \`metaDesc\` VARCHAR(191) NULL,
    \`status\` VARCHAR(191) NOT NULL DEFAULT 'draft',
    \`publishedAt\` DATETIME(3) NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    UNIQUE INDEX \`BlogPost_slug_key\`(\`slug\`),
    PRIMARY KEY (\`id\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`Service\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`slug\` VARCHAR(191) NOT NULL,
    \`name\` VARCHAR(191) NOT NULL,
    \`groupName\` VARCHAR(191) NOT NULL DEFAULT '',
    \`shortDesc\` TEXT NOT NULL,
    \`content\` LONGTEXT NOT NULL,
    \`faqs\` TEXT NOT NULL,
    \`metaTitle\` VARCHAR(191) NULL,
    \`metaDesc\` VARCHAR(191) NULL,
    \`isActive\` BOOLEAN NOT NULL DEFAULT true,
    \`order\` INTEGER NOT NULL DEFAULT 0,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    UNIQUE INDEX \`Service_slug_key\`(\`slug\`),
    PRIMARY KEY (\`id\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`Testimonial\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`name\` VARCHAR(191) NOT NULL,
    \`role\` VARCHAR(191) NOT NULL DEFAULT '',
    \`company\` VARCHAR(191) NOT NULL DEFAULT '',
    \`quote\` TEXT NOT NULL,
    \`rating\` INTEGER NOT NULL DEFAULT 5,
    \`serviceSlug\` VARCHAR(191) NOT NULL DEFAULT '',
    \`isPublished\` BOOLEAN NOT NULL DEFAULT false,
    \`order\` INTEGER NOT NULL DEFAULT 0,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    PRIMARY KEY (\`id\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`Lead\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`name\` VARCHAR(191) NOT NULL,
    \`email\` VARCHAR(191) NOT NULL,
    \`phone\` VARCHAR(191) NOT NULL DEFAULT '',
    \`company\` VARCHAR(191) NOT NULL DEFAULT '',
    \`service\` VARCHAR(191) NOT NULL DEFAULT '',
    \`budget\` VARCHAR(191) NOT NULL DEFAULT '',
    \`message\` TEXT NOT NULL,
    \`sourcePage\` VARCHAR(191) NOT NULL DEFAULT '',
    \`status\` VARCHAR(191) NOT NULL DEFAULT 'new',
    \`notes\` TEXT NOT NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    PRIMARY KEY (\`id\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
];

let ready: Promise<void> | null = null;

export function ensureContentTables(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      for (const sql of STATEMENTS) {
        await prisma.$executeRawUnsafe(sql);
      }
    })().catch((err) => {
      ready = null; // try again on the next request
      throw err;
    });
  }
  return ready;
}
