# Phase 2 E2E Validation + Phase 3 Server Sync Checklist

**Owner:** TBD
**Last updated:** 2026-02-03

## Phase 2: End-to-End Validation (API)

- [x] Create E2E API validation script (`scripts/e2e-api.sh`).
- [x] Create this checklist and track progress in-repo.
- [ ] Confirm `SUPABASE_DATABASE_URL` connectivity from `apps/api` and required tables exist (cards, plans, plan_preferences).
- [ ] Apply `0002_rls_clerk_sub.sql` in Supabase SQL editor (RLS now uses `auth.jwt()->>'sub'`).
- [ ] Apply `0003_users.sql` in Supabase SQL editor (users table + RLS).
- [ ] Verify API auth wiring with a real Clerk JWT (`/api/*` requires Authorization).
- [ ] POST `/api/cards` creates two cards.
- [ ] GET `/api/cards` returns the created cards.
- [ ] POST `/api/plan/generate` persists plan + preferences.
- [ ] GET `/api/plan/current` returns the latest plan.
- [ ] POST `/api/overrides` updates a card and recomputes a plan.
- [ ] POST `/api/plan/actions/:actionId/mark-paid` marks paid, updates balance, recomputes plan.
- [ ] Clean up: DELETE created cards.
- [ ] Update `docs/context/PLANS.md` to mark Phase 2 complete with validation notes.
- [ ] Update `docs/context/DECISIONS.md` with exact validation details (date, environment, endpoints).

## Phase 3: Server Sync (Primary Direction)

- [ ] Add minimal mobile API client (`apps/mobile/src/data/api.ts`) with base URL + typed fetch.
- [ ] Add Clerk auth to mobile (Expo-compatible) and inject JWT into API requests.
- [ ] Implement remote `listCards` with SQLite fallback.
- [ ] Implement remote `plan/current` with local snapshot fallback.
- [ ] Define source-of-truth rules for plan data (online vs offline).
- [ ] Add `lastSyncedAt` to local SQLite for cards + plan snapshots.
- [ ] Implement offline queue for overrides and flush on reconnect.
- [ ] Update `docs/context/PLANS.md` Phase 3 scope and deliverables.
- [ ] Update `docs/context/DECISIONS.md` with sync rules and conflict handling.
