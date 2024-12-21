import jwt from 'jsonwebtoken';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { isDevMode } from './database';

// Rate limiter configuration
export const rateLimiter = new RateLimiterMemory({
  points: 10, // Number of points
  duration: 1, // Per second
  blockDuration: 60 * 15, // Block for 15 minutes
});

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export async function verifyToken(token: string): Promise<any> {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Rate limiting middleware
export async function checkRateLimit(ip: string): Promise<void> {
  try {
    await rateLimiter.consume(ip);
  } catch (error) {
    throw new Error('Too many requests');
  }
}
