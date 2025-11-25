-- Add provider_id column as nullable first
ALTER TABLE "accounts" ADD COLUMN "provider_id" text;

-- Copy provider value to provider_id for existing rows
UPDATE "accounts" SET "provider_id" = "provider" WHERE "provider_id" IS NULL;

-- Make provider_id NOT NULL
ALTER TABLE "accounts" ALTER COLUMN "provider_id" SET NOT NULL;