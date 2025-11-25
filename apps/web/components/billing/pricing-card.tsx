"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";

export function PricingCard() {
  const { data: plans, isLoading } = trpc.billing.getPlans.useQuery();

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-20 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans?.map(
        (
          plan: {
            id: string;
            name: string;
            description: string | null;
            price: number;
            interval: string;
            features?: string[] | null;
            stripePriceId: string;
          },
          index: number
        ) => {
          const isPopular = index === 1; // Middle plan is usually popular
          return (
            <Card
              key={plan.id}
              variant={isPopular ? "elevated" : "default"}
              className={isPopular ? "border-primary relative" : ""}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                {plan.description && <CardDescription>{plan.description}</CardDescription>}
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">${(plan.price / 100).toFixed(2)}</span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/{plan.interval}</span>
                    )}
                  </div>
                </div>
                {plan.features && plan.features.length > 0 && (
                  <ul className="space-y-3">
                    {plan.features.map((feature: string) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Button asChild className="w-full" variant={isPopular ? "default" : "outline"}>
                  <Link href={`/dashboard/billing/checkout?priceId=${plan.stripePriceId}`}>
                    {plan.price === 0 ? "Get Started" : "Subscribe"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        }
      )}
    </div>
  );
}
