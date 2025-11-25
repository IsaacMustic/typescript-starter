import type { products, subscriptions } from "@/server/db/schema";

const FREE_FEATURES = ["basic_todos", "basic_support"] as const;
const PRO_FEATURES = [
  "unlimited_todos",
  "priority_support",
  "advanced_analytics",
  "export_data",
  "api_access",
] as const;

type Feature = (typeof FREE_FEATURES)[number] | (typeof PRO_FEATURES)[number];

/**
 * Check if a user has access to a specific feature based on their subscription
 * @param subscription - User's subscription record (null for free tier)
 * @param product - Product/plan record containing features
 * @param feature - Feature to check access for
 * @returns true if user has access to the feature, false otherwise
 */
export function hasFeature(
  subscription: typeof subscriptions.$inferSelect | null,
  product: typeof products.$inferSelect | null,
  feature: Feature
): boolean {
  // If product is provided, check if the feature is in the product's features array
  if (product?.features && Array.isArray(product.features)) {
    if (product.features.includes(feature)) {
      // Feature is in product, but still need to check subscription status for pro features
      if (PRO_FEATURES.includes(feature as (typeof PRO_FEATURES)[number])) {
        // Pro features require active subscription
        return subscription?.status === "active";
      }
      // Free features are always available
      return true;
    }
    // Feature not in product's features array
    return false;
  }

  // Fallback to hardcoded logic if product is not provided
  // Free tier features
  if (FREE_FEATURES.includes(feature as (typeof FREE_FEATURES)[number])) {
    return true;
  }

  // Pro features require active subscription
  if (
    subscription &&
    subscription.status === "active" &&
    PRO_FEATURES.includes(feature as (typeof PRO_FEATURES)[number])
  ) {
    return true;
  }

  return false;
}

/**
 * Check if a user can create a new todo based on their subscription and current count
 * Free users are limited to 10 todos, Pro users have unlimited todos
 * @param subscription - User's subscription record (null for free tier)
 * @param product - Product/plan record containing features
 * @param currentTodoCount - Current number of todos the user has
 * @returns true if user can create a todo, false if limit reached
 */
export function canCreateTodo(
  subscription: typeof subscriptions.$inferSelect | null,
  product: typeof products.$inferSelect | null,
  currentTodoCount: number
): boolean {
  if (hasFeature(subscription, product, "unlimited_todos")) {
    return true;
  }

  return currentTodoCount < 10;
}
