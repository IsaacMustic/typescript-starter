"use client";

import { Activity, CheckSquare, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";

export default function UsagePage() {
  const { data: usage, isLoading: isLoadingUsage } = trpc.billing.getUsage.useQuery();
  const { data: subscription, isLoading: isLoadingSubscription } =
    trpc.billing.getSubscription.useQuery();

  const isLoading = isLoadingUsage || isLoadingSubscription;

  const todoLimit = subscription ? Number.POSITIVE_INFINITY : 10;
  const todoUsage = usage?.todos ?? 0;
  const todoPercentage = subscription ? 0 : Math.min((todoUsage / todoLimit) * 100, 100);

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold">Usage & Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track your usage and see how you're using the platform
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-primary" />
                <CardTitle>Todos</CardTitle>
              </div>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>Your todo usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{todoUsage}</span>
                    <span className="text-muted-foreground">
                      {subscription ? "unlimited" : `of ${todoLimit}`}
                    </span>
                  </div>
                  {!subscription && (
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${todoPercentage}%` }}
                      />
                    </div>
                  )}
                </div>
                {!subscription && todoUsage >= todoLimit && (
                  <p className="text-sm text-destructive">
                    You've reached your limit. Upgrade to create more todos.
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Subscription</CardTitle>
              </div>
            </div>
            <CardDescription>Your current plan</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="space-y-2">
                <p className="text-2xl font-bold">{subscription ? "Pro" : "Free"}</p>
                <p className="text-sm text-muted-foreground">
                  {subscription
                    ? "Unlimited access to all features"
                    : "Upgrade to unlock more features"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle>Status</CardTitle>
              </div>
            </div>
            <CardDescription>Account status</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="space-y-2">
                <p className="text-2xl font-bold capitalize">{subscription?.status ?? "Active"}</p>
                {subscription && (
                  <p className="text-sm text-muted-foreground">
                    Renews on {new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage Tips</CardTitle>
          <CardDescription>Make the most of your plan</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Organize your todos with clear titles and descriptions</li>
            <li>• Mark completed todos to keep your list clean</li>
            {!subscription && (
              <>
                <li>• Upgrade to Pro for unlimited todos and advanced features</li>
                <li>
                  • You're currently using {todoUsage} of {todoLimit} todos
                </li>
              </>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
