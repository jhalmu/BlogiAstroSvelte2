import { preloadImages } from '../src/utils/imagePreloader.js';

console.log('Preloading blog post images...');

try {
  const images = await preloadImages();
  console.log(`Successfully preloaded ${Object.keys(images).length} images`);
} catch (error) {
  console.error('Error preloading images:', error);
  process.exit(1);
}
