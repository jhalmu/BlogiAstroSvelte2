import type { APIRoute } from 'astro';
import { verifyToken } from '../../../../config/auth';
import { isAdmin } from '../../../../utils/auth';
import db from '../../../../db';

export const GET: APIRoute = async ({ request }) => {
  try {
    // Verify JWT token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Unauthorized',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const token = authHeader.split(' ')[1];
    const userId = await verifyToken(token);

    // Get user making the request
    const user = await db('users').where({ id: userId }).first();

    if (!user || !isAdmin(user)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Unauthorized',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get query parameters
    const url = new URL(request.url);
    const timeRange = url.searchParams.get('timeRange') || '24h';
    const type = url.searchParams.get('type') || 'all';

    // Calculate time window
    let timeWindow = new Date();
    switch (timeRange) {
      case '7d':
        timeWindow.setDate(timeWindow.getDate() - 7);
        break;
      case '30d':
        timeWindow.setDate(timeWindow.getDate() - 30);
        break;
      default: // 24h
        timeWindow.setDate(timeWindow.getDate() - 1);
    }

    // Build queries
    let suspiciousActivitiesQuery = db('suspicious_activities')
      .join('users', 'suspicious_activities.user_id', 'users.id')
      .select('suspicious_activities.*', 'users.email as user_email')
      .where('suspicious_activities.created_at', '>', timeWindow)
      .orderBy('suspicious_activities.created_at', 'desc');

    let securityEventsQuery = db('security_events')
      .join('users', 'security_events.user_id', 'users.id')
      .select('security_events.*', 'users.email as user_email')
      .where('security_events.created_at', '>', timeWindow)
      .orderBy('security_events.created_at', 'desc');

    // Apply type filter
    if (type !== 'all') {
      suspiciousActivitiesQuery = suspiciousActivitiesQuery.where('activity_type', type);
      securityEventsQuery = securityEventsQuery.where('event_type', type);
    }

    // Execute queries
    const [suspiciousActivities, securityEvents] = await Promise.all([
      suspiciousActivitiesQuery,
      securityEventsQuery,
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        suspiciousActivities,
        securityEvents,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching security data:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
