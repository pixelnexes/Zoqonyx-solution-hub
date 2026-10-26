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

  const { defaultTools } = require('../prisma/seed.js');
  
  const defaultSettingsArray = [
    { key: 'site_name', value: 'ZOQONYX Solution Hub' },
    { key: 'site_tagline', value: 'Free Online Tools Platform' },
    { key: 'contact_email_primary', value: 'hello@zoqonyx.com' },
    { key: 'contact_email_secondary', value: 'zawwar.ahmed2006@gmail.com' },
    { key: 'footer_credit', value: 'Developed by Newix Tech Solutions' },
    { key: 'footer_url', value: 'https://newixtechsolutions.com/' },
    { key: 'logo_path', value: '/logo/zoqonyx-logo.png' },
    { key: 'icon_path', value: '/logo/zoqonyx-icon.png' },
    { key: 'primary_color', value: '#14B8A6' },
    { key: 'secondary_color', value: '#0D9488' },
    { key: 'electric_cyan', value: '#2DD4BF' },
    { key: 'soft_purple', value: '#8B5CF6' },
    { key: 'default_theme', value: 'dark' },
  ];

  const defaultPagesArray = [
    {
      slug: 'about',
      title: 'About Zoqonyx Solution Hub',
      content: '### Our Mission\\n\\nZoqonyx Solution Hub is an open, high-performance web platform dedicated to delivering free, privacy-first digital utilities. Developed by Newix Tech Solutions, the platform empowers developers, designers, students, and digital creators worldwide.\\n\\n### Zero-Upload Browser Architecture\\n\\nTraditional online tools upload your confidential media, contracts, and source code to remote cloud servers. Zoqonyx overturns this paradigm by processing all files and calculations client-side using WebAssembly, HTML5 Canvas, and Web Workers. Your data never leaves your computer.\\n\\n### 100% Free & No Sign-Up Required\\n\\nEvery utility is completely free with zero subscription fees, no credit card requirements, and no mandatory login walls.',
      metaTitle: 'About Us – Free Client-Side Tools Mission | Zoqonyx',
      metaDesc: 'Learn about Zoqonyx Solution Hub, developed by Newix Tech Solutions to empower creators with free client-side digital tools.'
    },
    {
      slug: 'privacy-policy',
      title: 'Privacy Policy',
      content: '### Absolute Data Confidentiality\\n\\nAt Zoqonyx Solution Hub, privacy is not an afterthought—it is our core architecture. When you compress an image, merge a PDF, generate a QR code, or inspect an SSL certificate, the computation executes locally on your device.\\n\\n### Zero File Storage\\n\\nWe do not operate backend file storage or telemetry for uploaded files. Once you refresh or close your browser tab, all temporary data in memory is permanently destroyed.\\n\\n### Local Analytics & Cookies\\n\\nWe use standard non-intrusive analytics solely to monitor aggregated traffic patterns. No personal identifiable information is ever monetized or shared with third parties.',
      metaTitle: 'Privacy Policy – Zero Data Retention Guarantee | Zoqonyx',
      metaDesc: 'Read our transparent privacy policy. All data processing occurs client-side in your browser with zero remote storage.'
    },
    {
      slug: 'terms',
      title: 'Terms of Service',
      content: '### Acceptance of Terms\\n\\nBy accessing and utilizing Zoqonyx Solution Hub, you agree to be bound by these Terms of Service and all applicable local, national, and international laws.\\n\\n### Permitted Use\\n\\nOur utilities are provided free of charge for both personal and commercial use. You agree not to attempt to disrupt or overwhelm our infrastructure through automated denial-of-service attacks or malicious scraping.\\n\\n### Disclaimer of Warranties\\n\\nAll tools and calculations are provided on an "as is" basis. While we strive for absolute mathematical and technical accuracy, Zoqonyx Solution Hub disclaims all implied warranties of fitness for a particular purpose.',
      metaTitle: 'Terms of Service – Usage Guidelines | Zoqonyx',
      metaDesc: 'Review the terms and conditions governing the usage of Zoqonyx Solution Hub online tools and services.'
    }
  ];

  const records = { settings: defaultSettingsArray, pages: defaultPagesArray, tools: defaultTools };

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
  sql += '\n-- 4. Clean & Insert Full 130 Tools Suite (100 Active + 30 Coming Soon)\n';
  sql += 'DELETE FROM `Tool`;\n';
  for (let i = 0; i < records.tools.length; i++) {
    const t = records.tools[i];
    const toolId = `tool_${t.slug.replace(/[^a-zA-Z0-9_]/g, '_')}`;
    sql += `INSERT INTO \`Tool\` (\`id\`, \`slug\`, \`name\`, \`description\`, \`category\`, \`isActive\`, \`isComingSoon\`, \`icon\`, \`order\`, \`metaTitle\`, \`metaDesc\`, \`content\`, \`usageCount\`, \`createdAt\`, \`updatedAt\`) VALUES (${esc(toolId)}, ${esc(t.slug)}, ${esc(t.name)}, ${esc(t.description)}, ${esc(t.category)}, ${esc(t.isActive)}, ${esc(t.isComingSoon)}, ${esc(t.icon)}, ${esc(t.order)}, ${esc(t.metaTitle)}, ${esc(t.metaDesc)}, ${esc(t.content)}, 0, NOW(3), NOW(3)) ON DUPLICATE KEY UPDATE \`slug\` = VALUES(\`slug\`), \`name\` = VALUES(\`name\`), \`description\` = VALUES(\`description\`), \`category\` = VALUES(\`category\`), \`isActive\` = VALUES(\`isActive\`), \`isComingSoon\` = VALUES(\`isComingSoon\`), \`icon\` = VALUES(\`icon\`), \`order\` = VALUES(\`order\`), \`metaTitle\` = VALUES(\`metaTitle\`), \`metaDesc\` = VALUES(\`metaDesc\`), \`content\` = VALUES(\`content\`);\n`;
  }

  sql += '\nSET FOREIGN_KEY_CHECKS = 1;\n';

  fs.writeFileSync('zoqonyx_database.sql', sql, 'utf8');
  console.log('Successfully written zoqonyx_database.sql! Length:', sql.length, 'bytes');
  console.log('Total settings:', records.settings.length);
  console.log('Total pages:', records.pages.length);
  console.log('Total tools:', records.tools.length);
}

run().catch(console.error);
