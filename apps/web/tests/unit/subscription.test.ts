import { describe, expect, it } from "vitest";
import { canCreateTodo, hasFeature } from "@/lib/subscription";
import type { products, subscriptions } from "@/server/db/schema";

// Mock subscription and product types
type MockSubscription = typeof subscriptions.$inferSelect | null;
type MockProduct = typeof products.$inferSelect | null;

describe("Subscription Utilities", () => {
  describe("hasFeature", () => {
    it("should return false for null subscription", () => {
      const result = hasFeature(null, null, "unlimited_todos");
      expect(result).toBe(false);
    });

    it("should return true for unlimited_todos feature", () => {
      const subscription: MockSubscription = {
        id: "test-id",
        userId: "user-id",
        stripeSubscriptionId: "sub_test",
        stripePriceId: "price_test",
        stripeCurrentPeriodEnd: new Date(),
        status: "active",
        cancelAtPeriodEnd: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const product: MockProduct = {
        id: "prod_test",
        name: "Pro",
        stripeProductId: "prod_test",
        stripePriceId: "price_test",
        price: 1999,
        interval: "month",
        active: true,
        description: "Pro plan",
        features: ["unlimited_todos"],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = hasFeature(subscription, product, "unlimited_todos");
      expect(result).toBe(true);
    });

    it("should return false for feature not in product", () => {
      const subscription: MockSubscription = {
        id: "test-id",
        userId: "user-id",
        stripeSubscriptionId: "sub_test",
        stripePriceId: "price_test",
        stripeCurrentPeriodEnd: new Date(),
        status: "active",
        cancelAtPeriodEnd: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const product: MockProduct = {
        id: "prod_test",
        name: "Free",
        stripeProductId: "prod_test",
        stripePriceId: "price_test",
        price: 0,
        interval: "month",
        active: true,
        description: "Free plan",
        features: ["basic_todos"],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = hasFeature(subscription, product, "unlimited_todos");
      expect(result).toBe(false);
    });
  });

  describe("canCreateTodo", () => {
    it("should allow unlimited todos for pro users", () => {
      const subscription: MockSubscription = {
        id: "test-id",
        userId: "user-id",
        stripeSubscriptionId: "sub_test",
        stripePriceId: "price_test",
        stripeCurrentPeriodEnd: new Date(),
        status: "active",
        cancelAtPeriodEnd: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const product: MockProduct = {
        id: "prod_test",
        name: "Pro",
        stripeProductId: "prod_test",
        stripePriceId: "price_test",
        price: 1999,
        interval: "month",
        active: true,
        description: "Pro plan",
        features: ["unlimited_todos"],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = canCreateTodo(subscription, product, 100);
      expect(result).toBe(true);
    });

    it("should enforce 10 todo limit for free users", () => {
      const subscription: MockSubscription = null;
      const product: MockProduct = {
        id: "prod_test",
        name: "Free",
        stripeProductId: "prod_test",
        stripePriceId: "price_test",
        price: 0,
        interval: "month",
        active: true,
        description: "Free plan",
        features: ["basic_todos"],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result1 = canCreateTodo(subscription, product, 9);
      expect(result1).toBe(true);

      const result2 = canCreateTodo(subscription, product, 10);
      expect(result2).toBe(false);
    });
  });
});
