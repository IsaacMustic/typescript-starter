-- Make providerAccountId nullable
ALTER TABLE "accounts" ALTER COLUMN "provider_account_id" DROP NOT NULL;

-- Add unique constraint to ensure one account per user per provider
-- This prevents duplicate credential accounts for the same user
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_provider_id_unique" UNIQUE("user_id", "provider_id");