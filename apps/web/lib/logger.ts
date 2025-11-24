import pino from "pino";
import { env } from "@/env";

export const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  formatters: {
    level: (label) => ({ level: label }),
  },
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
});
