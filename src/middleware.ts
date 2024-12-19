import { defineMiddleware } from 'astro:middleware';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/api/auth/login',
  '/about',
  '/contact',
  '/subscribe',
  '/blog',  // Make the blog list public
  '/readme', // README.md page
  '/about-cascade', // AI Development Story page
];

export const onRequest = defineMiddleware(async ({ url, cookies, redirect }, next) => {
  const pathname = url.pathname;

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // If it's a public route, proceed without checking auth
  if (isPublicRoute) {
    return next();
  }

  // Check for authentication
  const session = cookies.get('session');
  if (!session || session.value !== 'authenticated') {
    return redirect('/login');
  }

  // If authenticated or public route, proceed
  return next();
});
