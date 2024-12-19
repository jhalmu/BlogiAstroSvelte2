import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

const blogImages = [
  {
    name: 'modern-web-dev',
    text: 'Modern Web Development',
    color: '#2c3e50'
  },
  {
    name: 'getting-started',
    text: 'Getting Started',
    color: '#27ae60'
  },
  {
    name: 'javascript-tips',
    text: 'JavaScript Tips',
    color: '#f1c40f'
  },
  {
    name: 'modern-css',
    text: 'Modern CSS',
    color: '#3498db'
  },
  {
    name: 'typescript',
    text: 'TypeScript',
    color: '#2980b9'
  },
  {
    name: 'web-performance',
    text: 'Web Performance',
    color: '#8e44ad'
  },
  {
    name: 'frontend-testing',
    text: 'Frontend Testing',
    color: '#c0392b'
  },
  {
    name: 'web-security',
    text: 'Web Security',
    color: '#d35400'
  }
];

async function generateImage(image) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({
    width: 1200,
    height: 630,
    deviceScaleFactor: 2,
  });
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, ${image.color}, ${lightenColor(image.color, 20)});
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .container {
          text-align: center;
          color: white;
          padding: 2rem;
        }
        h1 {
          font-size: 64px;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%);
        }
      </style>
    </head>
    <body>
      <div class="overlay"></div>
      <div class="container">
        <h1>${image.text}</h1>
      </div>
    </body>
    </html>
  `;
  
  await page.setContent(html);
  
  const outputDir = path.join(process.cwd(), 'public', 'images', 'blog');
  await fs.mkdir(outputDir, { recursive: true });
  
  await page.screenshot({
    path: path.join(outputDir, `${image.name}.jpg`),
    type: 'jpeg',
    quality: 90
  });
  
  await browser.close();
}

function lightenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return `#${(1 << 24 | (R < 255 ? R < 1 ? 0 : R : 255) << 16 | (G < 255 ? G < 1 ? 0 : G : 255) << 8 | (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)}`;
}

async function generateAllImages() {
  for (const image of blogImages) {
    console.log(`Generating ${image.name}...`);
    await generateImage(image);
  }
  console.log('All blog images generated successfully!');
}

generateAllImages().catch(console.error);
