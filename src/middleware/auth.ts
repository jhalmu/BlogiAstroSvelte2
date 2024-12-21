import { defineMiddleware } from 'astro:middleware';
import { isDevMode } from '../config/database';

export const authMiddleware = defineMiddleware(async (context, next) => {
  const isApiRoute = context.url.pathname.startsWith('/api/');
  const isWriteOperation = ['POST', 'PUT', 'DELETE'].includes(context.request.method);

  // Skip auth for non-API routes and GET requests
  if (!isApiRoute || !isWriteOperation) {
    return next();
  }

  try {
    const authHeader = context.request.headers.get('Authorization');

    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // In development, accept a simple token
    if (isDevMode() && authHeader === `Bearer ${process.env.DEV_API_KEY}`) {
      return next();
    }

    // In production, verify JWT token
    if (!isDevMode()) {
      // TODO: Implement proper JWT verification
      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new Error('Invalid token');
      }
    }

    return next();
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Authentication failed' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
