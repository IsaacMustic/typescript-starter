import { router, publicProcedure } from "../init";
import { getServerSession } from "@/server/auth";

export const authRouter = router({
  getSession: publicProcedure.query(async () => {
    const session = await getServerSession();
    return session;
  }),

  signOut: publicProcedure.mutation(async () => {
    // Sign out is handled by Better Auth client-side
    return { success: true };
  }),
});

