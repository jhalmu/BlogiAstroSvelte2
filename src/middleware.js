export function onRequest({ request, response }, next) {
  const url = new URL(request.url);
  
  // Add security and caching headers for RSS feed
  if (url.pathname === '/rss.xml') {
    return next().then((response) => {
      const newResponse = new Response(response.body, response);
      
      // Security headers
      newResponse.headers.set('X-Content-Type-Options', 'nosniff');
      newResponse.headers.set('X-Frame-Options', 'DENY');
      newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      newResponse.headers.set('Content-Type', 'application/rss+xml; charset=utf-8');
      
      // Caching headers - cache for 1 hour
      newResponse.headers.set('Cache-Control', 'public, max-age=3600');
      newResponse.headers.set('Surrogate-Control', 'public, max-age=3600');
      
      return newResponse;
    });
  }
  
  return next();
}
