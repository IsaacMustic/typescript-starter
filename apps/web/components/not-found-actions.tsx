"use client";

import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function NotFoundActions() {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild variant="default" size="lg">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>
        <Button variant="outline" size="lg" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>

      <div className="pt-8">
        <p className="text-sm text-muted-foreground">
          If you believe this is a mistake, please{" "}
          <Link href="/contact" className="text-primary underline hover:no-underline">
            contact support
          </Link>
          .
        </p>
      </div>
    </>
  );
}
