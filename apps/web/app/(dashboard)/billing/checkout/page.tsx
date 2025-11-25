"use client";

import { Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const priceId = searchParams.get("priceId");

  const { mutate: createCheckoutSession, isPending } = trpc.billing.createCheckoutSession.useMutation(
    {
      onSuccess: (data) => {
        if (data.url) {
          window.location.href = data.url;
        } else {
          toast.error("Failed to create checkout session");
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create checkout session");
      },
    }
  );

  useEffect(() => {
    if (priceId && !isPending) {
      createCheckoutSession({ priceId });
    }
  }, [priceId, createCheckoutSession, isPending]);

  if (!priceId) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground mt-2">Complete your subscription purchase</p>
        </div>
        <Alert variant="destructive">
          <AlertDescription>No price ID provided. Please select a plan to continue.</AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Select a Plan</CardTitle>
            <CardDescription>Choose a subscription plan to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <button
              type="button"
              onClick={() => router.push("/dashboard/billing/plans")}
              className="text-primary hover:underline"
            >
              View available plans →
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Redirecting to Checkout</h1>
        <p className="text-muted-foreground mt-2">Please wait while we prepare your checkout session</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          {isPending ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Creating checkout session...</p>
            </>
          ) : (
            <>
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-48" />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

