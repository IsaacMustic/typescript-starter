import { logger } from "@/lib/logger";
import { middleware } from "../init";

/**
 * Logging middleware for tRPC procedures
 * Logs procedure calls with:
 * - Procedure path and type
 * - User ID (if authenticated)
 * - Input data (for mutations only)
 * - Duration and success status
 *
 * Uses Pino logger for structured JSON logging.
 */
export const logging = middleware(async ({ ctx, next, path, type, input }) => {
  const start = Date.now();

  logger.info({
    path,
    type,
    userId: ctx.user?.id,
    input: type === "mutation" ? input : undefined,
  });

  const result = await next();

  const duration = Date.now() - start;

  logger.info({
    path,
    type,
    duration,
    userId: ctx.user?.id,
    success: true,
  });

  return result;
});
