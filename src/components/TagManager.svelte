<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '../utils/api';

  let tags = [];
  let loading = true;
  let error = null;
  let newTagName = '';

  onMount(async () => {
    try {
      const response = await api.posts.list();
      // Extract unique tags from posts
      const allTags = response.posts
        .flatMap((post) => post.tags || [])
        .filter((tag, index, self) => self.indexOf(tag) === index)
        .sort();
      tags = allTags;
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });

  async function addTag() {
    if (!newTagName.trim()) return;

    try {
      // Add tag to list if it doesn't exist
      if (!tags.includes(newTagName.trim())) {
        tags = [...tags, newTagName.trim()].sort();
      }
      newTagName = '';
    } catch (e) {
      error = e.message;
    }
  }

  function removeTag(tagToRemove: string) {
    tags = tags.filter((tag) => tag !== tagToRemove);
  }
</script>

<div class="space-y-4">
  <h2 class="text-lg font-semibold text-gray-900">Manage Tags</h2>

  {#if loading}
    <div class="text-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700 mx-auto"></div>
    </div>
  {:else if error}
    <div class="bg-red-50 p-4 rounded-lg text-red-700">
      {error}
    </div>
  {:else}
    <div class="flex flex-wrap gap-2">
      {#each tags as tag}
        <div
          class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
        >
          {tag}
          <button
            type="button"
            on:click={() => removeTag(tag)}
            class="ml-2 text-purple-600 hover:text-purple-900"
          >
            ×
          </button>
        </div>
      {/each}
    </div>

    <div class="flex gap-2">
      <input
        type="text"
        bind:value={newTagName}
        placeholder="New tag name"
        class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
      />
      <button
        type="button"
        on:click={addTag}
        class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
      >
        Add Tag
      </button>
    </div>
  {/if}
</div>
