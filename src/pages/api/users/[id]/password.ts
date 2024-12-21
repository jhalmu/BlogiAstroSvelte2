import type { APIRoute } from 'astro';
import { verifyToken } from '../../../../config/auth';
import { verifyPassword, hashPassword } from '../../../../utils/auth';
import { logActivity } from '../../../../utils/activity';
import db from '../../../../db';

export const PUT: APIRoute = async ({ request, params }) => {
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

    // Only allow users to change their own password
    if (requestingUserId !== id) {
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

    const data = await request.json();
    const { currentPassword, newPassword } = data;

    if (!currentPassword || !newPassword) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Current password and new password are required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get user
    const user = await db('users').where({ id }).first();
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User not found',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Current password is incorrect',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Update password
    const password_hash = await hashPassword(newPassword);
    await db('users').where({ id }).update({
      password_hash,
      updated_at: new Date(),
    });

    // Log activity
    await logActivity(
      id,
      'password_reset',
      'Password changed successfully',
      request.headers.get('x-forwarded-for') || 'unknown'
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Password updated successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error updating password:', error);
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
