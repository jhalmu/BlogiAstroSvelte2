<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Post } from '../db/utils';

  export let post: Partial<Post> = {
    title: '',
    content: '',
    excerpt: '',
    tags: [],
    draft: false,
  };

  const dispatch = createEventDispatcher();
  let tagInput = '';

  function addTag() {
    if (tagInput.trim() && !post.tags.includes(tagInput.trim())) {
      post.tags = [...post.tags, tagInput.trim()];
      tagInput = '';
    }
  }

  function removeTag(tag: string) {
    post.tags = post.tags.filter((t) => t !== tag);
  }

  function handleSubmit() {
    dispatch('save', post);
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
  <div>
    <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
    <input
      type="text"
      id="title"
      bind:value={post.title}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
      required
    />
  </div>

  <div>
    <label for="excerpt" class="block text-sm font-medium text-gray-700">Excerpt</label>
    <textarea
      id="excerpt"
      bind:value={post.excerpt}
      rows="3"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
    ></textarea>
  </div>

  <div>
    <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
    <textarea
      id="content"
      bind:value={post.content}
      rows="10"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
      required
    ></textarea>
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700">Tags</label>
    <div class="flex gap-2 flex-wrap mt-2">
      {#each post.tags as tag}
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
        >
          {tag}
          <button
            type="button"
            on:click={() => removeTag(tag)}
            class="ml-1 text-purple-600 hover:text-purple-900"
          >
            ×
          </button>
        </span>
      {/each}
    </div>
    <div class="mt-2 flex gap-2">
      <input
        type="text"
        bind:value={tagInput}
        placeholder="Add a tag"
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
      />
      <button
        type="button"
        on:click={addTag}
        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
      >
        Add
      </button>
    </div>
  </div>

  <div class="flex items-center">
    <input
      type="checkbox"
      id="draft"
      bind:checked={post.draft}
      class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
    />
    <label for="draft" class="ml-2 block text-sm text-gray-900">Save as draft</label>
  </div>

  <div class="flex justify-end">
    <button
      type="submit"
      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
    >
      Save Post
    </button>
  </div>
</form>
