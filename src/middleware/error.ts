import { defineMiddleware } from 'astro:middleware';
import { isDevMode } from '../config/database';

export const errorMiddleware = defineMiddleware(async (context, next) => {
  try {
    const response = await next();
    return response;
  } catch (error) {
    console.error('API Error:', error);

    const errorMessage = isDevMode() ? error.message : 'An internal server error occurred';

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
