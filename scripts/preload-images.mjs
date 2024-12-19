import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const IMAGES_DIR = path.join(projectRoot, 'public/images/blog');
const BLOG_IMAGES_DIR = path.join(projectRoot, 'src/content/blog-images');

// Fallback image generation
async function generatePlaceholderImage(slug, width = 1200, height = 630) {
  const fileName = `${slug}-placeholder.webp`;
  const filePath = path.join(IMAGES_DIR, fileName);
  const publicPath = `/images/blog/${fileName}`;

  // Create a gradient background
  const gradient = Buffer.from(
    `<svg width="${width}" height="${height}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(79,70,229);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(45,55,72);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </svg>`
  );

  await sharp(gradient)
    .webp({ quality: 90 })
    .toFile(filePath);

  return {
    imagePath: publicPath,
    width,
    height
  };
}

async function getBlogPosts() {
  const contentDir = path.join(projectRoot, 'src/content/blog');
  const files = await fs.readdir(contentDir);
  const posts = [];

  for (const file of files) {
    if (file.endsWith('.md')) {
      const content = await fs.readFile(path.join(contentDir, file), 'utf-8');
      const frontmatter = content.split('---')[1];
      const slug = file.replace('.md', '');
      
      // Parse tags from frontmatter
      const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);
      const tags = tagsMatch 
        ? tagsMatch[1].split(',').map(tag => 
            tag.trim().replace(/['"]/g, '')
          )
        : [];

      posts.push({ slug, tags });
    }
  }

  return posts;
}

async function preloadImages() {
  console.log('Creating directories...');
  await fs.mkdir(IMAGES_DIR, { recursive: true });
  await fs.mkdir(BLOG_IMAGES_DIR, { recursive: true });

  const posts = await getBlogPosts();
  console.log(`Found ${posts.length} blog posts`);

  for (const post of posts) {
    console.log(`Processing post: ${post.slug}`);
    
    try {
      // Generate placeholder image
      const imageData = await generatePlaceholderImage(post.slug);
      
      // Save image data to content collection
      const imageJson = {
        ...imageData,
        slug: post.slug
      };
      
      await fs.writeFile(
        path.join(BLOG_IMAGES_DIR, `${post.slug}.json`),
        JSON.stringify(imageJson, null, 2)
      );
      
      console.log(`Generated image for: ${post.slug}`);
    } catch (error) {
      console.error(`Error generating image for ${post.slug}:`, error);
    }
  }
}

console.log('Starting image preload process...');

try {
  await preloadImages();
  console.log('Successfully preloaded all images');
} catch (error) {
  console.error('Error preloading images:', error);
  process.exit(1);
}
