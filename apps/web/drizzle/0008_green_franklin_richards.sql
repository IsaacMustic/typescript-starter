-- Add id column as nullable first
ALTER TABLE "accounts" ADD COLUMN "id" uuid;

-- Copy account_id value to id for existing rows
UPDATE "accounts" SET "id" = "account_id" WHERE "id" IS NULL;

-- Make id NOT NULL
ALTER TABLE "accounts" ALTER COLUMN "id" SET NOT NULL;

-- Create a trigger function to keep id in sync with account_id
CREATE OR REPLACE FUNCTION sync_account_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.id = NEW.account_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically sync id with account_id
CREATE TRIGGER sync_account_id_trigger
BEFORE INSERT OR UPDATE ON "accounts"
FOR EACH ROW
EXECUTE FUNCTION sync_account_id();