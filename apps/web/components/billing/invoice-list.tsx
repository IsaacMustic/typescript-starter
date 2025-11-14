"use client";

import { trpc } from "@/lib/trpc";

export function InvoiceList() {
  const { data: invoices, isLoading } = trpc.billing.getInvoices.useQuery();

  if (isLoading) {
    return <div>Loading invoices...</div>;
  }

  if (!invoices || invoices.length === 0) {
    return (
      <div className="p-4 border rounded-lg">
        <p className="text-muted-foreground">No invoices found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice: { id: string; amountPaid: number; currency: string; createdAt: Date | string; status: string; hostedInvoiceUrl?: string | null }) => (
        <div key={invoice.id} className="p-4 border rounded-lg flex justify-between items-center">
          <div>
            <p className="font-medium">
              ${(invoice.amountPaid / 100).toFixed(2)} {invoice.currency.toUpperCase()}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(invoice.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded text-sm capitalize ${
              invoice.status === "paid"
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
            }`}>
              {invoice.status}
            </span>
            {invoice.hostedInvoiceUrl && (
              <a
                href={invoice.hostedInvoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                View
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

