import type { APIRoute } from 'astro';
import { hashPassword } from '../../../utils/auth';
import { logActivity } from '../../../utils/activity';
import db from '../../../db';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { token, password } = data;

    if (!token || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Token and password are required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Find user with valid reset token
    const user = await db('users')
      .where('reset_token', token)
      .where('reset_token_expires', '>', new Date())
      .first();

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid or expired reset token',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Hash new password
    const password_hash = await hashPassword(password);

    // Update user
    await db('users').where({ id: user.id }).update({
      password_hash,
      reset_token: null,
      reset_token_expires: null,
      updated_at: new Date(),
    });

    // Log activity
    await logActivity(
      user.id,
      'password_reset',
      'Password reset completed',
      request.headers.get('x-forwarded-for') || 'unknown'
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Password has been reset successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in reset password:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'An error occurred while resetting your password',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
