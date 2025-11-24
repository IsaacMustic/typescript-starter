import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { users } from "@/server/db/schema";
import { publicProcedure, router } from "../init";
import { isAuthenticated } from "../middleware/auth";
import { logging } from "../middleware/logging";
import { rateLimit } from "../middleware/rate-limit";

const protectedProcedure = publicProcedure.use(isAuthenticated).use(rateLimit).use(logging);

export const userRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).optional(),
        image: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const [updatedUser] = await ctx.db
        .update(users)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(users.id, ctx.user.id))
        .returning();

      return updatedUser;
    }),

  changeEmail: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      // Check if email is already in use
      const existingUser = await ctx.db.query.users.findFirst({
        where: eq(users.email, input.email),
      });

      if (existingUser && existingUser.id !== ctx.user.id) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email is already in use",
        });
      }

      // For now, update email directly
      // In production, you would:
      // 1. Generate a verification token
      // 2. Store it in a verification table
      // 3. Send verification email
      // 4. Update email only after verification
      const [updatedUser] = await ctx.db
        .update(users)
        .set({
          email: input.email,
          emailVerified: false, // Require re-verification
          updatedAt: new Date(),
        })
        .where(eq(users.id, ctx.user.id))
        .returning();

      // Note: In a full implementation, you would send a verification email here
      // using sendVerificationEmail from the email service

      return updatedUser;
    }),

  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    await ctx.db.delete(users).where(eq(users.id, ctx.user.id));

    return { success: true };
  }),
});
