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

// Different rate limits for different endpoint types
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
