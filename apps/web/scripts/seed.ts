import { db } from "@/lib/db";
import { products } from "@/server/db/schema";

async function seed() {
  console.log("Seeding database...");

  // Seed products
  await db.insert(products).values([
    {
      stripePriceId: "price_free",
      stripeProductId: "prod_free",
      name: "Free",
      description: "Free tier with basic features",
      price: 0,
      interval: "month",
      features: ["Up to 10 todos", "Basic support", "Community access"],
      active: true,
    },
    {
      stripePriceId: "price_pro_monthly",
      stripeProductId: "prod_pro",
      name: "Pro",
      description: "Pro tier with advanced features",
      price: 1999,
      interval: "month",
      features: [
        "Unlimited todos",
        "Priority support",
        "Advanced analytics",
        "Export data",
        "API access",
      ],
      active: true,
    },
    {
      stripePriceId: "price_pro_yearly",
      stripeProductId: "prod_pro",
      name: "Pro Annual",
      description: "Pro tier with annual billing",
      price: 19999,
      interval: "year",
      features: [
        "All Pro features",
        "2 months free",
        "Annual invoicing",
      ],
      active: true,
    },
  ]);

  console.log("Database seeded successfully!");
}

seed()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });

