import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '..', 'public');

// Ensure the public directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

async function generateImages() {
  // Read the base SVG
  const svgBuffer = fs.readFileSync(join(PUBLIC_DIR, 'logo-base.svg'));

  // Generate favicons
  await sharp(svgBuffer)
    .resize(16, 16)
    .toFile(join(PUBLIC_DIR, 'favicon-16x16.png'));

  await sharp(svgBuffer)
    .resize(32, 32)
    .toFile(join(PUBLIC_DIR, 'favicon-32x32.png'));

  await sharp(svgBuffer)
    .resize(180, 180)
    .toFile(join(PUBLIC_DIR, 'apple-touch-icon.png'));

  await sharp(svgBuffer)
    .resize(192, 192)
    .toFile(join(PUBLIC_DIR, 'android-chrome-192x192.png'));

  await sharp(svgBuffer)
    .resize(512, 512)
    .toFile(join(PUBLIC_DIR, 'android-chrome-512x512.png'));

  // Create OpenGraph image
  const ogWidth = 1200;
  const ogHeight = 630;
  
  // Create a new image with gradient background
  const ogImage = await sharp({
    create: {
      width: ogWidth,
      height: ogHeight,
      channels: 4,
      background: { r: 88, g: 28, b: 135, alpha: 1 } // #581c87
    }
  })
    .composite([
      {
        input: svgBuffer,
        top: 65,
        left: Math.floor((ogWidth - 512) / 2),
      },
      {
        input: {
          text: {
            text: "Juha Halmu's Blog",
            font: 'Poppins',
            fontSize: 72,
            align: 'center',
            width: ogWidth,
          }
        },
        top: Math.floor(ogHeight - 150),
        left: 0,
      }
    ])
    .toFile(join(PUBLIC_DIR, 'og-default.jpg'));

  console.log('All images generated successfully!');
}

generateImages().catch(console.error);
