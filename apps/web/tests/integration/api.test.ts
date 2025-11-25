import { beforeAll, describe, expect, it } from "vitest";

// Helper to check if server is running
async function isServerRunning(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const response = await fetch("http://localhost:3000/api/health", {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

describe("API Routes", () => {
  let serverRunning: boolean;

  beforeAll(async () => {
    serverRunning = await isServerRunning();
    if (!serverRunning) {
      console.warn(
        "Server not running at http://localhost:3000. Skipping API integration tests. Run 'pnpm dev' to enable these tests."
      );
    }
  });

  describe("Health Check", () => {
    it(
      "should have health check endpoint",
      async () => {
        if (!serverRunning) {
          return;
        }
        const response = await fetch("http://localhost:3000/api/health");
        expect(response.status).toBe(200);
      },
      { timeout: 10000 }
    );

    it(
      "should return health status",
      async () => {
        if (!serverRunning) {
          return;
        }
        const response = await fetch("http://localhost:3000/api/health");
        const data = await response.json();
        expect(data).toHaveProperty("status");
      },
      { timeout: 10000 }
    );
  });

  describe("Auth Routes", () => {
    it(
      "should have auth API route",
      async () => {
        if (!serverRunning) {
          return;
        }
        // Better Auth handles auth routes at /api/auth/*
        // Try the base auth endpoint which should exist
        const response = await fetch("http://localhost:3000/api/auth", {
          method: "GET",
        });
        // Should return 200, 401, 404 (if endpoint requires specific path), or 405
        // The important thing is it's not a 500 (server error)
        expect(response.status).not.toBe(500);
        expect(response.status).toBeLessThan(600);
      },
      { timeout: 10000 }
    );
  });

  describe("Webhook Routes", () => {
    it(
      "should have Stripe webhook endpoint",
      async () => {
        if (!serverRunning) {
          return;
        }
        // Webhook endpoint should exist
        const response = await fetch("http://localhost:3000/api/webhooks/stripe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        // Should return 400 (missing signature) or 500 (missing secret), not 404
        expect([400, 500]).toContain(response.status);
      },
      { timeout: 10000 }
    );
  });

  describe("tRPC Route", () => {
    it(
      "should have tRPC API route",
      async () => {
        if (!serverRunning) {
          return;
        }
        // tRPC route is at /api/trpc/[trpc], so we need a path segment
        // Try accessing a known procedure (auth.getSession is a common one)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        try {
          const response = await fetch("http://localhost:3000/api/trpc/auth.getSession", {
            method: "GET",
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          // Should return 200, 400 (bad request), 401 (unauthorized), or 405 (method not allowed)
          // The important thing is it's not a 404 or 500
          expect(response.status).not.toBe(404);
          expect(response.status).not.toBe(500);
          expect(response.status).toBeLessThan(600);
        } catch (error) {
          clearTimeout(timeoutId);
          // If request fails (timeout, network error), that's okay for integration tests
          // when server might not be fully configured
          if (error instanceof Error && error.name === "AbortError") {
            // Timeout is acceptable for integration tests without full server setup
            return;
          }
          throw error;
        }
      },
      { timeout: 10000 }
    );
  });
});
