"use client";

import posthog from "posthog-js";
import { useEffect } from "react";
import { env } from "@/env";

function isPostHogConfigured(): boolean {
  return !!(
    typeof window !== "undefined" &&
    env.NEXT_PUBLIC_POSTHOG_KEY &&
    env.NEXT_PUBLIC_POSTHOG_HOST
  );
}

export function initAnalytics() {
  if (isPostHogConfigured()) {
    const key = env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = env.NEXT_PUBLIC_POSTHOG_HOST;
    if (!key || !host) return;
    posthog.init(key, {
      api_host: host,
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
  if (isPostHogConfigured()) {
    try {
      posthog.capture(eventName, properties);
    } catch (error) {
      // Silently fail if PostHog isn't initialized yet
      if (process.env.NODE_ENV === "development") {
        console.warn("PostHog capture failed:", error);
      }
    }
  }
}

export function identifyUser(userId: string, properties?: Record<string, unknown>) {
  if (isPostHogConfigured()) {
    try {
      posthog.identify(userId, properties);
    } catch (error) {
      // Silently fail if PostHog isn't initialized yet
      if (process.env.NODE_ENV === "development") {
        console.warn("PostHog identify failed:", error);
      }
    }
  }
}
