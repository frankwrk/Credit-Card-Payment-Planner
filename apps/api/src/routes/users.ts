import { Hono, type Context } from "hono";
import { createClerkClient } from "@clerk/backend";
import { eq } from "@ccpp/shared/drizzle";
import { schema } from "../dbSchema.js";
import type { AppEnv, WithRls } from "../types.js";
import { AppError, ERROR_CODES } from "../errors.js";
import { env } from "../env.js";

const router = new Hono<AppEnv>();
const clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });

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

type ClerkUser = Awaited<ReturnType<typeof clerkClient.users.getUser>>;

function parseTimestamp(value: number | string | undefined): Date {
  if (typeof value === "number") return new Date(value);
  if (typeof value === "string") return new Date(value);
  return new Date();
}

function getPrimaryEmail(user: ClerkUser): string | null {
  const primaryId = user.primaryEmailAddressId;
  const addresses = user.emailAddresses ?? [];
  if (!primaryId) return addresses[0]?.emailAddress ?? null;
  return addresses.find((email) => email.id === primaryId)?.emailAddress ?? null;
}

router.get("/users/me", async (c) => {
  const userId = requireUserId(c);
  const withRls = requireWithRls(c);

  const user = await withRls(async (tx) => {
    const [row] = await tx
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .limit(1);
    return row ?? null;
  });

  if (user) {
    return c.json(user);
  }

  let clerkUser: ClerkUser;
  try {
    clerkUser = await clerkClient.users.getUser(userId);
  } catch (error) {
    throw new AppError({
      status: 502,
      code: ERROR_CODES.INTERNAL_ERROR,
      message: "Failed to load user profile from Clerk.",
      details: error instanceof Error ? { message: error.message } : undefined,
    });
  }

  const payload = {
    id: clerkUser.id,
    email: getPrimaryEmail(clerkUser),
    username: clerkUser.username ?? null,
    firstName: clerkUser.firstName ?? null,
    lastName: clerkUser.lastName ?? null,
    imageUrl: clerkUser.imageUrl ?? null,
    createdAt: parseTimestamp(clerkUser.createdAt),
    updatedAt: parseTimestamp(clerkUser.updatedAt),
  };

  console.info(`[users] backfill user_id=${userId} source=clerk`);

  const created = await withRls(async (tx) => {
    const [row] = await tx
      .insert(schema.users)
      .values(payload)
      .onConflictDoUpdate({
        target: schema.users.id,
        set: {
          email: payload.email,
          username: payload.username,
          firstName: payload.firstName,
          lastName: payload.lastName,
          imageUrl: payload.imageUrl,
          updatedAt: payload.updatedAt,
        },
      })
      .returning();
    return row ?? null;
  });

  if (!created) {
    throw new AppError({
      status: 500,
      code: ERROR_CODES.INTERNAL_ERROR,
      message: "Failed to persist user record.",
    });
  }

  return c.json(created);
});

export default router;
