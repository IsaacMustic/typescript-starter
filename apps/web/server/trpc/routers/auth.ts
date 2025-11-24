import { getServerSession } from "@/server/auth";
import { publicProcedure, router } from "../init";
import { logging } from "../middleware/logging";
import { rateLimit } from "../middleware/rate-limit";

const protectedProcedure = publicProcedure.use(rateLimit).use(logging);

export const authRouter = router({
  getSession: protectedProcedure.query(async () => {
    const session = await getServerSession();
    return session;
  }),

  signOut: protectedProcedure.mutation(async () => {
    // Sign out is handled by Better Auth client-side
    return { success: true };
  }),
});
