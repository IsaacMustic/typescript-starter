import { PostHog } from "posthog-node";
import { env } from "@/env";
import { middleware } from "../init";

// Initialize PostHog client for server-side tracking
const posthog =
  env.NEXT_PUBLIC_POSTHOG_KEY && env.NEXT_PUBLIC_POSTHOG_HOST
    ? new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
        host: env.NEXT_PUBLIC_POSTHOG_HOST,
        flushAt: 1, // Flush immediately for real-time tracking
        flushInterval: 0, // Disable interval flushing
      })
    : null;

/**
 * Analytics middleware for tRPC procedures
 * Tracks procedure calls, completions, and errors to PostHog
 */
export const analytics = middleware(async ({ ctx, next, path, type }) => {
  const start = Date.now();
  const userId = ctx.user?.id ?? ctx.session?.session?.id ?? "anonymous";

  // Track procedure call
  if (posthog) {
    posthog.capture({
      distinctId: userId,
      event: "trpc.procedure.called",
      properties: {
        path,
        type,
        userId: ctx.user?.id,
        isAuthenticated: !!ctx.user,
      },
    });
  }

  try {
    const result = await next();
    const duration = Date.now() - start;

    // Track successful completion
    if (posthog) {
      posthog.capture({
        distinctId: userId,
        event: "trpc.procedure.completed",
        properties: {
          path,
          type,
          duration,
          userId: ctx.user?.id,
          isAuthenticated: !!ctx.user,
        },
      });
    }

    return result;
  } catch (error) {
    const duration = Date.now() - start;

    // Track error
    if (posthog) {
      posthog.capture({
        distinctId: userId,
        event: "trpc.procedure.error",
        properties: {
          path,
          type,
          duration,
          userId: ctx.user?.id,
          isAuthenticated: !!ctx.user,
          errorName: error instanceof Error ? error.name : "Unknown",
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      });
    }

    // Re-throw error so error handling middleware can process it
    throw error;
  }
});
