"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";

export default function VerifyEmailChangePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate: verifyEmailChange } = trpc.user.verifyEmailChange.useMutation({
    onSuccess: () => {
      setIsVerified(true);
      setIsVerifying(false);
      toast.success("Email address updated successfully");
      setTimeout(() => {
        router.push("/dashboard/profile");
      }, 2000);
    },
    onError: (err) => {
      setError(err.message || "Failed to verify email change");
      setIsVerifying(false);
      toast.error(err.message || "Failed to verify email change");
    },
  });

  useEffect(() => {
    if (token && email && !isVerifying && !isVerified && !error) {
      setIsVerifying(true);
      verifyEmailChange({ token, email });
    }
  }, [token, email, verifyEmailChange, isVerifying, isVerified, error]);

  if (!token || !email) {
    return (
      <div className="container flex min-h-screen items-center justify-center py-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid Verification Link</CardTitle>
            <CardDescription>
              The verification link is missing required parameters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>
                Please check your email for the correct verification link.
              </AlertDescription>
            </Alert>
            <Button onClick={() => router.push("/dashboard/profile")} className="mt-4 w-full">
              Go to Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex min-h-screen items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verifying Email Change</CardTitle>
          <CardDescription>Please wait while we verify your new email address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isVerifying && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-4 w-48" />
            </div>
          )}

          {isVerified && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="text-center text-sm text-muted-foreground">
                Your email address has been successfully updated to <strong>{email}</strong>
              </p>
              <p className="text-center text-xs text-muted-foreground">
                Redirecting to your profile...
              </p>
            </div>
          )}

          {error && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <XCircle className="h-12 w-12 text-destructive" />
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
              <Button onClick={() => router.push("/dashboard/profile")} className="w-full">
                Go to Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

