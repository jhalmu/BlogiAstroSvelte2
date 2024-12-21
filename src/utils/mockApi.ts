import type { BlogPost } from '../types/blog';

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Mock data structure
interface MockPost {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  language: 'fi' | 'en';
  keyTerms?: {
    fi: string[];
    en: string[];
  };
}

// Mock API response type
interface ApiResponse<T> {
  data: T;
  error?: string;
  cached?: boolean;
}

// Helper to generate a cache key
function generateCacheKey(endpoint: string, params?: Record<string, any>): string {
  return `${endpoint}:${JSON.stringify(params || {})}`;
}

// Helper to check if cache is valid
function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION;
}

// Clear cache (useful for development)
export function clearCache(): void {
  cache.clear();
}

// Mock API call with caching
async function mockApiCall<T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<ApiResponse<T>> {
  const cacheKey = generateCacheKey(endpoint, params);

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && isCacheValid(cached.timestamp)) {
    return { data: cached.data, cached: true };
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    let data: any;

    switch (endpoint) {
      case '/api/posts':
        data = await getMockPosts(params);
        break;
      case '/api/posts/latest':
        data = await getLatestPosts(params?.limit || 5);
        break;
      case '/api/posts/by-author':
        data = await getPostsByAuthor(params?.author || '');
        break;
      default:
        throw new Error('Unknown endpoint');
    }

    // Cache the response
    cache.set(cacheKey, { data, timestamp: Date.now() });

    return { data };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

// Mock data generators
async function getMockPosts(params?: {
  language?: 'fi' | 'en';
  tag?: string;
  page?: number;
  limit?: number;
}): Promise<MockPost[]> {
  // Implementation will be added when we create mock data
  return [];
}

async function getLatestPosts(limit: number): Promise<MockPost[]> {
  const allPosts = await getMockPosts();
  return allPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

async function getPostsByAuthor(author: string): Promise<MockPost[]> {
  const allPosts = await getMockPosts();
  return allPosts.filter((post) => post.author.toLowerCase() === author.toLowerCase());
}

// Convert API post to markdown
export function convertToMarkdown(post: MockPost): string {
  const frontmatter = [
    '---',
    `title: "${post.title}"`,
    `date: "${post.date}"`,
    `author: "${post.author}"`,
    `tags: ${JSON.stringify(post.tags)}`,
    `language: "${post.language}"`,
    post.keyTerms ? `keyTerms: ${JSON.stringify(post.keyTerms)}` : '',
    '---',
    '',
    post.content,
  ]
    .filter(Boolean)
    .join('\n');

  return frontmatter;
}

// Public API
export const api = {
  getPosts: (params?: Parameters<typeof getMockPosts>[0]) =>
    mockApiCall<MockPost[]>('/api/posts', params),

  getLatestPosts: (limit: number = 5) => mockApiCall<MockPost[]>('/api/posts/latest', { limit }),

  getPostsByAuthor: (author: string) => mockApiCall<MockPost[]>('/api/posts/by-author', { author }),

  clearCache,
};

export type { MockPost, ApiResponse };