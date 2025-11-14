import { router, publicProcedure } from "../init";
import { isAuthenticated } from "../middleware/auth";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import {
  subscriptions,
  invoices,
  products,
  users,
  todos,
} from "@/server/db/schema";
import { eq, count } from "drizzle-orm";
import { createOrGetStripeCustomer } from "@/server/services/stripe";
import { env } from "@/env";

const protectedProcedure = publicProcedure.use(isAuthenticated);

export const billingRouter = router({
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    const subscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, ctx.user.id),
    });

    return subscription;
  }),

  getPlans: publicProcedure.query(async () => {
    const plans = await db.query.products.findMany({
      where: eq(products.active, true),
      orderBy: [products.price],
    });

    return plans;
  }),

  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        priceId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!stripe) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Stripe is not configured",
        });
      }

      if (!ctx.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      const user = await db.query.users.findFirst({
        where: eq(users.id, ctx.user.id),
      });

      if (!user || !user.email) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const customerId = await createOrGetStripeCustomer(
        user.id,
        user.email,
      );

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
          {
            price: input.priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
        cancel_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
        metadata: {
          userId: user.id,
        },
      });

      return { url: session.url };
    }),

  createPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    if (!stripe) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Stripe is not configured",
      });
    }

    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
    });

    if (!user?.stripeCustomerId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No Stripe customer found",
      });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    });

    return { url: session.url };
  }),

  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    if (!stripe) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Stripe is not configured",
      });
    }

    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    const subscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, ctx.user.id),
    });

    if (!subscription) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No active subscription found",
      });
    }

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await db
      .update(subscriptions)
      .set({
        cancelAtPeriodEnd: true,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, subscription.id));

    return { success: true };
  }),

  reactivateSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    if (!stripe) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Stripe is not configured",
      });
    }

    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    const subscription = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, ctx.user.id),
    });

    if (!subscription) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No subscription found",
      });
    }

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    await db
      .update(subscriptions)
      .set({
        cancelAtPeriodEnd: false,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, subscription.id));

    return { success: true };
  }),

  getInvoices: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    const invoiceList = await db.query.invoices.findMany({
      where: eq(invoices.userId, ctx.user.id),
      orderBy: [invoices.createdAt],
    });

    return invoiceList;
  }),

  getUsage: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    const todoCount = await db
      .select({ count: count() })
      .from(todos)
      .where(eq(todos.userId, ctx.user.id));

    return {
      todos: todoCount[0]?.count ?? 0,
    };
  }),
});
