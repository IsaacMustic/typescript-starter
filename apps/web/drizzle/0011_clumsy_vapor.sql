-- Delete existing sessions since they're invalid without token
DELETE FROM "sessions";--> statement-breakpoint
-- Add token column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sessions' AND column_name = 'token'
    ) THEN
        ALTER TABLE "sessions" ADD COLUMN "token" text NOT NULL;
    END IF;
END $$;--> statement-breakpoint
-- Add unique constraint on token if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'sessions_token_unique'
    ) THEN
        ALTER TABLE "sessions" ADD CONSTRAINT "sessions_token_unique" UNIQUE("token");
    END IF;
END $$;--> statement-breakpoint
-- Skip constraint if it already exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'accounts_user_id_provider_id_unique'
    ) THEN
        ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_provider_id_unique" UNIQUE("user_id","provider_id");
    END IF;
END $$;