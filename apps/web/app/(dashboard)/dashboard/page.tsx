"use client";

import { Activity, CheckSquare, CreditCard } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";

export default function DashboardPage() {
  const { data: user, isLoading: isLoadingUser } = trpc.user.getProfile.useQuery();
  const { data: subscription, isLoading: isLoadingSubscription } =
    trpc.billing.getSubscription.useQuery();
  const { data: usage, isLoading: isLoadingUsage } = trpc.billing.getUsage.useQuery();

  const isLoading = isLoadingUser || isLoadingSubscription || isLoadingUsage;

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          {isLoading ? <Skeleton className="h-5 w-48" /> : `Welcome back, ${user?.name ?? "User"}!`}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Subscription"
          value={subscription ? "Pro" : "Free"}
          icon={CreditCard}
          isLoading={isLoading}
          description={
            subscription
              ? `Active until ${new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString()}`
              : "Upgrade to unlock more features"
          }
        />
        <StatCard
          title="Todos"
          value={usage?.todos ?? 0}
          icon={CheckSquare}
          isLoading={isLoading}
          description={subscription ? "Unlimited" : "10 remaining"}
        />
        <StatCard
          title="Status"
          value={subscription?.status ?? "Active"}
          icon={Activity}
          isLoading={isLoading}
          description="Account status"
        />
      </div>
    </div>
  );
}
