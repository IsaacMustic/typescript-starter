import { router } from "./init";
import { authRouter } from "./routers/auth";
import { billingRouter } from "./routers/billing";
import { todoRouter } from "./routers/todo";
import { userRouter } from "./routers/user";

export const rootRouter = router({
  auth: authRouter,
  user: userRouter,
  todo: todoRouter,
  billing: billingRouter,
});

// Note: Middleware (logging, rateLimit) should be applied at the procedure level
// in each router using .use() on procedures, not on the router itself

export type AppRouter = typeof rootRouter;
