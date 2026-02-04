import { Hono } from "hono";
import { eq, sql } from "@ccpp/shared/drizzle";
import { schema } from "../dbSchema.js";
import { db } from "../db.js";
import { env } from "../env.js";
import { AppError, ERROR_CODES } from "../errors.js";
import type { AppEnv, WithRls } from "../types.js";
import type { Context } from "hono";

const router = new Hono<AppEnv>();

function requireUserId(c: Context<AppEnv>): string {
  const userId = c.get("userId");
  if (!userId) {
    throw new AppError({
      status: 401,
      code: ERROR_CODES.UNAUTHORIZED,
      message: "Unauthorized request.",
    });
  }
  return userId;
}

function requireWithRls(c: Context<AppEnv>): WithRls {
  const withRls = c.get("withRls");
  if (!withRls) {
    throw new AppError({
      status: 500,
      code: ERROR_CODES.INTERNAL_ERROR,
      message: "Database context not available.",
    });
  }
  return withRls;
}

router.get("/debug/users/me", async (c) => {
  if (env.NODE_ENV === "production") {
    return c.json({ error: "Not found." }, 404);
  }

  const userId = requireUserId(c);
  const withRls = requireWithRls(c);

  const direct = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);

  const [directSearchPath] = await db.execute(
    sql`select current_setting('search_path', true) as search_path`
  );
  const [directPublic] = await db.execute(
    sql`select id from public.users where id = ${userId} limit 1`
  );
  const [directAuth] = await db.execute(
    sql`select id from auth.users where id::text = ${userId} limit 1`
  );

  const rls = await withRls(async (tx) => {
    const [row] = await tx
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1);

    const [claimSub] = await tx.execute(
      sql`select current_setting('request.jwt.claim.sub', true) as sub`
    );
    const [claims] = await tx.execute(
      sql`select current_setting('request.jwt.claims', true) as claims`
    );
    const [role] = await tx.execute(
      sql`select current_setting('role', true) as role`
    );
    const [searchPath] = await tx.execute(
      sql`select current_setting('search_path', true) as search_path`
    );
    const [authJwt] = await tx.execute(
      sql`select (auth.jwt()->>'sub') as sub`
    );

    return {
      found: !!row,
      claimSub: claimSub?.sub ?? null,
      claims: claims?.claims ?? null,
      role: role?.role ?? null,
      searchPath: searchPath?.search_path ?? null,
      authJwtSub: authJwt?.sub ?? null,
    };
  });

  return c.json({
    userId,
    directFound: direct.length > 0,
    directSearchPath: directSearchPath?.search_path ?? null,
    directPublicFound: !!directPublic?.id,
    directAuthFound: !!directAuth?.id,
    rls,
  });
});

router.get("/debug/auth/sub", async (c) => {
  if (env.NODE_ENV === "production") {
    return c.json({ error: "Not found." }, 404);
  }

  const userId = requireUserId(c);
  const withRls = requireWithRls(c);

  const rls = await withRls(async (tx) => {
    const [claimSub] = await tx.execute(
      sql`select current_setting('request.jwt.claim.sub', true) as sub`
    );
    const [claims] = await tx.execute(
      sql`select current_setting('request.jwt.claims', true) as claims`
    );
    const [role] = await tx.execute(
      sql`select current_setting('role', true) as role`
    );
    const [authJwt] = await tx.execute(
      sql`select (auth.jwt()->>'sub') as sub`
    );

    return {
      claimSub: claimSub?.sub ?? null,
      claims: claims?.claims ?? null,
      role: role?.role ?? null,
      authJwtSub: authJwt?.sub ?? null,
    };
  });

  return c.json({
    userId,
    matchesUserId: rls.authJwtSub === userId,
    rls,
  });
});

export default router;
