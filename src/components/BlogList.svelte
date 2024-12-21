<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '../utils/api';
  import type { Post } from '../db/utils';

  let posts: Post[] = [];
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const response = await api.posts.list();
      posts = response.posts;
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });
</script>

<div class="space-y-8">
  {#if loading}
    <div class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
    </div>
  {:else if error}
    <div class="bg-red-50 p-4 rounded-lg text-red-700">
      {error}
    </div>
  {:else if posts.length === 0}
    <div class="text-center py-8 text-gray-500">No posts found</div>
  {:else}
    {#each posts as post}
      <article class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h2 class="text-2xl font-bold text-purple-900 mb-2">
          <a href="/blog/{post.slug}" class="hover:text-purple-700">
            {post.title}
          </a>
        </h2>
        {#if post.excerpt}
          <p class="text-gray-600 mb-4">{post.excerpt}</p>
        {/if}
        <div class="flex justify-between items-center text-sm text-gray-500">
          <time datetime={post.date.toISOString()}>
            {new Date(post.date).toLocaleDateString()}
          </time>
          {#if post.tags && post.tags.length > 0}
            <div class="flex gap-2">
              {#each post.tags as tag}
                <span class="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                  {tag}
                </span>
              {/each}
            </div>
          {/if}
        </div>
      </article>
    {/each}
  {/if}
</div>
