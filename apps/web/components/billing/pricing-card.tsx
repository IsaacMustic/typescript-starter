"use client";

import Link from "next/link";
import { trpc } from "@/lib/trpc";

export function PricingCard() {
  const { data: plans, isLoading } = trpc.billing.getPlans.useQuery();

  if (isLoading) {
    return <div>Loading plans...</div>;
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans?.map(
        (plan: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          interval: string;
          features?: string[] | null;
          stripePriceId: string;
        }) => (
          <div key={plan.id} className="p-6 border rounded-lg space-y-4">
            <div>
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="text-muted-foreground">{plan.description}</p>
            </div>
            <div>
              <p className="text-4xl font-bold">${(plan.price / 100).toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">per {plan.interval}</p>
            </div>
            {plan.features && (
              <ul className="space-y-2">
                {plan.features.map((feature: string) => (
                  <li key={feature} className="text-sm">
                    {feature}
                  </li>
                ))}
              </ul>
            )}
            <Link
              href={`/dashboard/billing/checkout?priceId=${plan.stripePriceId}`}
              className="block w-full bg-primary text-primary-foreground px-4 py-2 rounded-md text-center"
            >
              {plan.price === 0 ? "Get Started" : "Subscribe"}
            </Link>
          </div>
        )
      )}
    </div>
  );
}
