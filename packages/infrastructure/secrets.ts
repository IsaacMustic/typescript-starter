import * as aws from "@pulumi/aws";
import { tags } from "./config";

// Secrets Manager secrets
export const databaseSecret = new aws.secretsmanager.Secret("database", {
  description: "Database credentials",
  tags: { ...tags, Name: "database-secret" },
});

export const authSecret = new aws.secretsmanager.Secret("auth", {
  description: "Better Auth secret",
  tags: { ...tags, Name: "auth-secret" },
});

export const stripeSecret = new aws.secretsmanager.Secret("stripe", {
  description: "Stripe API keys",
  tags: { ...tags, Name: "stripe-secret" },
});
