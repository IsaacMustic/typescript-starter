"use client";

import { Activity, ArrowRight, CheckSquare, CreditCard, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/stat-card";
import type { Todo } from "@/components/todos/todo-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";

export default function DashboardPage() {
  const { data: user, isLoading: isLoadingUser } = trpc.user.getProfile.useQuery();
  const { data: subscription, isLoading: isLoadingSubscription } =
    trpc.billing.getSubscription.useQuery();
  const { data: usage, isLoading: isLoadingUsage } = trpc.billing.getUsage.useQuery();
  const { data: todosData, isLoading: isLoadingTodos } = trpc.todo.getAll.useQuery({
    limit: 5,
    offset: 0,
  });

  const isLoading = isLoadingUser || isLoadingSubscription || isLoadingUsage;

  // tRPC serializes Date objects as strings over JSON, but TypeScript infers Date from schema
  // biome-ignore lint/suspicious/noExplicitAny: Type assertion needed due to tRPC serialization
  const recentTodos = ((todosData?.todos as any as Todo[]) ?? []).slice(0, 5);

  const todoLimit = subscription ? Number.POSITIVE_INFINITY : 10;
  const todoUsage = usage?.todos ?? 0;
  const todoRemaining = subscription ? "Unlimited" : Math.max(0, todoLimit - todoUsage);

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {isLoading ? (
          <Skeleton className="h-5 w-48 mt-2" />
        ) : (
          <p className="text-muted-foreground mt-2">Welcome back, {user?.name ?? "User"}!</p>
        )}
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
          value={todoUsage}
          icon={CheckSquare}
          isLoading={isLoading}
          description={
            subscription
              ? "Unlimited"
              : `${todoRemaining} ${typeof todoRemaining === "number" ? "remaining" : ""}`
          }
        />
        <StatCard
          title="Status"
          value={subscription?.status ?? "Active"}
          icon={Activity}
          isLoading={isLoading}
          description="Account status"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/todos">
                <Plus className="mr-2 h-4 w-4" />
                Create New Todo
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/usage">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Usage & Analytics
              </Link>
            </Button>
            {!subscription && (
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/dashboard/billing/plans">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Upgrade to Pro
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/settings">
                <Activity className="mr-2 h-4 w-4" />
                Account Settings
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Todos</CardTitle>
                <CardDescription>Your latest tasks</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/todos">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingTodos ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            ) : recentTodos.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No todos yet. Create your first one!
              </p>
            ) : (
              <div className="space-y-2">
                {recentTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors"
                  >
                    <CheckSquare
                      className={`h-4 w-4 ${
                        todo.completed ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`text-sm flex-1 ${
                        todo.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {todo.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
