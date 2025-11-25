import { randomBytes } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { env } from "@/env";
import { users, verificationTokens } from "@/server/db/schema";
import { sendVerificationEmail } from "@/server/services/email";
import { publicProcedure, router } from "../init";
import { analytics } from "../middleware/analytics";
import { isAuthenticated } from "../middleware/auth";
import { errorHandling } from "../middleware/error-handling";
import { logging } from "../middleware/logging";
import { rateLimit } from "../middleware/rate-limit";

const protectedProcedure = publicProcedure
  .use(isAuthenticated)
  .use(rateLimit)
  .use(analytics)
  .use(errorHandling)
  .use(logging);

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

      // Don't update if it's the same email
      if (input.email === ctx.user.email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "New email must be different from current email",
        });
      }

      // Generate verification token
      const token = randomBytes(32).toString("hex");
      const expires = new Date();
      expires.setHours(expires.getHours() + 24); // Token expires in 24 hours

      // Store verification token with new email as identifier
      await ctx.db.insert(verificationTokens).values({
        identifier: `${ctx.user.id}:${input.email}`, // Use user ID and new email as identifier
        token,
        expires,
      });

      // Send verification email
      const verificationUrl = `${env.NEXT_PUBLIC_APP_URL}/verify-email-change?token=${token}&email=${encodeURIComponent(input.email)}`;
      await sendVerificationEmail(input.email, verificationUrl);

      return {
        success: true,
        message: "Verification email sent. Please check your new email address.",
      };
    }),

  verifyEmailChange: protectedProcedure
    .input(
      z.object({
        token: z.string().min(1),
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

      // Find verification token
      const verification = await ctx.db.query.verificationTokens.findFirst({
        where: eq(verificationTokens.token, input.token),
      });

      if (!verification) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid verification token",
        });
      }

      // Check if token is expired
      if (verification.expires < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Verification token has expired",
        });
      }

      // Verify identifier matches user ID and email
      const expectedIdentifier = `${ctx.user.id}:${input.email}`;
      if (verification.identifier !== expectedIdentifier) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid verification token",
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

      // Update user email
      const [updatedUser] = await ctx.db
        .update(users)
        .set({
          email: input.email,
          emailVerified: true,
          updatedAt: new Date(),
        })
        .where(eq(users.id, ctx.user.id))
        .returning();

      // Delete verification token
      await ctx.db.delete(verificationTokens).where(eq(verificationTokens.token, input.token));

      return {
        success: true,
        user: updatedUser,
        message: "Email address updated successfully",
      };
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
