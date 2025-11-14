"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export function OAuthButtons() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleOAuth = async (provider: "google" | "github") => {
    setIsLoading(provider);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => handleOAuth("google")}
        className="w-full border border-input px-4 py-2 rounded-md font-medium disabled:opacity-50"
        disabled={!!isLoading}
      >
        {isLoading === "google" ? "Loading..." : "Continue with Google"}
      </button>
      <button
        type="button"
        onClick={() => handleOAuth("github")}
        className="w-full border border-input px-4 py-2 rounded-md font-medium disabled:opacity-50"
        disabled={!!isLoading}
      >
        {isLoading === "github" ? "Loading..." : "Continue with GitHub"}
      </button>
    </div>
  );
}

