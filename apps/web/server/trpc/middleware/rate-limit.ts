import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { TRPCError } from "@trpc/server";
import { middleware } from "../init";
import { env } from "@/env";

const redis =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      analytics: true,
    })
  : null;

export const rateLimit = middleware(async ({ ctx, next, path }) => {
  if (!ratelimit) {
    // If rate limiting is not configured, allow the request
    return next();
  }

  const identifier = ctx.user?.id ?? ctx.session?.session?.id ?? "anonymous";

  const { success, limit, remaining, reset } = await ratelimit.limit(
    `${path}:${identifier}`,
  );

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

