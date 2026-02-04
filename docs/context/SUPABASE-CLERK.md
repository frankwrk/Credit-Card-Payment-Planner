# Supabase (DB) + Clerk (Auth) Setup

This doc describes how the database (Supabase) and authentication (Clerk) work together and how users are identified.

## Roles

| Service      | Role                                                                        |
| ------------ | --------------------------------------------------------------------------- |
| **Clerk**    | Authentication only: sign-up, sign-in, JWT issuance, user identity.         |
| **Supabase** | Database only: Postgres (cards, plans, plan_preferences). No Supabase Auth. |

## User identity: one ID everywhere

- **Clerk user ID** (e.g. `user_2abc...`) is the only user identifier.
- It comes from the Clerk JWT `sub` claim after the API verifies the token.
- All user-scoped tables use a **`user_id`** column (type `text`) that stores this Clerk user ID.
- There is **no** separate “Supabase user” or mapping table: Clerk user ID = `user_id` in the DB.

## API flow

1. Client sends a request with `Authorization: Bearer <Clerk JWT>`.
2. API auth middleware verifies the JWT with Clerk and reads `payload.sub` (Clerk user ID).
3. The API sets `userId` on the request context and runs all DB work inside `withRls(userId, work)`.
4. Every query is scoped to that `userId` (e.g. `WHERE user_id = $userId`), so users only see their own rows.

## Mobile auth (Expo)

- Mobile uses the Clerk Expo SDK with a secure token cache (expo-secure-store).
- Mobile sends Clerk session JWTs to the API; the mobile app does not connect directly to Supabase.

## Database (Supabase)

- **Connection:** API uses `SUPABASE_DATABASE_URL` (direct Postgres connection or service role).
- **Tables:** `cards`, `plans`, `plan_preferences`, `users`; each uses Clerk user ID as the primary link.
- **RLS:** Policies use `user_id = auth.jwt()->>'sub'` so that any connection that does provide a JWT (e.g. Clerk integration or future Supabase client) still enforces per-user access. When the API connects with the service/direct URL, RLS may be bypassed; in that case the API’s use of `withRls(userId, work)` is what enforces “users only see their own data.”

## Environment

- **Clerk:** `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY` (and optional `CLERK_JWT_ISSUER` / `CLERK_AUTHORIZED_PARTIES`) for JWT verification.
- **Supabase:** `SUPABASE_DATABASE_URL` for the Postgres connection. No Supabase Auth keys required for this setup.

## Clerk Webhooks (Users)

- Configure a Clerk webhook endpoint at `/webhooks/clerk`.
- Use the signing secret in `CLERK_WEBHOOK_SECRET`.
- The webhook upserts rows in `users` on `user.created` / `user.updated`, and deletes on `user.deleted`.
- `GET /api/users/me` will also backfill a missing `users` row by fetching the profile from Clerk (handy for local dev when webhooks aren’t delivered).

## Summary

Clerk = identity; Supabase = storage. The mapping is: **Clerk user ID = `user_id` in the database.** No extra mapping layer.
