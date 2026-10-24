const fs = require('fs');
const bcrypt = require('bcryptjs');

async function run() {
  const hashedPassword = await bcrypt.hash('AdminPassword2026!', 10);
  
  function esc(str) {
    if (str === null || str === undefined) return 'NULL';
    if (typeof str === 'boolean') return str ? '1' : '0';
    if (typeof str === 'number') return str;
    return "'" + String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r') + "'";
  }

  let sql = `-- ZOQONYX Solution Hub Database Schema & Initial Data
-- Target: MySQL 5.7+ / 8.0+ / MariaDB (Hostinger)
-- Generated for direct phpMyAdmin Import

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS \`User\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`username\` VARCHAR(191) NOT NULL,
    \`password\` VARCHAR(191) NOT NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX \`User_username_key\`(\`username\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`Tool\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`slug\` VARCHAR(191) NOT NULL,
    \`name\` VARCHAR(191) NOT NULL,
    \`description\` VARCHAR(191) NOT NULL,
    \`category\` VARCHAR(191) NOT NULL,
    \`isActive\` BOOLEAN NOT NULL DEFAULT true,
    \`isComingSoon\` BOOLEAN NOT NULL DEFAULT false,
    \`icon\` VARCHAR(191) NULL,
    \`order\` INTEGER NOT NULL DEFAULT 0,
    \`metaTitle\` VARCHAR(191) NULL,
    \`metaDesc\` VARCHAR(191) NULL,
    \`content\` TEXT NULL,
    \`usageCount\` INTEGER NOT NULL DEFAULT 0,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE INDEX \`Tool_slug_key\`(\`slug\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`Setting\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`key\` VARCHAR(191) NOT NULL,
    \`value\` TEXT NOT NULL,
    UNIQUE INDEX \`Setting_key_key\`(\`key\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`Page\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`slug\` VARCHAR(191) NOT NULL,
    \`title\` VARCHAR(191) NOT NULL,
    \`content\` TEXT NOT NULL,
    \`metaTitle\` VARCHAR(191) NULL,
    \`metaDesc\` VARCHAR(191) NULL,
    UNIQUE INDEX \`Page_slug_key\`(\`slug\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`ContactMessage\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`name\` VARCHAR(191) NOT NULL,
    \`email\` VARCHAR(191) NOT NULL,
    \`message\` TEXT NOT NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS \`NotificationSubscriber\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`email\` VARCHAR(191) NOT NULL,
    \`toolSlug\` VARCHAR(191) NOT NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX \`NotificationSubscriber_email_toolSlug_key\`(\`email\`, \`toolSlug\`),
    PRIMARY KEY (\`id\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 1. Insert Default Admin (admin / AdminPassword2026!)
INSERT INTO \`User\` (\`id\`, \`username\`, \`password\`, \`createdAt\`)
VALUES ('admin_user_001', 'admin', ${esc(hashedPassword)}, NOW(3))
ON DUPLICATE KEY UPDATE \`password\` = VALUES(\`password\`);

`;

  // Read data from seed.js
  const records = { settings: [], pages: [], tools: [] };
  const mockPrisma = {
    $disconnect: async () => {},
    user: { findUnique: async () => null, create: async () => {} },
    setting: { upsert: async ({ create }) => records.settings.push(create) },
    page: { upsert: async ({ create }) => records.pages.push(create) },
    tool: { upsert: async ({ create }) => records.tools.push(create) }
  };

  const seedCode = fs.readFileSync('prisma/seed.js', 'utf8');
  // strip out existing require and prisma instantiation so we can pass mock
  const wrapped = `
    const bcrypt = arguments[0];
    const prisma = arguments[1];
    ${seedCode.replace(/const { PrismaClient }[^;]+;/, '').replace(/const bcrypt =[^;]+;/, '').replace(/const prisma =[^;]+;/, '')}
    return main();
  `;
  const fn = new Function(wrapped);
  await fn(bcrypt, mockPrisma);

  // Settings
  sql += '-- 2. Insert Default Settings\n';
  for (let i = 0; i < records.settings.length; i++) {
    const s = records.settings[i];
    sql += `INSERT INTO \`Setting\` (\`id\`, \`key\`, \`value\`) VALUES ('setting_${i+1}', ${esc(s.key)}, ${esc(s.value)}) ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`);\n`;
  }

  // Pages
  sql += '\n-- 3. Insert Core Pages\n';
  for (let i = 0; i < records.pages.length; i++) {
    const p = records.pages[i];
    sql += `INSERT INTO \`Page\` (\`id\`, \`slug\`, \`title\`, \`content\`, \`metaTitle\`, \`metaDesc\`) VALUES ('page_${i+1}', ${esc(p.slug)}, ${esc(p.title)}, ${esc(p.content)}, ${esc(p.metaTitle)}, ${esc(p.metaDesc)}) ON DUPLICATE KEY UPDATE \`content\` = VALUES(\`content\`);\n`;
  }

  // Tools
  sql += '\n-- 4. Insert Initial Tools Suite (37 tools)\n';
  for (let i = 0; i < records.tools.length; i++) {
    const t = records.tools[i];
    sql += `INSERT INTO \`Tool\` (\`id\`, \`slug\`, \`name\`, \`description\`, \`category\`, \`isActive\`, \`isComingSoon\`, \`icon\`, \`order\`, \`metaTitle\`, \`metaDesc\`, \`content\`, \`usageCount\`, \`createdAt\`, \`updatedAt\`) VALUES ('tool_${i+1}', ${esc(t.slug)}, ${esc(t.name)}, ${esc(t.description)}, ${esc(t.category)}, ${esc(t.isActive)}, ${esc(t.isComingSoon)}, ${esc(t.icon)}, ${esc(t.order)}, ${esc(t.metaTitle)}, ${esc(t.metaDesc)}, ${esc(t.content)}, 0, NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`), \`content\` = VALUES(\`content\`), \`isActive\` = VALUES(\`isActive\`), \`isComingSoon\` = VALUES(\`isComingSoon\`);\n`;
  }

  sql += '\nSET FOREIGN_KEY_CHECKS = 1;\n';

  fs.writeFileSync('zoqonyx_database.sql', sql, 'utf8');
  console.log('Successfully written zoqonyx_database.sql! Length:', sql.length, 'bytes');
  console.log('Total settings:', records.settings.length);
  console.log('Total pages:', records.pages.length);
  console.log('Total tools:', records.tools.length);
}

run().catch(console.error);
