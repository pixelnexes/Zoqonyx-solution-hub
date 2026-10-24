const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

async function generateOgImage() {
  const iconPath = path.resolve(__dirname, '../public/logo/zoqonyx-icon.png');
  const iconBase64 = fs.readFileSync(iconPath).toString('base64');
  const iconDataUri = `data:image/png;base64,${iconBase64}`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    body {
      width: 1200px;
      height: 630px;
      background: #0B1120;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 60px 80px;
      position: relative;
      overflow: hidden;
    }
    /* Subtle background grid pattern */
    .grid-bg {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }
    /* Ambient neon glows */
    .glow-cyan {
      position: absolute;
      top: -150px;
      right: -100px;
      width: 550px;
      height: 550px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(50px);
      pointer-events: none;
    }
    .glow-purple {
      position: absolute;
      bottom: -150px;
      left: 100px;
      width: 550px;
      height: 550px;
      background: radial-gradient(circle, rgba(124, 58, 237, 0.20) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(50px);
      pointer-events: none;
    }

    .content {
      position: relative;
      z-index: 10;
      max-width: 650px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      border-radius: 9999px;
      background: rgba(6, 182, 212, 0.12);
      border: 1px solid rgba(6, 182, 212, 0.35);
      color: #38BDF8;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      width: fit-content;
    }

    .logo-row {
      display: flex;
      align-items: baseline;
      gap: 12px;
    }
    .logo-name {
      font-size: 42px;
      font-weight: 900;
      letter-spacing: 0.02em;
      color: #FFFFFF;
      display: flex;
      align-items: center;
    }
    .gradient-x {
      background: linear-gradient(135deg, #06B6D4 0%, #7C3AED 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .logo-sub {
      font-size: 16px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.25em;
      color: #94A3B8;
    }

    .headline {
      font-size: 48px;
      font-weight: 900;
      line-height: 1.15;
      letter-spacing: -0.02em;
      color: #FFFFFF;
    }
    .headline-highlight {
      background: linear-gradient(135deg, #06B6D4 0%, #7C3AED 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .description {
      font-size: 20px;
      color: #94A3B8;
      line-height: 1.5;
      font-weight: 500;
    }

    .features-row {
      display: flex;
      align-items: center;
      gap: 20px;
      padding-top: 10px;
    }
    .feature-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 8px 16px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      color: #F1F5F9;
    }
    .check-icon {
      color: #10B981;
      font-weight: 800;
    }

    .visual-wrapper {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-container {
      width: 380px;
      height: 380px;
      border-radius: 48px;
      background: linear-gradient(135deg, rgba(30, 58, 138, 0.35) 0%, rgba(124, 58, 237, 0.2) 100%);
      border: 1px solid rgba(6, 182, 212, 0.25);
      box-shadow: 0 25px 60px -15px rgba(6, 182, 212, 0.25), inset 0 1px 0 rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      backdrop-filter: blur(10px);
    }
    .icon-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.5));
    }

    .domain-tag {
      position: absolute;
      bottom: 24px;
      right: 80px;
      font-size: 15px;
      font-weight: 700;
      color: #64748B;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      z-index: 20;
    }
  </style>
</head>
<body>
  <div class="grid-bg"></div>
  <div class="glow-cyan"></div>
  <div class="glow-purple"></div>

  <div class="content">
    <div class="badge">
      <span>●</span> 100% Client-Side Privacy
    </div>

    <div class="logo-row">
      <div class="logo-name">ZOQONY<span class="gradient-x">X</span></div>
      <div class="logo-sub">Solution Hub</div>
    </div>

    <div class="headline">
      Free Online Tools. <br>
      <span class="headline-highlight">Unlimited Power.</span>
    </div>

    <div class="description">
      Compress photos, generate styled QR codes, format JSON, and build modern CSS with zero sign-up and zero server uploads.
    </div>

    <div class="features-row">
      <div class="feature-pill">
        <span class="check-icon">✓</span> 37+ Free Tools
      </div>
      <div class="feature-pill">
        <span class="check-icon">✓</span> Zero Data Stored
      </div>
      <div class="feature-pill">
        <span class="check-icon">✓</span> Instant Speed
      </div>
    </div>
  </div>

  <div class="visual-wrapper">
    <div class="icon-container">
      <img src="${iconDataUri}" class="icon-img" alt="Zoqonyx Emblem" />
    </div>
  </div>

  <div class="domain-tag">zoqonyx.com</div>
</body>
</html>`;

  console.log('Launching browser to capture 1200x630 Open Graph banner...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });

  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const outDir = path.resolve(__dirname, '../public/logo');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPath1 = path.join(outDir, 'zoqonyx-og.png');
  const outPath2 = path.resolve(__dirname, '../public/og-image.png');

  await page.screenshot({ path: outPath1, type: 'png' });
  await page.screenshot({ path: outPath2, type: 'png' });

  await browser.close();

  const stat = fs.statSync(outPath1);
  console.log(`Successfully generated 1200x630 OG Banner! Size: ${stat.size} bytes at:`);
  console.log(` - ${outPath1}`);
  console.log(` - ${outPath2}`);
}

generateOgImage().catch(console.error);
