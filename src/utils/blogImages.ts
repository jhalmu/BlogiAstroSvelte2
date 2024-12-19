import fs from 'fs/promises';
import path from 'path';

interface BlogImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface BlogImagesData {
  [key: string]: BlogImage;
}

const BLOG_IMAGES_PATH = path.join(process.cwd(), 'src/data/blog-images.json');

export async function getBlogImages(): Promise<BlogImagesData> {
  try {
    const data = await fs.readFile(BLOG_IMAGES_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading blog images:', error);
    return {};
  }
}

export async function saveBlogImages(images: BlogImagesData): Promise<void> {
  try {
    await fs.writeFile(BLOG_IMAGES_PATH, JSON.stringify(images, null, 2));
  } catch (error) {
    console.error('Error saving blog images:', error);
  }
}

export async function getBlogImage(slug: string): Promise<BlogImage | null> {
  const images = await getBlogImages();
  return images[slug] || null;
}

export async function setBlogImage(slug: string, image: BlogImage): Promise<void> {
  const images = await getBlogImages();
  images[slug] = image;
  await saveBlogImages(images);
}
