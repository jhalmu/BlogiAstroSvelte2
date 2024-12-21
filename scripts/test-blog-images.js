import { generateBlogImage, clearCache } from './generate-blog-images.js';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '..', 'public');
const TEST_OUTPUT_DIR = join(PUBLIC_DIR, 'images', 'blog', 'test');

// Ensure test directory exists
if (!fs.existsSync(TEST_OUTPUT_DIR)) {
  fs.mkdirSync(TEST_OUTPUT_DIR, { recursive: true });
}

// Clear cache before testing
clearCache();

// Test titles
const testTitles = [
  'Building Modern Web Applications',
  'The Future of AI Development',
  'Understanding TypeScript Generics',
  'GraphQL vs REST APIs',
  'Docker Container Orchestration'
];

async function runTests() {
  console.log('Generating test images...');
  
  for (const title of testTitles) {
    console.log(`\nGenerating image for: ${title}`);
    const cacheFile = await generateBlogImage(title);
    
    // Copy to test directory
    const outputFile = join(TEST_OUTPUT_DIR, `${title.toLowerCase().replace(/\s+/g, '-')}.png`);
    fs.copyFileSync(cacheFile, outputFile);
    
    console.log(`Image saved to: ${outputFile}`);
  }
  
  console.log('\nTest completed! Check the test directory for results.');
}

runTests().catch(console.error);
