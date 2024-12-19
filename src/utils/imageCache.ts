import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { getPexelsImage } from './pexels';

interface CachedImage {
  localPath: string;
  color: string;
  width: number;
  height: number;
  pexelsId: number;
}

interface ImageCache {
  [key: string]: CachedImage;
}

const CACHE_DIR = 'public/images/blog';
const CACHE_FILE = 'src/content/image-cache.json';

// Standard dimensions for blog post images
const BLOG_IMAGE_WIDTH = 1200;
const BLOG_IMAGE_HEIGHT = 630;

export async function ensureImageCache() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating cache directory:', error);
  }
}

export async function loadImageCache(): Promise<ImageCache> {
  try {
    const cacheContent = await fs.readFile(CACHE_FILE, 'utf-8');
    return JSON.parse(cacheContent);
  } catch (error) {
    return {};
  }
}

export async function saveImageCache(cache: ImageCache) {
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
}

export async function getCachedImage(tags: string[]): Promise<CachedImage | null> {
  const cache = await loadImageCache();
  const cacheKey = tags.sort().join(',');
  
  // Check if image exists in cache
  if (cache[cacheKey]) {
    try {
      // Verify the file exists
      await fs.access(path.join('public', cache[cacheKey].localPath));
      return cache[cacheKey];
    } catch {
      // File doesn't exist, remove from cache
      delete cache[cacheKey];
      await saveImageCache(cache);
    }
  }

  // Fetch new image if not in cache
  const image = await getPexelsImage({ tags });
  if (!image) return null;

  try {
    const fileName = `pexels-${image.id}-${Date.now()}.webp`;
    const localPath = path.join(CACHE_DIR, fileName).replace('public/', '/');
    
    // Download and process image
    const response = await fetch(image.srcSet.large2x);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process with sharp
    await sharp(buffer)
      .resize(BLOG_IMAGE_WIDTH, BLOG_IMAGE_HEIGHT, {
        fit: 'cover',
        position: 'attention'
      })
      .webp({ quality: 80 })
      .toFile(path.join('public', localPath));

    // Cache the result
    const cachedImage: CachedImage = {
      localPath,
      color: '#808080', // Default to a neutral gray since avg_color is not available
      width: BLOG_IMAGE_WIDTH,
      height: BLOG_IMAGE_HEIGHT,
      pexelsId: image.id
    };

    cache[cacheKey] = cachedImage;
    await saveImageCache(cache);

    return cachedImage;
  } catch (error) {
    console.error('Error processing image:', error);
    return null;
  }
}

// Function to get image for blog post
export async function getBlogPostImage(tags: string[]) {
  await ensureImageCache();
  return getCachedImage(tags);
}
