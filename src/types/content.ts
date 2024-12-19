import { z } from 'astro:content';

// Blog schema
export const blogSchema = z.object({
  title: z.string(),
  date: z.string().transform((str) => new Date(str)).optional(),
  author: z.string().optional(),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  image: z.object({
    src: z.string(),
    alt: z.string()
  }).optional()
});

// Pages schema
export const pagesSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  image: z.object({
    src: z.string(),
    alt: z.string()
  }).optional(),
  tags: z.array(z.string()).optional(),
  excludeTags: z.array(z.string()).optional(),
  preferredColors: z.array(z.string()).optional(),
  orientation: z.string().optional(),
  minWidth: z.number().optional(),
  minHeight: z.number().optional(),
  overlayOpacity: z.number().optional(),
  rounded: z.string().optional(),
  lastUpdated: z.string().optional()
});

// Infer types from schemas
export type BlogPost = z.infer<typeof blogSchema>;
export type Page = z.infer<typeof pagesSchema>;

// Image type used across the site
export interface ImageMetadata {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

// Tag type for consistent tag handling
export interface Tag {
  name: string;
  count: number;
}
