import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://juhahalmu.net',
  output: 'hybrid',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  },
  prerender: {
    forcePrerenderRoutes: ['/rss.xml']
  },
  integrations: [tailwind()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    },
    remarkPlugins: [],
    rehypePlugins: []
  },
  vite: {
    logLevel: 'info',
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    }
  }
});
