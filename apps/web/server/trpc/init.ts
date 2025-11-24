import { initTRPC, TRPCError } from "@trpc/server";
import { type Context, createContext } from "./context";

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        code: error.code,
        httpStatus: error.cause instanceof TRPCError ? error.cause.code : 500,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

export { createContext };
