import type { APIRoute } from 'astro';
import { generateToken } from '../../../config/auth';
import { getUserByEmail, getAdminUsers } from '../../../utils/auth';
import { sendEmail } from '../../../utils/email';
import {
  generatePasswordResetEmail,
  generateAdminNotificationEmail,
} from '../../../utils/emailTemplates';
import { logActivity } from '../../../utils/activity';
import { passwordResetLimiter, checkRateLimit } from '../../../utils/rateLimit';
import db from '../../../db';
import crypto from 'crypto';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { email } = data;
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';

    if (!email) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email is required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Apply rate limiting
    try {
      await checkRateLimit(passwordResetLimiter, `${email}:${ipAddress}`);
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Too many password reset attempts. Please try again later.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...(error.headers || {}),
          },
        }
      );
    }

    // Get user
    const user = await getUserByEmail(email);
    if (!user) {
      // Return success even if user doesn't exist for security
      return new Response(
        JSON.stringify({
          success: true,
          message:
            'If an account exists with this email, you will receive password reset instructions',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token
    await db('users').where({ id: user.id }).update({
      reset_token: resetToken,
      reset_token_expires: resetTokenExpires,
    });

    // Send reset email
    const resetUrl = `${process.env.SITE_URL || 'http://localhost:4321'}/reset-password?token=${resetToken}`;
    const emailContent = generatePasswordResetEmail({
      name: user.name,
      resetUrl,
    });

    const emailResult = await sendEmail({
      to: user.email,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    if (!emailResult.success) {
      throw new Error('Failed to send password reset email');
    }

    // Log activity
    await logActivity(user.id, 'password_reset_request', 'Password reset requested', ipAddress);

    // Notify admins
    const adminUsers = await getAdminUsers();
    const timestamp = new Date().toISOString();
    const dashboardUrl = `${process.env.SITE_URL}/admin/users/${user.id}`;

    for (const admin of adminUsers) {
      const adminNotification = generateAdminNotificationEmail({
        adminName: admin.name,
        eventType: 'password_reset_request',
        eventDetails: {
          userEmail: user.email,
          timestamp,
          ipAddress,
        },
        dashboardUrl,
      });

      await sendEmail({
        to: admin.email,
        subject: adminNotification.subject,
        text: adminNotification.text,
        html: adminNotification.html,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message:
          'If an account exists with this email, you will receive password reset instructions',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in forgot password:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'An error occurred while processing your request',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
