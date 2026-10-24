# Zoqonyx Solution Hub (zoqonyx.com)

**Zoqonyx** (pronounced: *Zo-kon-ix*) is a comprehensive, modern, high-speed free online tools platform engineered to rank for thousands of long-tail keywords across image manipulation, CSS and design generation, developer utilities, calculators, and emerging AI tools.

- **Domain**: [https://zoqonyx.com](https://zoqonyx.com)
- **Tagline**: *Solution Hub*
- **Owner**: Zawwar Ahmed
- **Developed by**: [Newix Tech Solutions](https://newixtechsolutions.com/)
- **Contact Emails**: `hello@zoqonyx.com`, `zawwar.ahmed2006@gmail.com`

---

## 🎨 Brand Design System

Built in strict compliance with the **Zoqonyx Brand Guidelines**:

| Color Name | HEX Code | Usage |
|---|---|---|
| **Deep Navy** | `#0F172A` | Primary text, Dark mode background, Logo wordmark |
| **Primary Blue** | `#1E3A8A` | Primary action buttons, headers, links |
| **Gradient Blue** | `#2563EB` | Accent highlights, hover states, icons |
| **Electric Cyan** | `#06B6D4` | High-energy highlights, CTAs, signature gradient start |
| **Soft Purple** | `#7C3AED` | Secondary accents, badges, signature gradient end |
| **Light Gray** | `#F1F5F9` | Light mode backgrounds, card surfaces, sections |
| **Medium Gray** | `#64748B` | Secondary text, borders, captions |

- **Signature Brand Gradient**: `linear-gradient(135deg, #06B6D4 0%, #7C3AED 100%)`
- **Typography**: Google Fonts `Plus Jakarta Sans` (headings) and `Inter` (body)

---

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript + React 19
- **Styling**: Tailwind CSS + shadcn/ui + Lucide React
- **Database**: Prisma ORM with MySQL (Hostinger) & SQLite (local dev/testing)
- **Authentication**: Username & Password secured with `bcryptjs` and HTTP-only JWT sessions
- **Storage**: Local / Hostinger public folder (`public/logo`, `public/icons`)
- **Testing**: Playwright cross-browser end-to-end testing suite
- **Deployment**: Git push to Hostinger Node.js Application

---

## 🛠️ Features & Architecture

1. **Client-Side Privacy Engine**:
   All Phase 1 active tools (Image Compressor, Resizer, Format Converter, Color Picker, Border Radius, Flexbox, JSON Formatter, QR Code, Hash Generator, etc.) run 100% inside the user's browser. Zero private data or images are stored on remote servers.

2. **Rankable "Coming Soon" Engine**:
   Every advanced tool (e.g. AI Background Remover, AI Upscaler, Full PDF Editor) has a dedicated, indexable route with 400–700 words of authentic SEO content, visual roadmap progress animations, and an interactive "Notify Me" email subscription capture.

3. **Dynamic Admin Panel (`/admin`)**:
   - **Dashboard**: Total tools count, live vs coming soon counts, aggregate usage stats, and new inquiries.
   - **Tools Manager**: Instant toggle for active/disabled, instant toggle for Live vs Coming Soon, category switcher, display ordering, and in-place markdown SEO editor. All changes take effect immediately without redeploying.
   - **Appearance Customizer**: Change logo URLs, color codes, and default themes.
   - **Pages Manager**: Edit markdown content and SEO metadata for About, Privacy Policy, Terms, and Homepage.
   - **Messages & Leads**: View incoming contact messages and Coming Soon email subscribers.
   - **Platform Settings**: Change site title, contact emails, and footer attribution.

4. **SEO & Core Web Vitals**:
   - Dynamic metadata for every tool and institutional page.
   - Automatic `sitemap.xml` and `robots.txt` generation.
   - Structured JSON-LD schemas (`WebSite`, `WebApplication`, `Organization`).
   - Mobile-first responsive layouts with instant theme switching (Dark / Light mode).

---

## 🔑 Default Admin Credentials

- **URL**: `http://localhost:3000/admin` (or `https://zoqonyx.com/admin`)
- **Username**: `admin`
- **Password**: `AdminPassword2026!`

*(Password can be updated anytime in the database or via Prisma)*

---

## 💻 Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Sync database schema & generate Prisma Client
npx prisma generate
npx prisma db push

# 3. Seed database with admin user, default settings, and 35+ tools
node prisma/seed.js

# 4. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the live platform.

---

## 🧪 Running Playwright E2E Tests

The project includes automated tests covering:
- Homepage loading, instant search, and category filtering.
- Dark / Light mode toggle.
- Interactive tools execution (Case Converter, Border Radius, JSON, QR Code, Age Calculator).
- Coming Soon page rendering and email subscription flow.
- Admin login, dashboard metrics, tools toggling, and logout.
- Contact form submission.
- SEO meta tags, JSON-LD, sitemap, and robots.txt.

```bash
# Build the application
npm run build

# Run end-to-end tests
npx playwright test
```

---

## 🌐 Hostinger Deployment Guide

1. **Hostinger Node.js Setup**:
   - In Hostinger hPanel, create a new **Node.js application**.
   - Select Node.js version `20.x` or `22.x`.
   - Set Application Root to the project directory.
   - Set Startup File to `server.js` or `npm run start`.

2. **MySQL Database Connection**:
   - In Hostinger hPanel, create a MySQL database and user.
   - Copy `prisma/schema.mysql.prisma` to `prisma/schema.prisma` (or run `npx prisma db push --schema=prisma/schema.mysql.prisma`).
   - In Hostinger Environment Variables, set:
     ```env
     DATABASE_URL="mysql://u123456789_zoqonyx:YourPassword@localhost:3306/u123456789_zoqonyx"
     JWT_SECRET="generate_a_long_random_production_secret"
     NEXT_PUBLIC_SITE_URL="https://zoqonyx.com"
     ```

3. **Deploy via Git**:
   - Connect your GitHub / Git repository in Hostinger.
   - Run Build Command: `npm install && npx prisma generate && npm run build`
   - Run Seed once: `node prisma/seed.js`
   - Start the application.
