-- Users synced from Clerk webhooks. user_id for data tables still uses Clerk user ID (sub).

CREATE TABLE IF NOT EXISTS "users" (
  "id" text PRIMARY KEY,
  "email" text,
  "username" text,
  "first_name" text,
  "last_name" text,
  "image_url" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only access their own user record" ON "users";
CREATE POLICY "Users can only access their own user record"
  ON "users"
  FOR ALL
  USING (id = (auth.jwt()->>'sub'))
  WITH CHECK (id = (auth.jwt()->>'sub'));
