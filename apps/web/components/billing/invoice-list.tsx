"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";

interface Invoice {
  id: string;
  amountPaid: number;
  currency: string;
  createdAt: Date | string;
  status: string;
  hostedInvoiceUrl?: string | null;
}

export function InvoiceList() {
  const { data: invoices, isLoading } = trpc.billing.getInvoices.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No invoices found.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice: Invoice) => (
        <Card key={invoice.id} className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">
                ${(invoice.amountPaid / 100).toFixed(2)} {invoice.currency.toUpperCase()}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(invoice.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <span
                className={`px-2 py-1 rounded text-sm capitalize ${
                  invoice.status === "paid"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                }`}
              >
                {invoice.status}
              </span>
              {invoice.hostedInvoiceUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={invoice.hostedInvoiceUrl} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
