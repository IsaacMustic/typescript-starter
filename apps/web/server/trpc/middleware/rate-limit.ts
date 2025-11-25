import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/env";
import { middleware } from "../init";

const redis =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

/**
 * Create a rate limiter with specified limits
 * @param requests - Number of requests allowed
 * @param seconds - Time window in seconds
 * @returns Ratelimit instance or null if Redis is not configured
 */
const createRateLimiter = (requests: number, seconds: number) => {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, `${seconds} s`),
    analytics: true,
  });
};

const authRateLimit = createRateLimiter(5, 60); // 5 requests per minute for auth
const apiRateLimit = createRateLimiter(100, 60); // 100 requests per minute for API

/**
 * Rate limiting middleware for tRPC procedures
 * Applies different rate limits based on procedure path:
 * - Auth endpoints: 5 requests/minute
 * - API endpoints: 100 requests/minute (authenticated)
 * - Public endpoints: 100 requests/minute
 *
 * If rate limiting is not configured (Redis unavailable), requests are allowed through.
 * Rate limit information is added to context for response headers.
 */
export const rateLimit = middleware(async ({ ctx, next, path }) => {
  // Determine which rate limiter to use based on path
  const isAuthPath = path.startsWith("auth.");
  const ratelimit = isAuthPath ? authRateLimit : apiRateLimit;

  if (!ratelimit) {
    // If rate limiting is not configured, allow the request
    return next();
  }

  const identifier = ctx.user?.id ?? ctx.session?.session?.id ?? "anonymous";

  const { success, limit, remaining, reset } = await ratelimit.limit(`${path}:${identifier}`);

  if (!success) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Rate limit exceeded. Please try again later.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      rateLimit: {
        limit,
        remaining,
        reset,
      },
    },
  });
});
