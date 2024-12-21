import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing entries
  await knex('posts_tags').del();
  await knex('tags').del();
  await knex('posts').del();

  // Insert sample tags
  const tagIds = await knex('tags')
    .insert([
      { name: 'astro' },
      { name: 'svelte' },
      { name: 'web-development' },
      { name: 'typescript' },
    ])
    .returning('id');

  // Insert sample posts
  const posts = await knex('posts')
    .insert([
      {
        title: 'Getting Started with Astro',
        slug: 'getting-started-with-astro',
        content: '# Getting Started with Astro\n\nAstro is a modern static site builder...',
        excerpt: 'Learn how to build fast websites with Astro',
        date: new Date(),
        tags: JSON.stringify(['astro', 'web-development']),
      },
      {
        title: 'Why Svelte is Amazing',
        slug: 'why-svelte-is-amazing',
        content: '# Why Svelte is Amazing\n\nSvelte offers a fresh perspective...',
        excerpt: 'Discover the benefits of using Svelte',
        date: new Date(),
        tags: JSON.stringify(['svelte', 'web-development']),
      },
    ])
    .returning('id');

  // Create post-tag relationships
  const postTagRelations = [];
  for (const post of posts) {
    const postTags = JSON.parse(post.tags);
    const relevantTagIds = tagIds.filter((tag) => postTags.includes(tag.name)).map((tag) => tag.id);

    for (const tagId of relevantTagIds) {
      postTagRelations.push({
        post_id: post.id,
        tag_id: tagId,
      });
    }
  }

  await knex('posts_tags').insert(postTagRelations);
}
