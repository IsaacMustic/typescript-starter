import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  index,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "canceled",
  "incomplete",
  "past_due",
  "trialing",
  "unpaid",
]);

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "open",
  "paid",
  "uncollectible",
  "void",
]);

export const subscriptionIntervalEnum = pgEnum("subscription_interval", [
  "month",
  "year",
]);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
    stripePriceId: text("stripe_price_id").notNull(),
    stripeCurrentPeriodEnd: timestamp("stripe_current_period_end", {
      withTimezone: true,
    }).notNull(),
    status: subscriptionStatusEnum("status").notNull(),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdIdx: index("subscriptions_user_id_idx").on(table.userId),
    stripeSubscriptionIdIdx: index("subscriptions_stripe_subscription_id_idx").on(
      table.stripeSubscriptionId,
    ),
    statusIdx: index("subscriptions_status_idx").on(table.status),
  }),
);

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    stripeInvoiceId: text("stripe_invoice_id").notNull().unique(),
    amountPaid: integer("amount_paid").notNull(),
    currency: text("currency").notNull().default("usd"),
    status: invoiceStatusEnum("status").notNull(),
    hostedInvoiceUrl: text("hosted_invoice_url"),
    invoicePdf: text("invoice_pdf"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdIdx: index("invoices_user_id_idx").on(table.userId),
    stripeInvoiceIdIdx: index("invoices_stripe_invoice_id_idx").on(
      table.stripeInvoiceId,
    ),
    statusIdx: index("invoices_status_idx").on(table.status),
  }),
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    stripePriceId: text("stripe_price_id").notNull().unique(),
    stripeProductId: text("stripe_product_id").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    price: integer("price").notNull(),
    interval: subscriptionIntervalEnum("interval").notNull(),
    features: jsonb("features").$type<string[]>(),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    stripePriceIdIdx: index("products_stripe_price_id_idx").on(
      table.stripePriceId,
    ),
    activeIdx: index("products_active_idx").on(table.active),
  }),
);

