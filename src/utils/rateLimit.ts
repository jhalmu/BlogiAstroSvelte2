import { RateLimiterMemory } from 'rate-limiter-flexible';

// Rate limiter for login attempts
export const loginLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 60 * 15, // per 15 minutes
  blockDuration: 60 * 60, // Block for 1 hour
});

// Rate limiter for password reset requests
export const passwordResetLimiter = new RateLimiterMemory({
  points: 3, // 3 attempts
  duration: 60 * 60, // per hour
  blockDuration: 60 * 60 * 24, // Block for 24 hours
});

// Rate limiter for email sending
export const emailLimiter = new RateLimiterMemory({
  points: 10, // 10 emails
  duration: 60 * 60, // per hour
  blockDuration: 60 * 60, // Block for 1 hour
});

export async function checkRateLimit(limiter: RateLimiterMemory, key: string): Promise<void> {
  try {
    await limiter.consume(key);
  } catch (error) {
    const retryAfter = Math.ceil(error.msBeforeNext / 1000);
    error.status = 429;
    error.headers = {
      'Retry-After': String(retryAfter),
    };
    throw error;
  }
}
