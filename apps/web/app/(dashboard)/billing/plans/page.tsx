"use client";

import { PricingCard } from "@/components/billing/pricing-card";

export default function PlansPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Choose a Plan</h1>
        <p className="text-muted-foreground mt-2">
          Select the plan that best fits your needs
        </p>
      </div>

      <PricingCard />
    </div>
  );
}

