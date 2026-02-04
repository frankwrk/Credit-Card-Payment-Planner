# Architectural & Product Decisions

## 2026-02-03 — CI uses Corepack for pnpm provisioning

**Reason:** GitHub Actions jobs were failing with `Unable to locate executable file: pnpm`. Relying on Corepack keeps pnpm aligned with `packageManager` and avoids PATH issues in CI.

**Exact changes:**
- Enabled Corepack shims (`corepack enable`) and ensured `$HOME/.local/bin` is on PATH so `pnpm` is available for nested scripts (e.g., root scripts that call `pnpm -r`).
- Kept `corepack prepare pnpm@9.0.0 --activate` to pin the pnpm version.
- Removed `actions/setup-node` pnpm caching because it requires `pnpm` to be on PATH during setup on Blacksmith; rely on Blacksmith transparent cache and/or pnpm install caching instead.

## 2026-02-03 — CI runners switched to Blacksmith

**Reason:** Repo moved to the SYNQ-Studio org and CI is now running on Blacksmith runners for consistency with the new org setup.

**Exact changes:**
- Updated workflow jobs to use `runs-on: blacksmith-2vcpu-ubuntu-2404`.

## 2026-02-03 — Mobile TypeScript uses bundler module resolution

**Reason:** Expo's base tsconfig uses `customConditions`, which requires `moduleResolution` set to `bundler`, `node16`, or `nodenext`. CI typecheck failed with TS5098 under `node` resolution.

**Exact changes:**
- Set `apps/mobile/tsconfig.json` `compilerOptions.moduleResolution` to `bundler`.

## 2026-02-03 — Web ESLint FlatCompat includes recommended config

**Reason:** CI lint failed with `Missing parameter 'recommendedConfig' in FlatCompat constructor` due to `@eslint/eslintrc@3` requiring `recommendedConfig`.

**Exact changes:**
- Added `@eslint/js` and set `recommendedConfig: require("@eslint/js").configs.recommended` in `apps/web/eslint.config.js` to avoid relying on non-exported ESLint internal paths.
- Added `globals` and configured browser/node globals, ignored build output, and disabled `react/prop-types` for TypeScript components.

## 2026-02-03 — Shared package coverage ignores config files

**Reason:** CI coverage failed due to config files being counted in coverage, which are not part of runtime source and skew branch thresholds.

**Exact changes:**
- Excluded `**/*.config.ts` from `packages/shared/vitest.config.ts` coverage.

## 2026-02-03 — API imports Drizzle from shared to avoid type duplication

**Reason:** `drizzle-orm` has many peer dependencies, and pnpm installs multiple copies with different peer sets across workspaces (web/mobile/api). Mixing table definitions from one copy with query helpers from another caused TypeScript errors about incompatible `PgTable` and `SQL` types.

**Exact changes:**
- Added `packages/shared/src/drizzle.ts` re-exporting Drizzle modules.
- Updated API imports to use `@ccpp/shared/drizzle` so tables and helpers come from the same Drizzle instance.
- Restricted the shared Drizzle re-exports to `drizzle-orm` and `drizzle-orm/postgres-js` to avoid duplicate export names from `pg-core`.

## 2026-02-03 — Clerk (auth) + Supabase (DB); single user ID

**Clerk** is the only identity provider. **Supabase** is the database (Postgres). They are separate; there is no Supabase Auth.

- **Canonical user ID:** The Clerk user ID (JWT `sub` claim, e.g. `user_2abc...`) is the single user identifier. All app and DB logic use this.
- **Database:** Every table that is user-scoped has a `user_id` column (type `text`) storing the **Clerk user ID**. No separate “Supabase user” table or mapping table.
- **API:** Verifies the Clerk JWT, reads `payload.sub` (Clerk user ID), and passes it to all DB work via `withRls(userId, work)` so queries are always scoped to that user.
- **RLS:** Row Level Security policies use `user_id = auth.jwt()->>'sub'` so that if Supabase is ever used with a JWT (Clerk integration), RLS enforces the same user. When the API connects with the database URL (service role or direct connection), RLS may be bypassed; the API is then solely responsible for scoping by Clerk user ID inside `withRls`.

## 2026-02-04 — RLS uses Clerk JWT `sub` claim

**Reason:** Clerk’s Supabase integration sets the user identity in JWT `sub`, not `auth.uid()`. Aligning RLS to `auth.jwt()->>'sub'` allows direct Supabase access with Clerk tokens while preserving API scoping.

**Exact changes:**
- Added `packages/shared/migrations/0002_rls_clerk_sub.sql` to replace RLS policies with `user_id = auth.jwt()->>'sub'`.
- Updated docs to reference `auth.jwt()->>'sub'` instead of `auth.uid()`.

## 2026-02-04 — Initial migrations align RLS with Clerk `sub`

**Reason:** `auth.uid()` casts `sub` to UUID, which fails for Clerk IDs (`user_...`). New environments should use the Clerk-compatible policy from the start, not rely on a follow-up migration.

**Exact changes:**
- Updated `packages/shared/migrations/0000_initial.sql` and `packages/shared/migrations/0001_plan_preferences.sql` to use `auth.jwt()->>'sub'` in RLS policies and comments.

## 2026-02-04 — Dev-only auth JWT sanity check endpoint

**Reason:** Provide a fast way to confirm `auth.jwt()->>'sub'` resolves to the Clerk user ID inside API-managed RLS transactions.

**Exact changes:**
- Added `GET /api/debug/auth/sub` (dev-only) to return `auth.jwt()->>'sub'`, claim settings, and a `matchesUserId` flag.

## 2026-02-04 — /users/me backfills missing Clerk profiles

**Reason:** `/users/me` should succeed even when Clerk webhooks haven’t been delivered (common in local dev). Falling back to Clerk’s API ensures the `users` table is populated and keeps the Clerk `sub` identity consistent.

**Exact changes:**
- Updated `GET /api/users/me` to fetch the Clerk user profile on-demand when no row exists, then upsert into `users` and return it.

See `docs/context/SUPABASE-CLERK.md` for setup and mapping details.

## 2026-02-04 — Mobile uses Clerk Expo SDK with secure token cache

**Reason:** Align mobile auth with Clerk integration while keeping token storage secure on-device. Expo requires secure storage for session tokens.

**Exact changes:**
- Added `@clerk/clerk-expo` and `expo-secure-store` to the mobile app.
- Wrapped the mobile app in `ClerkProvider` and used the Expo token cache.
- Added sign-in and sign-up screens for email/password + email code verification.

## 2026-02-04 — Dependency alignment for React + ESLint

**Reason:** pnpm warnings surfaced mismatched React peer versions and deprecated ESLint dependencies. Aligning versions reduces peer conflicts and keeps tooling current.

**Exact changes:**
- Web app uses React/React DOM `^19.2.3` to satisfy Clerk peer ranges.
- Upgraded `react-day-picker` to `^9.10.0` (React 19 compatible peer range).
- Upgraded `eslint-plugin-react-hooks` to `^5.0.0` to support ESLint 9.
- Mobile app uses React `19.1.0` to match the React Native renderer version required by RN `0.81.5`.
- Enforced `bs58@^6.0.0` via pnpm overrides to satisfy Clerk/solana peer requirements.

## 2026-02-04 — Clerk sign-in handles additional verification steps

**Reason:** Clerk sign-in can return `needs_first_factor` or `needs_second_factor` (e.g. email code). The app previously showed a generic error instead of completing verification.

**Exact changes:**
- Updated the mobile sign-in screen to prepare and verify email code challenges when required.

## 2026-02-04 — Mobile uses API instead of local SQLite for cards/plans

**Reason:** To test end-to-end user flows and persist data in Supabase immediately, the mobile app now calls the API for cards and plan operations.

**Exact changes:**
- Added a mobile API client and replaced local SQLite calls for cards and plan generation/current-plan reads.
- Removed SQLite initialization from app startup (mobile no longer depends on local DB for core flows).
- Added `EXPO_PUBLIC_API_BASE_URL` to mobile env example.

## 2026-02-04 — Users table + Clerk webhook sync

**Reason:** Persisting Clerk user profiles in Supabase makes debugging and data auditing easier while keeping `user_id` as the canonical link to user data.

**Exact changes:**
- Added `users` table + RLS policy in `packages/shared/migrations/0003_users.sql`.
- Added `users` schema in `packages/shared/src/schema/user.ts`.
- Added `/webhooks/clerk` endpoint to upsert user records from Clerk events.
- Added `CLERK_WEBHOOK_SECRET` to API env configuration.

## 2026-02-04 — User linkage verification endpoint

**Reason:** Provide a quick check that Clerk users are being persisted and linked correctly.

**Exact changes:**
- Added `GET /api/users/me` to return the current user's `users` table record.

## 2026-02-04 — Dev-only RLS diagnostics endpoint

**Reason:** `/api/users/me` returned 404 despite existing rows; needed a deterministic way to inspect JWT claims and RLS visibility inside the API transaction.

**Exact changes:**
- Added `GET /api/debug/users/me` (dev-only) to report claim settings and direct vs RLS visibility for the current user.

## 2026-02-04 — Explicit `search_path` for Supabase pooler connections

**Reason:** Supabase also has `auth.users`; unqualified table names rely on `search_path`, which can resolve to the wrong schema (especially with pooler connections). This caused `public.users` rows to be invisible to the API even when they existed.

**Exact changes:**
- Set Postgres connection `options` to `-c search_path=public`.
- Set `search_path` to `public` inside `withRls` transactions to keep RLS-scoped queries consistent.

## 2026-02-04 — API schema imports use namespace to avoid ESM named export issues

**Reason:** ESM named exports from `@ccpp/shared/schema` can fail at runtime when the package is resolved as CommonJS. Namespace imports avoid the mismatch.

**Exact changes:**
- Replaced named imports from `@ccpp/shared/schema` with `import * as schema` in API routes/services.
- Replaced named imports from `@ccpp/shared` with `import * as shared` in API services.

## 2026-02-04 — Shared package marked as ESM

**Reason:** Node treated `@ccpp/shared` as CommonJS, which broke named exports at runtime. Declaring ESM ensures schema exports (including `users`) resolve correctly in the API.

**Exact changes:**
- Added `"type": "module"` to `packages/shared/package.json`.

## 2026-02-04 — API schema wrapper for CJS/ESM interop

**Reason:** Some runtimes still resolved `@ccpp/shared/schema` as CommonJS, leaving named exports undefined. A wrapper normalizes the schema module and prevents undefined tables.

**Exact changes:**
- Added `apps/api/src/dbSchema.ts` to normalize the schema module (`default` fallback).
- Updated API routes/services/db to import schema from `dbSchema.ts`.

## 2026-02-04 — Mobile debug action for Clerk JWT

**Reason:** For local debugging and API verification, the app needs a quick way to retrieve a fresh Clerk session JWT.

**Exact changes:**
- Added a Settings debug button to copy the current JWT to the clipboard.
- Added `expo-clipboard` dependency for secure clipboard access.

## 2026-02-04 — Prevent repeated API refresh loops on focus

**Reason:** `useFocusEffect` was re-triggering due to unstable dependencies, causing rapid refresh loops and API spam.

**Exact changes:**
- Stabilized token access in `Plan`, `Cards`, and `WhyPlan` screens by using a token ref inside focus callbacks.

## 2026-02-04 — API loads .env via dotenv

**Reason:** `tsx` does not load `.env` automatically, which caused missing required env variables at startup.

**Exact changes:**
- Added `dotenv` to API dependencies and imported `dotenv/config` in `apps/api/src/env.ts`.

## 2026-02-04 — Migration runner for Supabase

**Reason:** Manual SQL pastes are error-prone and slow; a simple migration runner ensures DB schema stays in sync.

**Exact changes:**
- Added `apps/api/scripts/run-migrations.mjs` to apply `packages/shared/migrations/*.sql`.
- Added `schema_migrations` table to track applied migrations.
- Added `pnpm --filter @ccpp/api migrate` script.
- Added `pnpm --filter @ccpp/api migrate:status` to list applied/pending migrations.

## 2026-02-04 — Migrations tolerate existing RLS policies

**Reason:** Some environments already had RLS policies created manually, causing migrations to fail with “policy already exists.”

**Exact changes:**
- Added `DROP POLICY IF EXISTS` statements to the initial migrations for cards, plans, and plan preferences.
- Added `DROP POLICY IF EXISTS` for the users table policy.

## 2026-02-04 — Demo data seed script

**Reason:** Provide a quick way to populate Supabase with test data for a specific Clerk user.

**Exact changes:**
- Added `apps/api/scripts/seed-demo.mjs` and `pnpm --filter @ccpp/api seed:demo`.

## 2026-02-04 — API card response schema defined locally

**Reason:** Runtime import from `@ccpp/shared/schema` failed to provide `selectCardSchema` in the API runtime. Defining the response schema in the API removes the runtime dependency while preserving the same shape.

**Exact changes:**
- Replaced `selectCardSchema` import in `apps/api/src/schemas/cards.ts` with a local `cardResponseSchema` definition.

## 2026-02-03 — Mobile MVP uses local SQLite persistence

- **Local-only MVP**: Cards, plan snapshots, and plan preferences are stored in SQLite on-device to support offline use.
- **Manual overrides**: Editing a card directly updates the stored record (no separate overrides table in MVP).

## 2026-02-03 — Solver hash is pure JS for mobile compatibility

- **Reason**: The deterministic plan ID hash must work in React Native without Node crypto.
- **Behavior**: Same inputs + same reference date still produce a stable 32-character hex plan ID.

## 2026-02-03 — Dependency policy and development standards

- **Policy**: Prefer the latest stable versions of dependencies unless blocked by documented compatibility constraints.
- **Deprecated tooling**: Avoid deprecated APIs, commands, and workflows; follow current Expo/RN best practices.
- **Agent discipline**: Agents must think through root causes and update documentation when adding fixes.

## 2026-02-02 — MVP excludes Plaid

Reason: validate planning logic before external dependencies.

## 2026-02-02 — No payment execution

Reason: safety, trust, and scope control.

## 2026-02-02 — AI propose → solver verify

Reason: auditability and correctness.
