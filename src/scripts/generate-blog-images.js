import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

const blogImages = [
  {
    name: 'modern-web-dev',
    text: '',
    color: '#2c3e50',
  },
  {
    name: 'getting-started',
    text: '',
    color: '#27ae60',
  },
  {
    name: 'javascript-tips',
    text: '',
    color: '#f1c40f',
  },
  {
    name: 'modern-css',
    text: '',
    color: '#3498db',
  },
  {
    name: 'typescript',
    text: '',
    color: '#2980b9',
  },
  {
    name: 'web-performance',
    text: '',
    color: '#8e44ad',
  },
  {
    name: 'frontend-testing',
    text: '',
    color: '#c0392b',
  },
  {
    name: 'web-security',
    text: '',
    color: '#d35400',
  },
];

async function generateImage(image) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set viewport
  await page.setViewport({
    width: 1200,
    height: 630,
    deviceScaleFactor: 1,
  });

  // Generate a lighter version of the color for gradient
  const lighterColor = lightenColor(image.color, 20);

  // Create HTML content
  const html = `
    <html>
    <head>
      <style>
        body {
          margin: 0;
          padding: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, ${image.color}, ${lighterColor});
          font-family: system-ui, -apple-system, sans-serif;
          color: white;
          overflow: hidden;
        }
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.4) 100%);
        }
        .container {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 2rem;
        }
      </style>
    </head>
    <body>
      <div class="overlay"></div>
      <div class="container">
      </div>
    </body>
    </html>
  `;

  // Set content and take screenshot
  await page.setContent(html);

  // Ensure the directory exists
  const dir = path.join(process.cwd(), 'public/images/blog');
  await fs.mkdir(dir, { recursive: true });

  // Take screenshot
  await page.screenshot({
    path: path.join(dir, `${image.name}.jpg`),
    type: 'jpeg',
    quality: 90,
  });

  console.log(`Generating ${image.name}...`);
  await browser.close();
}

// Helper function to lighten a hex color
function lightenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

async function generateAllImages() {
  for (const image of blogImages) {
    await generateImage(image);
  }
  console.log('All blog images generated successfully!');
}

generateAllImages().catch(console.error);
