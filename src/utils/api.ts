import { isDevMode } from '../config/database';

const API_BASE = isDevMode() ? 'http://localhost:4321/api' : '/api';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export const api = {
  posts: {
    list: (params = {}) => {
      const searchParams = new URLSearchParams(params);
      return fetchApi(`/posts?${searchParams}`);
    },
    get: (slug: string) => fetchApi(`/posts/${slug}`),
    create: (data: any) =>
      fetchApi('/posts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (slug: string, data: any) =>
      fetchApi(`/posts/${slug}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (slug: string) =>
      fetchApi(`/posts/${slug}`, {
        method: 'DELETE',
      }),
  },
};
