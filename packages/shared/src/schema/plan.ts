import { index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const plans = pgTable(
  "plans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    generatedAt: timestamp("generated_at", { withTimezone: true }).notNull().defaultNow(),
    strategy: text("strategy").notNull(),
    availableCashCents: integer("available_cash_cents").notNull(),
    totalPaymentCents: integer("total_payment_cents").notNull(),
    snapshotJson: jsonb("snapshot_json").$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("plans_user_id_idx").on(table.userId),
    generatedAtIdx: index("plans_generated_at_idx").on(table.generatedAt),
  })
);

export const insertPlanSchema = createInsertSchema(plans);
export const selectPlanSchema = createSelectSchema(plans);

export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;
