import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '..', 'public');
const BLOG_IMAGES_DIR = join(PUBLIC_DIR, 'images', 'blog');
const CACHE_DIR = join(__dirname, '..', '.cache', 'blog-images');

// Ensure directories exist
[BLOG_IMAGES_DIR, CACHE_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Generate a hash for caching
function generateHash(input) {
  return crypto.createHash('md5').update(input).digest('hex');
}

// Generate gradient stops based on title
function generateGradientStops(title) {
  const hash = generateHash(title);
  
  // Use hash to generate colors
  const colors = [
    { r: parseInt(hash.slice(0, 2), 16), g: parseInt(hash.slice(2, 4), 16), b: parseInt(hash.slice(4, 6), 16) },
    { r: parseInt(hash.slice(6, 8), 16), g: parseInt(hash.slice(8, 10), 16), b: parseInt(hash.slice(10, 12), 16) },
    { r: parseInt(hash.slice(12, 14), 16), g: parseInt(hash.slice(14, 16), 16), b: parseInt(hash.slice(16, 18), 16) }
  ];

  // Ensure colors are visually pleasing
  colors.forEach(color => {
    // Adjust saturation and brightness
    const max = Math.max(color.r, color.g, color.b);
    const min = Math.min(color.r, color.g, color.b);
    const delta = max - min;
    
    if (delta < 50) {  // If colors are too similar
      color.r = Math.min(255, color.r * 1.5);
      color.g = Math.min(255, color.g * 1.2);
      color.b = Math.min(255, color.b * 1.3);
    }
    
    // Ensure minimum brightness
    const brightness = (color.r + color.g + color.b) / 3;
    if (brightness < 100) {
      const factor = 100 / brightness;
      color.r = Math.min(255, color.r * factor);
      color.g = Math.min(255, color.g * factor);
      color.b = Math.min(255, color.b * factor);
    }
  });

  return colors;
}

// Create gradient SVG
function createGradientSVG(width, height, colors) {
  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(${colors[0].r},${colors[0].g},${colors[0].b});stop-opacity:1" />
          <stop offset="50%" style="stop-color:rgb(${colors[1].r},${colors[1].g},${colors[1].b});stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(${colors[2].r},${colors[2].g},${colors[2].b});stop-opacity:1" />
        </linearGradient>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0.15"/>
          <feBlend mode="overlay" in2="SourceGraphic"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <rect width="100%" height="100%" filter="url(#noise)" opacity="0.1"/>
    </svg>
  `;
}

async function generateBlogImage(title, width = 1200, height = 630) {
  const hash = generateHash(title);
  const cacheFile = join(CACHE_DIR, `${hash}.png`);
  
  // Check cache first
  if (fs.existsSync(cacheFile)) {
    return cacheFile;
  }
  
  const colors = generateGradientStops(title);
  const svg = createGradientSVG(width, height, colors);
  
  // Create image with gradient and text
  await sharp(Buffer.from(svg))
    .resize(width, height)
    .composite([
      {
        input: {
          text: {
            text: title,
            font: 'sans-serif',
            fontSize: 60,
            align: 'center'
          },
          rgba: true
        },
        gravity: 'center'
      }
    ])
    .toFile(cacheFile);
  
  return cacheFile;
}

// Clear development cache
function clearCache() {
  if (fs.existsSync(CACHE_DIR)) {
    fs.readdirSync(CACHE_DIR).forEach(file => {
      fs.unlinkSync(join(CACHE_DIR, file));
    });
  }
}

export { generateBlogImage, clearCache };
