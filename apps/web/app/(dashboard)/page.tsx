"use client";

import { trpc } from "@/lib/trpc";

export default function DashboardPage() {
  const { data: user } = trpc.user.getProfile.useQuery();
  const { data: subscription } = trpc.billing.getSubscription.useQuery();
  const { data: usage } = trpc.billing.getUsage.useQuery();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user?.name ?? "User"}!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground">
            Subscription
          </h3>
          <p className="text-2xl font-bold mt-2">
            {subscription ? "Pro" : "Free"}
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground">Todos</h3>
          <p className="text-2xl font-bold mt-2">{usage?.todos ?? 0}</p>
        </div>
        <div className="p-6 border rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
          <p className="text-2xl font-bold mt-2 capitalize">
            {subscription?.status ?? "Active"}
          </p>
        </div>
      </div>
    </div>
  );
}

