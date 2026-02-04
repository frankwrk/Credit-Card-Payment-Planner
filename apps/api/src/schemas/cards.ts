import { z } from "zod";

const dayOfMonth = z.number().int().min(1).max(31);
const cents = z.number().int().nonnegative();

export const createCardSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1).nullable().optional(),
  creditLimitCents: cents,
  currentBalanceCents: cents,
  minimumPaymentCents: cents,
  aprBps: z.number().int().nonnegative(),
  statementCloseDay: dayOfMonth,
  dueDateDay: dayOfMonth,
  excludeFromOptimization: z.boolean().optional(),
});

export const updateCardSchema = createCardSchema
  .partial()
  .refine((values) => Object.keys(values).length > 0, {
    message: "At least one field must be provided.",
  });

export const cardIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const cardResponseSchema = createCardSchema.extend({
  id: z.string().uuid(),
  userId: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const cardsResponseSchema = z.array(cardResponseSchema);

export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type CardIdParams = z.infer<typeof cardIdParamsSchema>;
