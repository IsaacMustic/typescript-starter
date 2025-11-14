"use client";

import { SubscriptionCard } from "@/components/billing/subscription-card";
import { InvoiceList } from "@/components/billing/invoice-list";

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription and billing information
        </p>
      </div>

      <SubscriptionCard />
      <div>
        <h2 className="text-2xl font-semibold mb-4">Invoices</h2>
        <InvoiceList />
      </div>
    </div>
  );
}

