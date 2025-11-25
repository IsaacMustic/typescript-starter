"use client";

import { AlertCircle, Calendar, CreditCard } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";

export function SubscriptionCard() {
  const { data: subscription, isLoading } = trpc.billing.getSubscription.useQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>You are currently on the free plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/dashboard/billing/plans">View Plans</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "canceled":
        return "destructive";
      case "past_due":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Manage your subscription settings</CardDescription>
          </div>
          <Badge variant={getStatusBadgeVariant(subscription.status)}>
            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <span>Plan</span>
            </div>
            <p className="text-lg font-semibold">Pro</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Renews</span>
            </div>
            <p className="text-lg font-semibold">
              {new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {subscription.cancelAtPeriodEnd && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your subscription will cancel at the end of the billing period on{" "}
              {new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString()}.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/dashboard/billing/portal">Manage Subscription</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/dashboard/billing/invoices">View Invoices</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
