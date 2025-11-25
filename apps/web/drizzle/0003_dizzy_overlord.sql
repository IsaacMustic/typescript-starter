-- Drop foreign key constraints
ALTER TABLE "sessions" DROP CONSTRAINT IF EXISTS "sessions_user_id_users_id_fk";
ALTER TABLE "accounts" DROP CONSTRAINT IF EXISTS "accounts_user_id_users_id_fk";
ALTER TABLE "todos" DROP CONSTRAINT IF EXISTS "todos_user_id_users_id_fk";
ALTER TABLE "subscriptions" DROP CONSTRAINT IF EXISTS "subscriptions_user_id_users_id_fk";
ALTER TABLE "invoices" DROP CONSTRAINT IF EXISTS "invoices_user_id_users_id_fk";

-- Convert users.id from uuid to text
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE text USING id::text;
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;

-- Convert foreign key columns from uuid to text
ALTER TABLE "sessions" ALTER COLUMN "user_id" SET DATA TYPE text USING user_id::text;
ALTER TABLE "accounts" ALTER COLUMN "user_id" SET DATA TYPE text USING user_id::text;
ALTER TABLE "todos" ALTER COLUMN "user_id" SET DATA TYPE text USING user_id::text;
ALTER TABLE "subscriptions" ALTER COLUMN "user_id" SET DATA TYPE text USING user_id::text;
ALTER TABLE "invoices" ALTER COLUMN "user_id" SET DATA TYPE text USING user_id::text;

-- Recreate foreign key constraints
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "todos" ADD CONSTRAINT "todos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;