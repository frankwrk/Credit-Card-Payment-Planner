-- Align RLS with Clerk Supabase integration: user_id = auth.jwt()->>'sub'

DROP POLICY IF EXISTS "Users can only access their own cards" ON "cards";
DROP POLICY IF EXISTS "Users can only access their own plans" ON "plans";
DROP POLICY IF EXISTS "Users can only access their own plan preferences" ON "plan_preferences";

CREATE POLICY "Users can only access their own cards"
  ON "cards"
  FOR ALL
  USING (user_id = (auth.jwt()->>'sub'))
  WITH CHECK (user_id = (auth.jwt()->>'sub'));

CREATE POLICY "Users can only access their own plans"
  ON "plans"
  FOR ALL
  USING (user_id = (auth.jwt()->>'sub'))
  WITH CHECK (user_id = (auth.jwt()->>'sub'));

CREATE POLICY "Users can only access their own plan preferences"
  ON "plan_preferences"
  FOR ALL
  USING (user_id = (auth.jwt()->>'sub'))
  WITH CHECK (user_id = (auth.jwt()->>'sub'));
