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

export function hasFeature(
  subscription: typeof subscriptions.$inferSelect | null,
  _product: typeof products.$inferSelect | null,
  feature: Feature
): boolean {
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
