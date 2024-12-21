import { api, clearCache, type MockPost } from '../src/utils/mockApi';

async function testApi() {
  console.log('Testing Mock API...\n');

  // Test getting all posts
  console.log('Getting all posts...');
  const allPosts = await api.getPosts();
  console.log(`Retrieved ${allPosts.data?.length || 0} posts\n`);

  // Test getting latest posts
  console.log('Getting latest 3 posts...');
  const latestPosts = await api.getLatestPosts(3);
  console.log(`Retrieved ${latestPosts.data?.length || 0} latest posts\n`);

  // Test getting posts by author
  console.log('Getting posts by Juha Halmu...');
  const authorPosts = await api.getPostsByAuthor('Juha Halmu');
  console.log(`Retrieved ${authorPosts.data?.length || 0} posts by author\n`);

  // Test caching
  console.log('Testing cache...');
  const cachedPosts = await api.getPosts();
  console.log(`Cache hit: ${cachedPosts.cached ? 'Yes' : 'No'}\n`);

  // Test cache clearing
  console.log('Clearing cache...');
  clearCache();
  const freshPosts = await api.getPosts();
  console.log(`Cache hit after clearing: ${freshPosts.cached ? 'Yes' : 'No'}\n`);

  console.log('API tests completed!');
}

testApi().catch(console.error);
