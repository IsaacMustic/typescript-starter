"use client";

import { InvoiceList } from "@/components/billing/invoice-list";

export default function InvoicesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Invoices</h1>
        <p className="text-muted-foreground mt-2">View and download your invoice history</p>
      </div>

      <InvoiceList />
    </div>
  );
}
