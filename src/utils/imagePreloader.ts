import { getCollection } from 'astro:content';
import fs from 'fs/promises';
import path from 'path';
import { getPexelsImage } from './pexels';
import sharp from 'sharp';

interface PreloadedImage {
  slug: string;
  imagePath: string;
  width: number;
  height: number;
}

const IMAGES_DIR = 'public/images/blog';
const CACHE_FILE = 'src/content/blog-images.json';

export async function preloadImages() {
  // Ensure images directory exists
  await fs.mkdir(IMAGES_DIR, { recursive: true });

  const preloadedImages: Record<string, PreloadedImage> = {};
  
  try {
    // Get all blog posts
    const posts = await getCollection('blog');
    
    for (const post of posts) {
      // Get tags for the post
      const tags = [
        ...(post.data.tags || []),
        'blog',
        'writing',
        'desk',
        'computer'
      ].slice(0, 3);

      // Get image from Pexels
      const image = await getPexelsImage({ tags });
      
      if (image) {
        // Create a unique filename
        const fileName = `${post.slug}-${image.id}.webp`;
        const filePath = path.join(IMAGES_DIR, fileName);
        const publicPath = `/images/blog/${fileName}`;

        // Download and process image
        const response = await fetch(image.src.large2x);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Process with sharp
        await sharp(buffer)
          .resize(1200, 630, {
            fit: 'cover',
            position: 'attention'
          })
          .webp({ quality: 80 })
          .toFile(filePath);

        // Store image info
        preloadedImages[post.slug] = {
          slug: post.slug,
          imagePath: publicPath,
          width: 1200,
          height: 630
        };
      }
    }

    // Save cache file
    await fs.writeFile(
      CACHE_FILE,
      JSON.stringify(preloadedImages, null, 2)
    );

    return preloadedImages;
  } catch (error) {
    console.error('Error preloading images:', error);
    return {};
  }
}

export async function getPreloadedImage(slug: string): Promise<PreloadedImage | null> {
  try {
    const cacheContent = await fs.readFile(CACHE_FILE, 'utf-8');
    const cache = JSON.parse(cacheContent);
    return cache[slug] || null;
  } catch (error) {
    console.error('Error reading image cache:', error);
    return null;
  }
}
