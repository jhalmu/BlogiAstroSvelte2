import type { APIRoute } from 'astro';
import { verifyToken } from '../../../../../config/auth';
import { isAdmin } from '../../../../../utils/auth';
import db from '../../../../../db';

export const POST: APIRoute = async ({ request, params }) => {
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

    const { id } = params;
    if (!id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Activity ID is required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Update activity
    await db('suspicious_activities').where({ id }).update({
      resolved: true,
      resolved_by: userId,
      resolved_at: new Date(),
      updated_at: new Date(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Activity marked as resolved',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error resolving activity:', error);
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
