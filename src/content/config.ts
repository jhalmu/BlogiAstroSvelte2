import { defineCollection } from 'astro:content';
import { blogSchema, pagesSchema } from '../types/content';

// Blog collection schema
const blog = defineCollection({
  type: 'content', // Explicitly set type as content
  schema: blogSchema,
});

// Pages collection schema
const pages = defineCollection({
  type: 'content', // Explicitly set type as content
  schema: pagesSchema,
});

// Export collections
export const collections = {
  blog,
  pages,
};
