"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";

export default function PortalPage() {
  const router = useRouter();

  const { mutate: createPortalSession, isPending } = trpc.billing.createPortalSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to create portal session");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create portal session");
      // Redirect back to billing page on error
      setTimeout(() => {
        router.push("/dashboard/billing");
      }, 2000);
    },
  });

  useEffect(() => {
    if (!isPending) {
      createPortalSession();
    }
  }, [createPortalSession, isPending]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Redirecting to Customer Portal</h1>
        <p className="text-muted-foreground mt-2">
          Please wait while we prepare your billing portal session
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          {isPending ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Creating portal session...</p>
            </>
          ) : (
            <>
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-48" />
            </>
          )}
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription>
          If you're not redirected automatically, please check your subscription status or contact
          support.
        </AlertDescription>
      </Alert>
    </div>
  );
}

