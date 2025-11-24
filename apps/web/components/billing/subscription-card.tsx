"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc";

export function SubscriptionCard() {
  const { data: subscription, isLoading } = trpc.billing.getSubscription.useQuery();

  if (isLoading) {
    return <div className="p-4 border rounded-lg">Loading...</div>;
  }

  if (!subscription) {
    return (
      <div className="p-6 border rounded-lg space-y-4">
        <h3 className="text-xl font-semibold">No Active Subscription</h3>
        <p className="text-muted-foreground">You are currently on the free plan.</p>
        <Link
          href="/dashboard/billing/plans"
          className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md"
        >
          View Plans
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg space-y-4">
      <h3 className="text-xl font-semibold">Current Plan</h3>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Status</p>
        <p className="font-medium capitalize">{subscription.status}</p>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Renews</p>
        <p className="font-medium">
          {new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString()}
        </p>
      </div>
      {subscription.cancelAtPeriodEnd && (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
          <p className="text-sm">Your subscription will cancel at the end of the billing period.</p>
        </div>
      )}
      <Link
        href="/dashboard/billing/portal"
        className="inline-block border border-input px-4 py-2 rounded-md"
      >
        Manage Subscription
      </Link>
    </div>
  );
}
