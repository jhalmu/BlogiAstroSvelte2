import db from './index';
import { z } from 'zod';

// Post validation schema
export const PostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  slug: z.string().min(1),
  date: z.date(),
  updated: z.date().optional(),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  image: z.string().optional(),
});

export type Post = z.infer<typeof PostSchema>;

export async function getPosts(
  options: {
    draft?: boolean;
    tag?: string;
    limit?: number;
    offset?: number;
  } = {}
) {
  let query = db('posts').select('posts.*').orderBy('date', 'desc');

  if (typeof options.draft === 'boolean') {
    query = query.where('draft', options.draft);
  }

  if (options.tag) {
    query = query
      .join('posts_tags', 'posts.id', 'posts_tags.post_id')
      .join('tags', 'posts_tags.tag_id', 'tags.id')
      .where('tags.name', options.tag);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  if (options.offset) {
    query = query.offset(options.offset);
  }

  return query;
}

export async function getPostBySlug(slug: string) {
  return db('posts').where('slug', slug).first();
}

export async function createPost(post: Post) {
  const validatedPost = PostSchema.parse(post);
  return db('posts').insert(validatedPost).returning('*');
}

export async function updatePost(slug: string, post: Partial<Post>) {
  const validatedUpdate = PostSchema.partial().parse(post);
  return db('posts').where('slug', slug).update(validatedUpdate).returning('*');
}

export async function deletePost(slug: string) {
  return db('posts').where('slug', slug).delete();
}
