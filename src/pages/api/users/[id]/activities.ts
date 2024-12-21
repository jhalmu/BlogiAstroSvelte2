import type { APIRoute } from 'astro';
import { verifyToken } from '../../../../config/auth';
import { getUserActivities } from '../../../../utils/activity';
import { isAdmin } from '../../../../utils/auth';
import db from '../../../../db';

export const GET: APIRoute = async ({ request, params }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User ID is required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

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
    const requestingUserId = await verifyToken(token);

    // Get user making the request
    const requestingUser = await db('users').where({ id: requestingUserId }).first();

    // Only allow users to view their own activities unless they're an admin
    if (!requestingUser || (requestingUserId !== id && !isAdmin(requestingUser))) {
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

    const activities = await getUserActivities(id);

    return new Response(
      JSON.stringify({
        success: true,
        activities,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'Internal server error',
      }),
      {
        status: error.status || 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
