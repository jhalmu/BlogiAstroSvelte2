import { z, defineCollection } from 'astro:content';

const blogSchema = z.object({
  title: z.string(),
  date: z.string(),
  updated: z.string().optional(),
  excerpt: z.string().optional(),
  author: z.string(),
  tags: z.array(z.string()),
});

const pageSchema = z.object({
  title: z.string(),
  description: z.string(),
  lastUpdated: z.string().optional(),
});

const blogCollection = defineCollection({
  schema: blogSchema,
});

const pageCollection = defineCollection({
  schema: pageSchema,
});

export const collections = {
  blog: blogCollection,
  pages: pageCollection,
};
