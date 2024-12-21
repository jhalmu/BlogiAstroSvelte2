import type { APIRoute } from 'astro';
import { createUser, UserSchema } from '../../../utils/auth';
import { isAdmin } from '../../../utils/auth';
import { verifyToken } from '../../../config/auth';
import db from '../../../db';

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
    const requestingUser = await db('users').where({ id: userId }).first();
    if (!requestingUser || !isAdmin(requestingUser)) {
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

    // Get all users
    const users = await db('users')
      .select(['id', 'email', 'name', 'role', 'is_active', 'last_login', 'created_at'])
      .orderBy('created_at', 'desc');

    return new Response(
      JSON.stringify({
        success: true,
        users,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
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
    const requestingUser = await db('users').where({ id: userId }).first();
    if (!requestingUser || !isAdmin(requestingUser)) {
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

    // Validate user data
    const validatedData = UserSchema.parse(data);

    // Check if email already exists
    const existingUser = await db('users').where({ email: validatedData.email }).first();
    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email already exists',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Create new user
    const user = await createUser(validatedData);

    return new Response(
      JSON.stringify({
        success: true,
        user,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating user:', error);
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
