import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://juhahalmu.net',
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  server: {
    host: true,
    port: 4321
  },
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
      wrap: false
    },
    remarkPlugins: [],
    rehypePlugins: []
  },
  vite: {
    envPrefix: 'GITHUB_',
    logLevel: 'info',
    build: {
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name][extname]',
          chunkFileNames: 'assets/[name].js',
          entryFileNames: 'assets/[name].js'
        }
      }
    }
  }
});
