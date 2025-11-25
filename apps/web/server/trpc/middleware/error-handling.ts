import * as Sentry from "@sentry/nextjs";
import { TRPCError } from "@trpc/server";
import { env } from "@/env";
import { middleware } from "../init";

/**
 * Error handling middleware for tRPC procedures
 * Captures errors to Sentry with context
 */
export const errorHandling = middleware(async ({ ctx, next, path, type, input }) => {
  // Set user context in Sentry if authenticated
  if (ctx.user && env.SENTRY_DSN) {
    Sentry.setUser({
      id: ctx.user.id,
      email: ctx.user.email ?? undefined,
      username: ctx.user.name ?? undefined,
    });
  }

  // Add breadcrumb for procedure call
  if (env.SENTRY_DSN) {
    Sentry.addBreadcrumb({
      category: "trpc",
      message: `Calling ${type} ${path}`,
      level: "info",
      data: {
        path,
        type,
        userId: ctx.user?.id,
      },
    });
  }

  try {
    const result = await next();
    return result;
  } catch (error) {
    // Only capture to Sentry if Sentry is configured
    if (env.SENTRY_DSN) {
      // Sanitize input data to avoid logging sensitive information
      const sanitizedInput = sanitizeInput(input);

      Sentry.captureException(error, {
        tags: {
          path,
          type,
          errorType: error instanceof TRPCError ? error.code : "UNKNOWN",
        },
        contexts: {
          trpc: {
            path,
            type,
            input: sanitizedInput,
            userId: ctx.user?.id,
            isAuthenticated: !!ctx.user,
          },
        },
        level:
          error instanceof TRPCError && error.code === "INTERNAL_SERVER_ERROR"
            ? "error"
            : "warning",
      });
    }

    // Re-throw error so it can be handled by error formatter
    throw error;
  }
});

/**
 * Sanitize input data to remove sensitive fields
 */
function sanitizeInput(input: unknown): unknown {
  if (!input || typeof input !== "object") {
    return input;
  }

  const sensitiveFields = ["password", "token", "secret", "apiKey", "accessToken", "refreshToken"];

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeInput(item));
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (sensitiveFields.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
