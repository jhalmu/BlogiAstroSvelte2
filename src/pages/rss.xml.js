import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';

// Mark this route as static
export const prerender = true;

export async function GET(context) {
  const blog = await getCollection('blog');

  // Sanitize and prepare feed items
  const items = await Promise.all(
    blog.map(async (post) => {
      const description = post.data.description
        ? sanitizeHtml(post.data.description, {
            allowedTags: [], // Strip all HTML for security
            allowedAttributes: {},
          })
        : '';

      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description,
        link: `/blog/${post.slug}/`,
        // Add additional RSS-specific fields
        categories: post.data.tags || [],
        author: post.data.author || 'Juha Halmu',
      };
    })
  );

  return rss({
    title: 'Juha Halmu Blogi',
    description: 'Blogi teknologiasta, ohjelmoinnista ja web-kehityksestä',
    site: context.site,
    items,
    customData: `
      <language>fi</language>
      <generator>Astro v${process.env.ASTRO_VERSION}</generator>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    `,
    xmlns: {
      // Add standard RSS namespaces
      atom: 'http://www.w3.org/2005/Atom',
      dc: 'http://purl.org/dc/elements/1.1/',
      content: 'http://purl.org/rss/1.0/modules/content/',
    },
  });
}
