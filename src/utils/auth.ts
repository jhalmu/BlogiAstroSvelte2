import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../db';
import { z } from 'zod';
import crypto from 'crypto';

// User validation schema
export const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(['admin', 'author']).default('author'),
  is_active: z.boolean().default(true),
});

export type User = z.infer<typeof UserSchema>;

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getUserByEmail(email: string) {
  return db('users').where({ email }).first();
}

export async function getAdminUsers() {
  return db('users').where({ role: 'admin', is_active: true });
}

export function isAdmin(user: any): boolean {
  return user?.role === 'admin';
}

export function generateJWT(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'default_jwt_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
}

export async function verifyJWT(token: string): Promise<string> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret') as {
      userId: string;
    };
    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export async function validateUserCredentials(email: string, password: string) {
  const user = await getUserByEmail(email);

  if (!user || !user.is_active) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await verifyPassword(password, user.password_hash);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  return user;
}

export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

export async function validateResetToken(token: string) {
  const user = await db('users')
    .where('reset_token', token)
    .where('reset_token_expires', '>', new Date())
    .first();

  if (!user) {
    throw new Error('Invalid or expired reset token');
  }

  return user;
}

export async function createUser(userData: User): Promise<Omit<User, 'password'>> {
  const validatedUser = UserSchema.parse(userData);
  const password_hash = await hashPassword(validatedUser.password);

  const [user] = await db('users')
    .insert({
      ...validatedUser,
      password_hash,
    })
    .returning(['id', 'email', 'name', 'role', 'is_active']);

  return user;
}

export async function updateUser(
  id: string,
  userData: Partial<User>
): Promise<Omit<User, 'password'>> {
  const updates: any = { ...userData };

  if (userData.password) {
    updates.password_hash = await hashPassword(userData.password);
    delete updates.password;
  }

  const [user] = await db('users')
    .where({ id })
    .update(updates)
    .returning(['id', 'email', 'name', 'role', 'is_active']);

  return user;
}

export async function updateLastLogin(id: string): Promise<void> {
  await db('users').where({ id }).update({ last_login: new Date() });
}

export function canEditPost(user: User, post: any): boolean {
  return isAdmin(user) || post.user_id === user.id;
}
