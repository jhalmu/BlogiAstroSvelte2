import type { APIRoute } from 'astro';
import { getPosts, createPost } from '../../../db/utils';
import { PostSchema } from '../../../db/utils';

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = url.searchParams;
    const options = {
      draft: searchParams.get('draft') === 'true',
      tag: searchParams.get('tag') || undefined,
      limit: parseInt(searchParams.get('limit') || '10'),
      offset: parseInt(searchParams.get('offset') || '0'),
    };

    const posts = await getPosts(options);
    return new Response(JSON.stringify({ posts }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const validatedPost = PostSchema.parse(body);
    const post = await createPost(validatedPost);

    return new Response(JSON.stringify({ post }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create post' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
