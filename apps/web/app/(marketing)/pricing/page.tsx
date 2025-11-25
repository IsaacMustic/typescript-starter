import { PricingCard } from "@/components/billing/pricing-card";

export default function PricingPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for you. All plans include our core features with
            additional benefits as you upgrade.
          </p>
        </div>

        <PricingCard />

        <div className="text-center text-sm text-muted-foreground">
          <p>All plans include a 14-day free trial. Cancel anytime.</p>
        </div>
      </div>
    </div>
  );
}

