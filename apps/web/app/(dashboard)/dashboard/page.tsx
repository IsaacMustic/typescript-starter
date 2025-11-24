"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";

export default function DashboardPage() {
  const { data: user, isLoading: isLoadingUser } = trpc.user.getProfile.useQuery();
  const { data: subscription, isLoading: isLoadingSubscription } =
    trpc.billing.getSubscription.useQuery();
  const { data: usage, isLoading: isLoadingUsage } = trpc.billing.getUsage.useQuery();

  const isLoading = isLoadingUser || isLoadingSubscription || isLoadingUsage;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          {isLoading ? <Skeleton className="h-5 w-48" /> : `Welcome back, ${user?.name ?? "User"}!`}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Subscription</h3>
          {isLoading ? (
            <Skeleton className="h-8 w-16 mt-2" />
          ) : (
            <p className="text-2xl font-bold mt-2">{subscription ? "Pro" : "Free"}</p>
          )}
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Todos</h3>
          {isLoading ? (
            <Skeleton className="h-8 w-16 mt-2" />
          ) : (
            <p className="text-2xl font-bold mt-2">{usage?.todos ?? 0}</p>
          )}
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
          {isLoading ? (
            <Skeleton className="h-8 w-16 mt-2" />
          ) : (
            <p className="text-2xl font-bold mt-2 capitalize">{subscription?.status ?? "Active"}</p>
          )}
        </Card>
      </div>
    </div>
  );
}
