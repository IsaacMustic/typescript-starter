import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { invoices, subscriptions, users } from "@/server/db/schema";

export async function createOrGetStripeCustomer(userId: string, email: string): Promise<string> {
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  });

  await db.update(users).set({ stripeCustomerId: customer.id }).where(eq(users.id, userId));

  return customer.id;
}

export async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  if (!session.customer || !session.subscription) {
    return;
  }

  const customerId = typeof session.customer === "string" ? session.customer : session.customer.id;

  const subscriptionId =
    typeof session.subscription === "string" ? session.subscription : session.subscription.id;

  const user = await db.query.users.findFirst({
    where: eq(users.stripeCustomerId, customerId),
  });

  if (!user) {
    return;
  }

  if (!stripe) {
    throw new Error("Stripe is not configured");
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  await db.insert(subscriptions).values({
    userId: user.id,
    stripeSubscriptionId: subscription.id,
    stripePriceId: subscription.items.data[0]?.price.id ?? "",
    stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    status: subscription.status as
      | "active"
      | "canceled"
      | "incomplete"
      | "past_due"
      | "trialing"
      | "unpaid",
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });
}

export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const user = await db.query.users.findFirst({
    where: eq(users.stripeCustomerId, subscription.customer as string),
  });

  if (!user) {
    return;
  }

  await db
    .update(subscriptions)
    .set({
      stripePriceId: subscription.items.data[0]?.price.id ?? "",
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      status: subscription.status as
        | "active"
        | "canceled"
        | "incomplete"
        | "past_due"
        | "trialing"
        | "unpaid",
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
}

export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await db
    .update(subscriptions)
    .set({
      status: "canceled",
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
}

export async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const user = await db.query.users.findFirst({
    where: eq(users.stripeCustomerId, invoice.customer as string),
  });

  if (!user || !invoice.id) {
    return;
  }

  await db.insert(invoices).values({
    userId: user.id,
    stripeInvoiceId: invoice.id,
    amountPaid: invoice.amount_paid,
    currency: invoice.currency,
    status: invoice.status as "draft" | "open" | "paid" | "uncollectible" | "void",
    hostedInvoiceUrl: invoice.hosted_invoice_url ?? undefined,
    invoicePdf: invoice.invoice_pdf ?? undefined,
  });
}

export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const user = await db.query.users.findFirst({
    where: eq(users.stripeCustomerId, invoice.customer as string),
  });

  if (!user || !invoice.id) {
    return;
  }

  await db
    .update(subscriptions)
    .set({
      status: "past_due",
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));
}
