import type { Metadata } from "next";
import "./globals.css";
import { FileQuestion } from "lucide-react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ErrorBoundary } from "@/components/error-boundary";
import { NotFoundActions } from "@/components/not-found-actions";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TRPCProvider } from "@/lib/trpc-provider";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you're looking for could not be found.",
};

export default async function NotFound() {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ErrorBoundary>
          <TRPCProvider>
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="w-full max-w-md space-y-8 text-center">
                <div className="space-y-4">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                    <FileQuestion className="h-12 w-12 text-muted-foreground" />
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-6xl font-bold tracking-tight">404</h1>
                    <h2 className="text-2xl font-semibold">Page Not Found</h2>
                    <p className="text-muted-foreground">
                      Sorry, we couldn't find the page you're looking for. It might have been moved
                      or deleted.
                    </p>
                  </div>
                </div>

                <NotFoundActions />
              </div>
            </div>
            <Toaster />
          </TRPCProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
