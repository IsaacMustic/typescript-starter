"use client";

import posthog from "posthog-js";
import { env } from "@/env";
import { useEffect } from "react";

export function initAnalytics() {
  if (
    typeof window !== "undefined" &&
    env.NEXT_PUBLIC_POSTHOG_KEY &&
    env.NEXT_PUBLIC_POSTHOG_HOST
  ) {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") {
          posthog.debug();
        }
      },
    });
  }
}

export function useAnalytics() {
  useEffect(() => {
    initAnalytics();
  }, []);
}

export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    posthog.capture(eventName, properties);
  }
}

export function identifyUser(userId: string, properties?: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    posthog.identify(userId, properties);
  }
}

