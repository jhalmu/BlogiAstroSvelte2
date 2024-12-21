import type { APIRoute } from 'astro';
import { generateToken } from '../../../config/auth';
import { checkRateLimit } from '../../../config/auth';
import { isDevMode } from '../../../config/database';
import { getUserByEmail, verifyPassword, updateLastLogin } from '../../../utils/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Get client IP for rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';

    // Check rate limit
    try {
      await checkRateLimit(clientIp);
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Too many login attempts. Please try again later.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    // Log for debugging in development mode
    if (isDevMode()) {
      console.log('Login attempt:', { email });
    }

    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email and password are required',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Special case for development mode
    if (isDevMode() && email === 'admin@example.com' && password === 'password') {
      const token = generateToken('dev-admin');
      cookies.set('auth_token', token, {
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Login successful',
          token,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Get user from database
    const user = await getUserByEmail(email);
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid email or password',
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid email or password',
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Check if user is active
    if (!user.is_active) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Account is inactive. Please contact administrator.',
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Update last login time
    await updateLastLogin(user.id);

    // Generate JWT token
    const token = generateToken(user.id);

    // Set JWT in secure cookie
    cookies.set('auth_token', token, {
      path: '/',
      httpOnly: true,
      secure: !isDevMode(),
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: isDevMode() ? error.message : 'An error occurred during login',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
