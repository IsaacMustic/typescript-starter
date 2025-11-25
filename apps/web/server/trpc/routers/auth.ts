import { z } from "zod";
import { getServerSession } from "@/server/auth";
import { sendWelcomeEmail } from "@/server/services/email";
import { publicProcedure, router } from "../init";
import { analytics } from "../middleware/analytics";
import { errorHandling } from "../middleware/error-handling";
import { logging } from "../middleware/logging";
import { rateLimit } from "../middleware/rate-limit";

const protectedProcedure = publicProcedure
  .use(rateLimit)
  .use(analytics)
  .use(errorHandling)
  .use(logging);

export const authRouter = router({
  getSession: protectedProcedure.query(async () => {
    const session = await getServerSession();
    return session;
  }),

  signOut: protectedProcedure.mutation(async () => {
    // Sign out is handled by Better Auth client-side
    return { success: true };
  }),

  /**
   * Send welcome email after successful signup
   * Called from client after Better Auth signup succeeds
   */
  sendWelcomeEmail: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await sendWelcomeEmail(input.name, input.email);
        return { success: true };
      } catch (error) {
        // Don't fail signup if welcome email fails
        console.error("Failed to send welcome email:", error);
        return { success: false, error: "Failed to send welcome email" };
      }
    }),
});
