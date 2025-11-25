import { boolean, index, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified"),
    name: text("name"),
    image: text("image"),
    stripeCustomerId: text("stripe_customer_id").unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
    stripeCustomerIdIdx: index("users_stripe_customer_id_idx").on(table.stripeCustomerId),
  })
);

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index("sessions_user_id_idx").on(table.userId),
    expiresAtIdx: index("sessions_expires_at_idx").on(table.expiresAt),
  })
);

export const accounts = pgTable(
  "accounts",
  {
    accountId: uuid("account_id").primaryKey().defaultRandom(),
    id: uuid("id").notNull().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text("provider"),
    providerId: text("provider_id").notNull(),
    providerAccountId: text("provider_account_id"),
    password: text("password"),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index("accounts_user_id_idx").on(table.userId),
    // Unique constraint on providerId and providerAccountId (allows multiple nulls)
    providerAccountUnique: unique("accounts_provider_id_provider_account_id_unique").on(
      table.providerId,
      table.providerAccountId
    ),
    // Ensure one account per user per provider (prevents duplicate credential accounts)
    userIdProviderIdUnique: unique("accounts_user_id_provider_id_unique").on(
      table.userId,
      table.providerId
    ),
  })
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (table) => ({
    identifierTokenUnique: unique("verification_tokens_identifier_token_unique").on(
      table.identifier,
      table.token
    ),
  })
);
