import { Hono } from "hono";
import { Webhook } from "svix";
import { eq } from "@ccpp/shared/drizzle";
import { schema } from "../dbSchema.js";
import { env } from "../env.js";
import { withRls } from "../db.js";
import { AppError, ERROR_CODES } from "../errors.js";
import type { AppEnv } from "../types.js";

type ClerkEmailAddress = {
  id: string;
  email_address: string;
};

type ClerkUserPayload = {
  id: string;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
  email_addresses?: ClerkEmailAddress[];
  primary_email_address_id?: string | null;
  created_at?: number | string;
  updated_at?: number | string;
};

type ClerkWebhookEvent = {
  type: "user.created" | "user.updated" | "user.deleted";
  data: ClerkUserPayload & { id: string };
};

const router = new Hono<AppEnv>();

function parseTimestamp(value: number | string | undefined): Date {
  if (typeof value === "number") return new Date(value);
  if (typeof value === "string") return new Date(value);
  return new Date();
}

function getPrimaryEmail(payload: ClerkUserPayload): string | null {
  const primaryId = payload.primary_email_address_id;
  const addresses = payload.email_addresses ?? [];
  if (!primaryId) return addresses[0]?.email_address ?? null;
  return addresses.find((email) => email.id === primaryId)?.email_address ?? null;
}

router.post("/webhooks/clerk", async (c) => {
  const svixId = c.req.header("svix-id");
  const svixTimestamp = c.req.header("svix-timestamp");
  const svixSignature = c.req.header("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    throw new AppError({
      status: 400,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: "Missing webhook signature headers.",
    });
  }

  const body = await c.req.text();
  const webhook = new Webhook(env.CLERK_WEBHOOK_SECRET);

  let event: ClerkWebhookEvent;
  try {
    event = webhook.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (error) {
    throw new AppError({
      status: 400,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: "Invalid webhook signature.",
    });
  }

  const payload = event.data;
  if (!payload?.id) {
    throw new AppError({
      status: 400,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: "Webhook payload missing user id.",
    });
  }

  if (event.type === "user.deleted") {
    await withRls(payload.id, async (tx) => {
      await tx.delete(schema.users).where(eq(schema.users.id, payload.id));
    });
    return c.json({ status: "ok" });
  }

  if (event.type === "user.created" || event.type === "user.updated") {
    const user = {
      id: payload.id,
      email: getPrimaryEmail(payload),
      username: payload.username ?? null,
      firstName: payload.first_name ?? null,
      lastName: payload.last_name ?? null,
      imageUrl: payload.image_url ?? null,
      createdAt: parseTimestamp(payload.created_at),
      updatedAt: parseTimestamp(payload.updated_at),
    };

    await withRls(payload.id, async (tx) => {
      await tx
        .insert(schema.users)
        .values(user)
        .onConflictDoUpdate({
          target: schema.users.id,
          set: {
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
            updatedAt: user.updatedAt,
          },
        });
    });

    return c.json({ status: "ok" });
  }

  return c.json({ status: "ignored" });
});

export default router;
