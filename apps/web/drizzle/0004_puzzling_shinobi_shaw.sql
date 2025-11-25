-- Drop foreign key constraints
ALTER TABLE "sessions" DROP CONSTRAINT IF EXISTS "sessions_user_id_users_id_fk";
ALTER TABLE "accounts" DROP CONSTRAINT IF EXISTS "accounts_user_id_users_id_fk";
ALTER TABLE "todos" DROP CONSTRAINT IF EXISTS "todos_user_id_users_id_fk";
ALTER TABLE "subscriptions" DROP CONSTRAINT IF EXISTS "subscriptions_user_id_users_id_fk";
ALTER TABLE "invoices" DROP CONSTRAINT IF EXISTS "invoices_user_id_users_id_fk";

-- Rename accounts.id to account_id
ALTER TABLE "accounts" RENAME COLUMN "id" TO "account_id";

-- Convert users.id from text to uuid
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE uuid USING id::uuid;
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- Convert foreign key columns from text to uuid
ALTER TABLE "sessions" ALTER COLUMN "user_id" SET DATA TYPE uuid USING user_id::uuid;
ALTER TABLE "accounts" ALTER COLUMN "user_id" SET DATA TYPE uuid USING user_id::uuid;
ALTER TABLE "todos" ALTER COLUMN "user_id" SET DATA TYPE uuid USING user_id::uuid;
ALTER TABLE "subscriptions" ALTER COLUMN "user_id" SET DATA TYPE uuid USING user_id::uuid;
ALTER TABLE "invoices" ALTER COLUMN "user_id" SET DATA TYPE uuid USING user_id::uuid;

-- Recreate foreign key constraints
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "todos" ADD CONSTRAINT "todos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;