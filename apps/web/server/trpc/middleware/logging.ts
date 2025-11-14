import { middleware } from "../init";
import { logger } from "@/lib/logger";

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

