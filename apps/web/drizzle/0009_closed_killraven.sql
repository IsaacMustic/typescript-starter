-- Drop old unique constraint
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_provider_provider_account_id_unique";

-- Make provider nullable
ALTER TABLE "accounts" ALTER COLUMN "provider" DROP NOT NULL;

-- Sync provider with providerId for existing rows
UPDATE "accounts" SET "provider" = "provider_id" WHERE "provider" IS NULL;

-- Add new unique constraint on providerId and providerAccountId
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_provider_id_provider_account_id_unique" UNIQUE("provider_id","provider_account_id");

-- Update the existing trigger to also sync provider with providerId
DROP TRIGGER IF EXISTS sync_account_provider_trigger ON "accounts";
CREATE OR REPLACE FUNCTION sync_account_provider()
RETURNS TRIGGER AS $$
BEGIN
  -- Sync provider with providerId if provider is null or different
  IF NEW.provider IS NULL OR NEW.provider != NEW.provider_id THEN
    NEW.provider = NEW.provider_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_account_provider_trigger
BEFORE INSERT OR UPDATE ON "accounts"
FOR EACH ROW
EXECUTE FUNCTION sync_account_provider();