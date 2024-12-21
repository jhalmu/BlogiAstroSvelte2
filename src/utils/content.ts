import type { CollectionEntry } from 'astro:content';
import type { BlogPost, Page } from '../types/content';

export function validateBlogPost(
  post: CollectionEntry<'blog'>
): post is CollectionEntry<'blog'> & { data: BlogPost } {
  const { data } = post;

  // Check required fields
  if (!data.title) {
    console.error(`Blog post validation failed for ${post.id}: missing title`);
    return false;
  }

  // Validate date format if present
  if (data.date) {
    try {
      new Date(data.date).toISOString();
    } catch (e) {
      console.error(`Invalid date format in ${post.id}:`, data.date);
      return false;
    }
  }

  // Validate tags if present
  if (
    data.tags &&
    (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== 'string'))
  ) {
    console.error(`Invalid tags in ${post.id}:`, data.tags);
    return false;
  }

  // Validate slug
  if (!post.slug || typeof post.slug !== 'string' || post.slug.trim() === '') {
    console.error(`Invalid or missing slug in ${post.id}`);
    return false;
  }

  console.log(`Blog post validated successfully: ${post.slug}`);
  return true;
}

export function validatePage(
  page: CollectionEntry<'pages'>
): page is CollectionEntry<'pages'> & { data: Page } {
  const { data } = page;

  // Check required fields
  if (!data.title) {
    console.error(`Page validation failed for ${page.id}:`, { data });
    return false;
  }

  return true;
}

export function sortBlogPosts(posts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[] {
  return posts.sort((a, b) => {
    const dateA = new Date(a.data.date || new Date());
    const dateB = new Date(b.data.date || new Date());
    return dateB.getTime() - dateA.getTime();
  });
}

export function getAllTags(posts: CollectionEntry<'blog'>[]): { name: string; count: number }[] {
  const tagCounts = posts.reduce<Record<string, number>>((acc, post) => {
    if (Array.isArray(post.data.tags)) {
      post.data.tags.forEach((tag: string) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
    }
    return acc;
  }, {});

  return Object.entries(tagCounts)
    .map((entry): { name: string; count: number } => ({
      name: entry[0],
      count: entry[1],
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getRelatedPosts(
  currentPost: CollectionEntry<'blog'>,
  allPosts: CollectionEntry<'blog'>[],
  limit = 3
): CollectionEntry<'blog'>[] {
  if (!currentPost.data.tags || !Array.isArray(currentPost.data.tags)) {
    return allPosts.filter((post) => post.id !== currentPost.id).slice(0, limit);
  }

  return allPosts
    .filter((post) => post.id !== currentPost.id)
    .map((post) => ({
      post,
      commonTags: (post.data.tags || []).filter((tag: string) =>
        (currentPost.data.tags || []).includes(tag)
      ).length,
    }))
    .sort((a, b) => b.commonTags - a.commonTags)
    .slice(0, limit)
    .map(({ post }) => post);
}
